# mulegen

## CLI
To run the generator form the command line execute the following commands from git bash:
```
cd be
npm install
cd ..
./run-cli.sh model1.json
```

run-cli.sh requires an argument:
* modelFileName: This is the path to the model inside the folder resources/input.

The model contains information on the template to use, the output folder and the data used for the transformation.
Here is an example:
```
{
  "executions": [
    {
      "template": "template1/Int",
      "output": "template1",
      "jsonpath": "$",
      "vars": [
        {"name": "IntName", "expr": "element.IntName"}
      ]
    }
  ],
  "values": 
    {
      "IntName": "TheApp1"
    }
  }
```
### How does it work? 
* CLI specifies the filename of the model.
  * E.g. ./run-cli.sh model1.json
* The generator reads the model from the file.
  * In the example, it is "model1.json", which resolves to "resources/input/model1.json". 
* The generator iterates over the array of executions. 

For each execution the generator: 
* Identifies the template to be used. 
  * In the example, it is "template1/Int", which resolves to "resources/templates/template1/Int". 
* Computes the JSONPath expression on the model, which returns an array (iterator). 
  * In the example, it is "$", which resolves to the model itself. 

For each element in the array (iterator):
* The generator creates a temporary object with the following structure: 
  * theModelObject: the model itself
  * nExecution: the number of execution starting from 0
  * theElement: the being visited in the iterator
  * nElement: the number of the element in the iterator starting from 0
```
  {
    'params': theModelObject,
    'i': nExecution,
    'element': theElement,
    'ii': nElement
  }
```
* The temporary object is used as the context for the evaluation of each of the variables in the execution. 
  * E.g. variable "IntName" is computed evaluating  the expressioN: "element.IntName", which resolves to "TheApp1".
* The temporary object is enriched with variables: 
```
  {
    'params': theModelObject,
    'i': theNumberOfExecutionStartingFrom0,
    'element': theElement,
    'ii': theNumberOfArrayElementInTheIteratorStartingFrom0,
    'vars': { 'varName': 'varValue', ....}
  }
```
* Variables are now  used for computing file names and directory names. 
  * For instance: "Dir__IntName__" is resolved as "DirTheApp1". 
  * For instance: "File__IntName__.txt" is resolved as "FileTheApp1.txt". 
  * In general, all tokens "__var__" are replaced by the value of the variable "var".
* The temporary object is now the context for the evaluation of each of the EJS templates in the following steps. 
* The generator scans the files in the template. 
  * If the file does not end with .ejs it is considered a static file which is copied without transformation. E.g. "flower.png"
  * In case it is ends with .ejs, ".ejs" sufix is removed and the content is computed as an EJS template. E.g. the content of the file "PREFIX <%=element.IntName%> SUFIX" is computes as "PREFIX TheApp1 SUFIX".

Here is a more complex example which combines more than one execution:
```
{
  "executions": [
    {
      "template": "template1/Int",
      "output": "template1",
      "jsonpath": "$",
      "vars": [
        {"name": "IntName", "expr": "element.IntName"}
      ]
    },
    {
      "template": "template1/IntFlow",
      "output": "template1",
      "jsonpath": "$.IntFlows[*]",
      "vars": [
        {"name": "IntName", "expr": "params.values.IntName"},
        {"name": "FlowName", "expr": "element.FlowName"}
      ]
    }
  ],
  "values": 
    {
      "IntName": "TheApp1",
      "IntFlows": [
        {
          "FlowName": "Flow11"
        },
        {
          "FlowName": "Flow12"
        }
      ]
    }
  }
```

## To run the backend (WIP)
To run the generator form the command line execute the following commands from git bash:
```
cd be
npm install
cd ..
./run-be.sh
```

## To test the backend (WIP)
Open resources/MuleGen.postman_collection.json

## To run the frontend (WIP)
To run the generator form the command line execute the following commands from git bash:
```
cd fe
npm install
cd ..
./run-fe.sh
```
