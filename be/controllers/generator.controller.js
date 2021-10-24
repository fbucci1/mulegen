/*
const { generateTemplateFilesBatch  } = require('generate-template-files');

function generateFiles(params){
  generateTemplateFilesBatch([
    {
      option: 'Generate all templates',
      defaultCase: '(pascalCase)',
      entry: {
        folderPath: './templates/',
      },
      dynamicReplacers: params,
      output: {
        path: './generated',
        pathAndFileNameDefaultCase: '(kebabCase)',
        overwrite: true,
      },
      onComplete: (results) => {
        console.log(`results`, results);
      },
    },
  ]).catch(() => {
      console.log('Build Error');
    });
}
//
params=[
  { slot: '__store__', slotValue: 'sss' },  
  { slot: '__model__', slotValue: 'mmm' },
];
generateFiles(params);
//
*/

var ejs = require('ejs');
var fs = require('fs');
var path = require('path');

function generateFiles(templateName, params){
  var __templateDirName='./templates'; // templateName
  var __generatedDirName='./generated/';
  generateFilesInDir(__templateDirName, __generatedDirName, params);
}

function generateFilesInDir(__templateDirName, __generatedDirName, params){
  var files=fs.readdirSync(__templateDirName);
  for(var i=0;i<files.length;i++){
    var filename=path.join(__templateDirName,files[i]);
    var stat = fs.lstatSync(filename);
    if (stat.isFile()){
      if (files[i].endsWith('.ejs')){
        generateFile(__templateDirName, files[i], __generatedDirName, params);        
      } else {
        console.log('Skipping '+filename);
      }
    }
    if (stat.isDirectory()){
      generateFilesInDir(filename, path.join(__generatedDirName,files[i]), params);        
    }
  };
}

function generateFile(templateDirName, templateFileName, outputFolder, params){
  var templateFilePath = templateDirName + '/' + templateFileName;
  console.log("Applying template: "+templateFilePath);
  const values = params.values;
  var template = fs.readFileSync(templateFilePath, 'utf8');
  var renderized = ejs.render(template, values);
  //console.log(renderized);
  var outputFilename=path.join(outputFolder,templateFileName.substring(0,templateFileName.length-4));
  if (!fs.existsSync(outputFolder)){
    console.log("  Creating folder     "+outputFolder);
    fs.mkdirSync(outputFolder, { recursive: true });
  }
  console.log("  Writing file     "+templateFilePath+"->"+outputFilename);
  fs.writeFileSync(outputFilename, renderized, 'utf8');
  console.log("  Written successfully...");
}

var templateName='template1'; 
var params = {'values': {xxx: 'Hello World!'}};
generateFiles(templateName, params);

exports.generate = (req, res) => {
  res.status(200).end('{"status:":"ok"}').send();
};