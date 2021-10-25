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
    var __templateDirName='./templates/'+template;
    var __generatedDirName='./generated/'+output;
    //
    if (!fs.existsSync(__generatedDirName)){
      console.log("  Creating folder     "+__generatedDirName);
      fs.mkdirSync(__generatedDirName, { recursive: true });
    }
    //
    var valuesIterator=jp.query(params.values, jsonpath);
    for(var ii=0;ii<valuesIterator.length;ii++){
      console.log('Generator execution['+i+'].iterator['+ii+']');
      //console.log('Generator execution['+i+'].vars.length='+params.executions[i].vars.length);
      var iterator=valuesIterator[ii];
      var values={
       'params': params,
       'iterator': iterator,
       'i': i,
       'ii': ii,
      }
      var vars={};
      for(var iii=0;iii<params.executions[i].vars.length;iii++){
        var vName=params.executions[i].vars[iii].name; 
        var vExpr=params.executions[i].vars[iii].expr;
        vars[vName] = safeEval(vExpr,values);
        console.log('Generator execution['+i+'].iterator['+ii+'].var['+iii+'], vName:'+vName+', vExpr:'+vExpr+', val:'+vars[vName]);
      }
      //console.log('  Vars: '+JSON.stringify(vars));
      values['vars']= vars;
      generateFilesInDir(__templateDirName, __generatedDirName, values);
    }
  }
}

function replaceVarsInFileName(fileName, values){
  for(var prop in values.vars){
    if (fileName.includes('__'+prop+'__')){
      //console.log('Replacing property ' + prop + ': ' + values.vars[prop]);
      fileName=fileName.replace('__'+prop+'__',values.vars[prop]);
    }else{
      //console.log('Skipping property ' + prop + ' in ' + fileName);
    }
  }
  return fileName;
}

function generateFilesInDir(__templateDirName, __generatedDirName, values){
  var files=fs.readdirSync(__templateDirName);
  for(var i=0;i<files.length;i++){
    var srcFilename=path.join(__templateDirName,files[i]);
    var tgtFilename=path.join(__generatedDirName,replaceVarsInFileName(files[i], values));
    var stat = fs.lstatSync(srcFilename);
    if (stat.isFile()){
      if (files[i].endsWith('.ejs')){
        generateFile(__templateDirName, files[i], __generatedDirName, values);        
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

var params = {
  'executions': [
    {
      'template': 'template1/Int',
      'output': 'template1',
      'jsonpath': '$',
      'vars': [
        {'name': 'IntName', 'expr': 'iterator.IntName'}
      ]
    },
    {
      'template': 'template1/IntFlow',
      'output': 'template1',
      'jsonpath': '$.IntFlows[*]',
      'vars': [
        {'name': 'IntName', 'expr': 'params.values.IntName'},
        {'name': 'FlowName', 'expr': 'iterator.FlowName'}
      ]
    }
  ],
  'values': 
    {
      'IntName': 'TheApp1',
      'IntFlows': [
        {
          'FlowName': 'Flow11',
        },
        {
          'FlowName': 'Flow12',
        },
      ],
    }
  };
generateFiles(params);

exports.generate = (req, res) => {
  res.status(200).end('{"status:":"ok"}').send();
};