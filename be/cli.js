var ejs = require('ejs');
var fs = require('fs');
var path = require('path');
var jp = require('jsonpath');
var safeEval = require('safe-eval')

function generateFiles(params){
  for(var i=0;i<params.executions.length;i++){
    console.log('Generator execution['+i+']');
    var template=params.executions[i].template; 
    var jsonpath=params.executions[i].jsonpath; 
    var output=params.executions[i].output; 
    //
    var templateDirName='../resources/templates/'+template;
    var generatedDirName='../resources/generated/'+output;
    //
    if (!fs.existsSync(generatedDirName)){
      console.log("  Creating folder     "+generatedDirName);
      fs.mkdirSync(generatedDirName, { recursive: true });
    }
    //
    var valuesIterator=jp.query(params.values, jsonpath);
    for(var ii=0;ii<valuesIterator.length;ii++){
      console.log('Generator execution['+i+'].element['+ii+']');
      //console.log('Generator execution['+i+'].vars.length='+params.executions[i].vars.length);
      var element=valuesIterator[ii];
      var values={
       'params': params,
       'element': element,
       'i': i,
       'ii': ii,
      }
      var vars={};
      for(var iii=0;iii<params.executions[i].vars.length;iii++){
        var vName=params.executions[i].vars[iii].name; 
        var vExpr=params.executions[i].vars[iii].expr;
        vars[vName] = safeEval(vExpr,values);
        console.log('Generator execution['+i+'].element['+ii+'].var['+iii+'], vName:'+vName+', vExpr:'+vExpr+', val:'+vars[vName]);
      }
      //console.log('  Vars: '+JSON.stringify(vars));
      values['vars']= vars;
      generateFilesInDir(templateDirName, generatedDirName, values);
    }
  }
}

function replaceVarsInFileName(fileName, values){
  for(var prop in values.vars){
    if (fileName.includes('['+prop+']')){
      //console.log('Replacing property ' + prop + ': ' + values.vars[prop]);
      fileName=fileName.replace('['+prop+']',values.vars[prop]);
    }else{
      //console.log('Skipping property ' + prop + ' in ' + fileName);
    }
  }
  return fileName;
}

function generateFilesInDir(templateDirName, generatedDirName, values){
  var files=fs.readdirSync(templateDirName);
  for(var i=0;i<files.length;i++){
    var srcFilename=path.join(templateDirName,files[i]);
    var tgtFilename=path.join(generatedDirName,replaceVarsInFileName(files[i], values));
    var stat = fs.lstatSync(srcFilename);
    if (stat.isFile()){
      if (files[i].endsWith('.ejs')){
        generateFile(templateDirName, files[i], generatedDirName, values);        
      } else if (files[i]=='.gitignore'){
        console.log('  Skipping '+srcFilename);
      } else {
        console.log('  Copying '+srcFilename+' to '+tgtFilename);
        fs.copyFileSync(srcFilename, tgtFilename);
      }
    }
    if (stat.isDirectory()){
      generateFilesInDir(srcFilename, tgtFilename, values);        
    }
  };
}

function generateFile(templateDirName, templateFileName, outputFolder, values){
  var srcFilename=path.join(templateDirName,templateFileName);
  var tgtFilename=path.join(outputFolder,replaceVarsInFileName(templateFileName.substring(0,templateFileName.length-4), values));
  console.log("  Applying template: "+srcFilename);
  //console.log('    Values: '+JSON.stringify(values));
  var template = fs.readFileSync(srcFilename, 'utf8');
  var renderized = ejs.render(template, values);
  //console.log('    '+renderized);
  if (!fs.existsSync(outputFolder)){
    console.log("    Creating folder     "+outputFolder);
    fs.mkdirSync(outputFolder, { recursive: true });
  }
  console.log("    Writing file     "+srcFilename+"->"+tgtFilename);
  fs.writeFileSync(tgtFilename, renderized, 'utf8');
  //console.log("    Written successfully...");
}

var myArgs = process.argv.slice(2);
if (myArgs[0]==undefined){
  console.log('Arg[0] is missing: Input json filename. E.g. ./run-cli.sh model1.json');
  return;
}

var inputFileName=myArgs[0];

var params = JSON.parse(fs.readFileSync('../resources/input/'+inputFileName+'.json', 'utf8'));
generateFiles(params);
