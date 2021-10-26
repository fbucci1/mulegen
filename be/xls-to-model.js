var Excel = require('exceljs');
var fs = require('fs');
var path = require('path');

function readType(sh, i) {
  console.log('Reading type format in row: ' + i);
  var typeInfo = {};
  var row = sh.getRow(i);
  typeInfo['name'] = row.getCell(1).value;
  var attributes = [];
  for (j = 2; j <= 99 && row.getCell(j).value != undefined; j++) {
    attributes.push(row.getCell(j).value);
  }
  typeInfo['attributes'] = attributes;
  //
  if (typeInfo.name == undefined) {
    console.log('Wrong structure in row ' + i + '. Expected type name in row:' + i);
    exit();
  }
  if (typeInfo.attributes.length == 0) {
    console.log('Wrong structure in row ' + i + '. Expected type attributes in row:' + i);
    exit();
  }
  //
  //console.log('  TypeInfo: ' + JSON.stringify(typeInfo));
  return typeInfo;
}

function readData(sh, i, typeInfo) {
  //console.log('Reading data since row: ' + i);
  var dataRecords=[];
  //
  if (sh.getRow(i).getCell(2).value==undefined){
    console.log('Wrong structure in row ' + i + '. Expected data in row:' + i);
    exit;
  }
  for (; i <= sh.rowCount; i++) {
    var row = sh.getRow(i);
    //
    if (row.getCell(2).value==undefined){
      break;
    }
    //
    var data = {};
    for (j = 2; j <= 99 && row.getCell(j).value != undefined; j++) {
      data[typeInfo.attributes[j - 2]] = row.getCell(j).value;
    }
    dataRecords.push(data);
  }
  //
  var dataInfo = {};
  dataInfo['i']=i;
  dataInfo['data']=dataRecords;
  console.log('  Records read: ' + dataRecords.length);
  //console.log('  DataInfo: ' + JSON.stringify(dataInfo));
  return dataInfo;
}

function readModel(sh, i) {
  //console.log('Read model since row :' + i);
  var currentModel = {};
  for (; i <= sh.rowCount; i++) {
    var typeInfo = readType(sh, i);
    //
    //console.log('Read data since row :' + (i+1));
    var dataInfo = readData(sh, i+1, typeInfo);
    i=dataInfo.i;
    currentModel[typeInfo.name]=dataInfo.data;
  }
  //console.log('Model read until row :' + i);
  return currentModel;
};

var myArgs = process.argv.slice(2);
if (myArgs[0]==undefined){
  console.log('Arg[0] is missing: Input xml filename. E.g. ./run-xls-to-model.sh Interface1');
  return;
}
var inputFileName=myArgs[0];

var wb = new Excel.Workbook();
var path = require('path');
const { exit } = require('process');
var filePath = path.resolve(__dirname, inputFileName+'.xlsx');

wb.xlsx.readFile(filePath).then(function () {
  var sh = wb.getWorksheet('-');
  var i = 1;
  var model = readModel(sh, i, 0)
  var filePath2 = path.resolve(__dirname, inputFileName+'.json');
  console.log('Saving model to '+filePath2);
  fs.writeFileSync(filePath2, JSON.stringify(model), 'utf8');
});

