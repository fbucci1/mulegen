var ejs = require('ejs');
var fs = require('fs');
var path = require('path');
var jp = require('jsonpath');

function generateFiles(params){
  for(var i=0;i<params.executions.length;i++){
    var template=params.executions[i].template; 
    var jsonpath=params.executions[i].jsonpath; 
    //
    var __templateDirName='./templates/'+template;
    var __generatedDirName='./generated/';
    //
    var valuesIterator=jp.query(params.values, jsonpath);
    for(var ii=0;ii<valuesIterator.length;ii++){
      var iterator=valuesIterator[ii];
      var values={
       'params': params,
       'iterator': iterator
      }
      generateFilesInDir(__templateDirName, __generatedDirName, values);
    }
  }
}

function generateFilesInDir(__templateDirName, __generatedDirName, values){
  var files=fs.readdirSync(__templateDirName);
  for(var i=0;i<files.length;i++){
    var srcFilename=path.join(__templateDirName,files[i]);
    var tgtFilename=path.join(__generatedDirName,files[i]);
    var stat = fs.lstatSync(srcFilename);
    if (stat.isFile()){
      if (files[i].endsWith('.ejs')){
        generateFile(__templateDirName, files[i], __generatedDirName, values);        
      } else if (files[i]=='.gitignore'){
        console.log('Skipping '+srcFilename);
      } else {
        console.log('Copying '+srcFilename);
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
  var tgtFilename=path.join(outputFolder,templateFileName.substring(0,templateFileName.length-4));
  console.log("Applying template: "+srcFilename);
  console.log('  Values: '+JSON.stringify(values));
  var template = fs.readFileSync(srcFilename, 'utf8');
  var renderized = ejs.render(template, values);
  //console.log(renderized);
  if (!fs.existsSync(outputFolder)){
    console.log("  Creating folder     "+outputFolder);
    fs.mkdirSync(outputFolder, { recursive: true });
  }
  console.log("  Writing file     "+srcFilename+"->"+tgtFilename);
  fs.writeFileSync(tgtFilename, renderized, 'utf8');
  console.log("  Written successfully...");
}

var params = {
  'executions': [
    {
      'template': 'template1/Int',
      'jsonpath': '$',
    },
    {
      'template': 'template1/IntFlow',
      'jsonpath': '$.IntFlows[*]',
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