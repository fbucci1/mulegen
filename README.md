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
* modelFileName: This is the path to the model inside the folder resources/input.In the example, it is model1.json, which resolves to In the example, it is resources/input/model1.json. 

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
* CLI specifies the filename of the model
* The generator reads the model
* The generator iterates over the array of executions. For each execution it: 
  * Identifies the template to be used. For instance: "template1/Int". It is stored in the resources/templates folder. E.g. in this case the template would be in resources/templates/template1/Int 
  * Computes the JSONPath expression on the model, which returns an array. For each element in the array (iterator):
    * It creates a temporary object with the following structure: 
```
  {
    'params': theModelObject,
    'i': theNumberOfExecutionStartingFrom0,
    'element': theElement,
    'ii': theNumberOfArrayElementInTheIteratorStartingFrom0
  }
```
    * The temporary object is the context for the evaluation of each of the variables. E.g. variable IntName is computed evaluating  the expressioN: element.IntName, which resolves to "TheApp1".
    * Now, variables can be used for computing file names and directory names. For instance: "Dir__IntName__" is resolved as "DirTheApp1". The same is applicable for fileNames. In general, all tokens "__var__" are replaced by the value of the variable "var".
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
    * The temporary object is now the context for the evaluation of each of the EJS templates in the following steps. 
    * The generator scans the files in the template. If the file does not end with .ejs it is considered a static file which is copied without transformation. In case it is ends with .ejs, ".ejs" sufix is removed and the content is computed as an EJS template. E.g. the content of the file "PREFIX <%=element.IntName%> SUFIX" is computes as "PREFIX TheApp1 SUFIX".

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
