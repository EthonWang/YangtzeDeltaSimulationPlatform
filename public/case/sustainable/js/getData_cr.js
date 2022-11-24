import AnalyzePageTableData from "../json/AnalyzePageTableData.json"
import ChinaData from "../json/ChinaData.json"
import CountryData from '../json/CountryData.json'
import Global from "../Global.vue";
import {createJsonData} from "./optionData";


//得到四个体系的数据
export const GetTableData=(List)=>
{
    switch (List) {
        case "ListA":
            return AnalyzePageTableData.ListA;
        case "ListB":
            return AnalyzePageTableData.ListB;
        case "ListC":
            return AnalyzePageTableData.ListC;
        case "ListD":
            return AnalyzePageTableData.ListD;
        default :
            return null;
    }
}

//通过json数组属性名分割字符串,合拼一级指标类别 并去除重复列
//参数列表:List1Column表示四个列表对应的列
//参数列表：TargetColumn表示合并修改统一的列名
export const SplitJson=(List1Column,List2Column,List3Column,List4Column,TargetColumn)=>
{
    //先提取单列
    let List1=JSON.stringify(AnalyzePageTableData.ListA,[List1Column]);
    //统一命名为一级目标
    List1=List1.replace(new RegExp(List1Column,'g'),TargetColumn);
    //转回Json
    List1=JSON.parse(List1);
    //合并
    let List2=JSON.stringify(AnalyzePageTableData.ListB,[List2Column]);
    List2=List2.replace(new RegExp(List2Column,'g'),TargetColumn);
    List2=JSON.parse(List2);
    let List12=List1.concat(List2);
    let List3=JSON.stringify(AnalyzePageTableData.ListC,[List3Column]);
    List3=List3.replace(new RegExp(List3Column,'g'),TargetColumn);
    List3=JSON.parse(List3);
    let List13=List12.concat(List3);
    let List4=JSON.stringify(AnalyzePageTableData.ListD,[List4Column]);
    List4=List4.replace(new RegExp(List4Column,'g'),TargetColumn);
    List4=JSON.parse(List4);
    let List14=List13.concat(List4);
    //去除重复列
    var temp={};//存放id
    var result=[];//新数组
    List14.map((item)=>{
        if(!temp[item[TargetColumn]]){
            result.push(item);
            temp[item[TargetColumn]]=true;
        }
    })
    console.log(result);
    return result;
}

//判断ChinaData和CountryData中的哪些数据集被选中了,同时添加生态文明表格的属性值
export const JudgeSelectJson=(JsonName,AttributeJson)=>{

    let ChinaJson=ChinaData.china.features;
    for(let i=0;i<ChinaJson.length;i++)
    {
        let status=true;
        if(JsonName==ChinaJson[i].properties.name) {
            createJsonData("Table", AttributeJson, ChinaJson[i].properties);
            //去除重复列
            if(Global.VisualJson.length==0){
                Global.VisualJson.push(ChinaJson[i]);
            }
            else{
                for(let j=0;j<Global.VisualJson.length;j++){
                    if(JsonName==Global.VisualJson[j].properties.name){
                        status=false;
                        break;
                    }
                }
                if(status){
                    Global.VisualJson.push(ChinaJson[i]);
                }
            }
        }

    }
    let CountryJson=CountryData.world.features;
    for(let i=0;i<CountryJson.length;i++){
        if(JsonName==CountryJson[i].properties.name){
            //要判断一下是否在Global中存在
            let status=true;
            createJsonData("Table",AttributeJson,CountryJson[i].properties);
            Global.VisualJson.push(CountryJson[i]);
            if(Global.VisualJson.length==0){
                Global.VisualJson.push(CountryData[i]);
            }
            else{
                for(let j=0;j<Global.VisualJson.length;j++){
                    if(JsonName==Global.VisualJson[j].properties.name){
                        status=false;
                        break;
                    }
                }
                if(status){
                    Global.VisualJson.push(CountryData[i]);
                }
            }
        }
    }
    console.log(Global.VisualJson);

}


//得到有值的Result数据
export const GetResultJson=()=>{
     let List1=JSON.stringify(Global.ResultJson,["Target","TargetData"]);
     List1=List1.replace(new RegExp("Target",'g'),"Name");
     List1=List1.replace(new RegExp("TargetData",'g'),"Data");
     List1=JSON.parse(List1);
     let List2=JSON.stringify(Global.ResultJson,["Index","IndexData"]);
     List2=List2.replace(new RegExp("Index",'g'),"Name");
     List2=List2.replace(new RegExp("IndexData",'g'),"Data");
     List2=JSON.parse(List2);
     let List12=List1.concat(List2);
     let List3=JSON.stringify(Global.ResultJson,["Factor","FactorData"]);
     List3=List3.replace(new RegExp("Factor",'g'),"Name");
     List3=List3.replace(new RegExp("FactorData",'g'),"Data");
     List3=JSON.parse(List3);
     let List13=List12.concat(List3);
     let List4=JSON.stringify(Global.ResultJson,["FactorLayer","FactorLayerData"]);
     List4=List4.replace(new RegExp("FactorLayer",'g'),"Name");
     List4=List4.replace(new RegExp("FactorLayerData",'g'),"Data");
     List4=JSON.parse(List4);
     let List14=List13.concat(List4);
     //去除重复列
     var temp={};//存放id
     var result=[];//新数组
     List14.map((item)=>{
        if(!temp[item["Name"]]){
            result.push(item);
            temp[item["Name"]]=true;
        }
     })
    console.log(result);
     return  result;
}

