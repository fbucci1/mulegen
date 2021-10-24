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
exports.generate = (req, res) => {
  //generateFiles(null);
  res.status(200).end('{"status:":"ok"}').send();
};