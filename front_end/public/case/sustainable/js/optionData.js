
//为一条数据添加属性键和属性值
export const createJsonData=(prop, val, OneJsonData)=>{
    if(typeof val=="undefined"){
        delete OneJsonData[prop];
    }else {
        OneJsonData[prop]=val;
    }
}

//为json对象数组添加数据
export const AddJsonData=(FirstTarget,SecondTarget,ThirdTarget,Dataset)=>
{
    var OneJsonData={"Target":"生态文明指数"};
    createJsonData("Index",FirstTarget,OneJsonData);
    createJsonData("Factor",SecondTarget,OneJsonData);
    createJsonData("FactorLayer",ThirdTarget,OneJsonData);
    Dataset.push(OneJsonData);
    console.log(Dataset);
}

//为数据集删除最后一列数据
export const DeleteJsonDate=(Dataset)=>
{
    Dataset.splice(Dataset.length-1,1);
}

//为Json数据集的其中一条数据添加属性键和属性值
export const createJsonDataOfDatatset=(prop,val,Dataset,index)=>{
    createJsonData(prop,val,Dataset[index]);

}

//计算每个权重和数据指标值
export const CalculateData=(Dataset)=>
{
    //第一遍循环先计算因子层的数据
    var TempIndex=0;
    var DataSum=Number(Dataset[0].FactorLayerData)*Number(Dataset[0].FactorLayerWeight);
    var WeightSum=Number(Dataset[0].FactorLayerWeight);
    var Result;
    for(var i=0;i<Dataset.length;i++){
        if(Object.prototype.hasOwnProperty.call(Dataset[i],'FactorWeight')){
             if(i!=0){
                 Result=DataSum/WeightSum;
                 createJsonDataOfDatatset("FactorData",Result,Dataset,TempIndex);
                 DataSum=Number(Dataset[i].FactorLayerData)*Number(Dataset[i].FactorLayerWeight);
                 WeightSum=Number(Dataset[i].FactorLayerWeight);
             }
            TempIndex=i;
        }else{
            DataSum=DataSum+Number(Dataset[i].FactorLayerData)*Number(Dataset[i].FactorLayerWeight);
            WeightSum=Number(WeightSum)+Number(Dataset[i].FactorLayerWeight);
        }
    }
    Result=DataSum/WeightSum;
    createJsonDataOfDatatset("FactorData",Result,Dataset,TempIndex);
    //第二遍循环计算指标层的数据
    TempIndex=0;
    DataSum=Number(Dataset[0].FactorData)*Number(Dataset[0].FactorWeight);
    WeightSum=Number(Dataset[0].FactorWeight);
    for (i=0;i<Dataset.length;i++){
        if(Object.prototype.hasOwnProperty.call(Dataset[i],'IndexWeight')) {
            if (i != 0) {
                Result = DataSum / WeightSum;
                createJsonDataOfDatatset("IndexData", Result, Dataset, TempIndex);
                DataSum = Number(Dataset[i].FactorData)*Number(Dataset[i].FactorWeight);
                WeightSum=Number(Dataset[0].FactorWeight);
            }
            TempIndex=i;
        }else{
            if(Object.prototype.hasOwnProperty.call(Dataset[i],'FactorData')){
                DataSum=DataSum+Number(Dataset[i].FactorData)*Number(Dataset[i].FactorWeight);
                WeightSum=Number(WeightSum)+Number(Dataset[i].FactorWeight);
            }
        }
    }
    Result=DataSum/WeightSum;
    createJsonDataOfDatatset("IndexData",Result,Dataset,TempIndex);
    //最后一遍循环目标层数据
    TempIndex=0;
    DataSum=Number(Dataset[0].IndexData)*Number(Dataset[0].IndexWeight);
    WeightSum=Number(Dataset[0].IndexWeight);
    for(i=0;i<Dataset.length;i++){
        if(Object.prototype.hasOwnProperty.call(Dataset[i],'IndexData')){
            DataSum=DataSum+Number(Dataset[i].IndexData)*Number(Dataset[i].IndexWeight);
            WeightSum=WeightSum+Number(Dataset[i].IndexWeight);
        }
    }
    Result=DataSum/WeightSum;
    createJsonDataOfDatatset("TargetData",Result,Dataset,TempIndex);

}

//最后结果的展示
export const ShowResult=(Dataset,ListColumn1,ListColumn2)=>
{
    let ResultList=JSON.stringify(Dataset,[ListColumn1,ListColumn2]);
    ResultList=JSON.parse(ResultList);
    return ResultList;
}


//计算空间自相关指数
//首先是判断两个区域是否相邻
export const judgeNearby=(Dataset,i,j)=>{
    let state=0;
    for(let n=0;n<Dataset[i].geometry.coordinates[0].length;n++){
        for(let m=0;m<Dataset[j].geometry.coordinates[0].length;m++){
            if(Dataset[i].geometry.coordinates[0][n].toString()==Dataset[j].geometry.coordinates[0][m].toString()){
                state=1;
                break;
            }
        }
    }
    console.log(state);
    return state;
}

export const ReturnAttribute=(feature,indexName)=>{
    let Data=0;
    for (let i=0;i<feature.properties.Table.length;i++){
        if(feature.properties.Table[i].Name==indexName){
            Data=feature.properties.Table[i].NameData;
        }
    }
    return Data;
}

//计算所选择指标的区域均值
export const globalAverage=(Dataset,IndexName)=>{
    let AverageData=0;
    for(let i=0;i<Dataset.length;i++){
        AverageData=AverageData+ReturnAttribute(Dataset[i],IndexName);
    }
    AverageData=AverageData/Dataset.length;
    return AverageData;
}

//计算局部莫兰指数
export const CalculateMoran=(feature,Dataset,IndexName)=>{
    let LocalMoran=0;
    let k;
    let S_2=0;
    let y_average=globalAverage(Dataset,IndexName);
    let y_feature=ReturnAttribute(feature,IndexName);
    let result;
    //找到是序号
    for(let i=0;i<Dataset.length;i++){
        if(Dataset[i].properties.name==feature.properties.name){
            k=i;
            break;
        }
    }
    for(let i=0;i<Dataset.length;i++){
        S_2=S_2+(ReturnAttribute(Dataset[i],IndexName)-y_average)*(ReturnAttribute(Dataset[i],IndexName)-y_average);
        if(i==k){

            continue;
        }
        LocalMoran=LocalMoran+judgeNearby(Dataset,k,i)*(ReturnAttribute(Dataset[i],IndexName)-y_average);
    }
    S_2=S_2/Dataset.length;
    console.log("S2为"+S_2)
    let Z=(y_feature-y_average);
    result="<br/>莫兰指数："+Z*LocalMoran/S_2+"<br/>Z:"+Z+"<br/>Q:"+LocalMoran
    return result;
}