import DatabaseContents from './DatabaseContents';

const databaseTypeMap =
  Object.keys(DatabaseContents.DEFAULT).reduce(function(dataTypeMap, dataType){
    dataTypeMap[`tests/types/${dataType}`] = DatabaseContents.DEFAULT[dataType];
    return dataTypeMap;
  }, {});

export default databaseTypeMap;
