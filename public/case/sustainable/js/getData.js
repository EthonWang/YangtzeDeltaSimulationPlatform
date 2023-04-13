import axios from "axios";
import "../../../../src/mock/mockServe.js"
import Global from "../Global";


// 用mock模拟了一个接口，用来读取数据
export const getData = async (province)=>{
    // 原先从mock读取数据的写法
    // let res = await axios.get('/mock/banner');
    // console.log(res.data.data,'原始数据');
    // return res.data.data;

    // 从数据库读数据的新方法
    let res = await axios.get(Global.SDGUrl+'/api/EcoData');
    res = res.data;
    let selectedData = selectData(res,province);
    Global.viSelectedJson = selectedData;
    let jsonData = handleData(selectedData);
    return jsonData;
}
// 数据挑选方法，要把满足要求的数据挑选出来，比如：
// 同一个表格要有四个及以上城市，要有五个及以上次级指标，要计算得分（这个似乎不用考虑了，现在不计算无法保存）
function selectData(data,province){
    // 这里之后肯定要进行修改，不可能所有表格都能转化为可视化大屏，暂时先用这个特制表格
    let selectedData = [];
    for(let i = 0; i<data.length ; i++){
        if(data[i].name == province){
            selectedData.push(data[i]);
        }
    }
    // console.log(useData,'456');
    return selectedData
}
// 处理数据，将多个表格的零散json数据转化为符合格式的json数据。
function handleData(data){
    // data是符合选择要求的数据集，包括1个或多个表格
    // 存储整理后的json数据
    let jsonData =  {};
    // jsonData数据组
    var tableName = [];
    // 将表格名称提取出来，作为json第一级键,并完成基础的json框架构建
    for(let i = 0; i<data.length ; i++){
        if(tableName.indexOf(data[i].name) === -1){
            tableName.push(data[i].name);
            jsonData[data[i].name]={};
            jsonData[data[i].name]["GreenData"]={};
            jsonData[data[i].name]["MultiBarData"]={};
            jsonData[data[i].name]["MultiPieData"]={};
        }
    }
    Global.viTableName = tableName;
    // 在框架中填充具体的数据
    // 1、填充GreenData数据
    for(let i = 0; i<tableName.length ; i++){
        let series_data = [];
        let x_data = [];
        let y_max = 100;
        let y_min = 0;
        let y_split = 4;
        for(let j = 0; j<data.length ; j++){
            if(tableName[i] == data[j].name){
                let score = data[j].name + "综合得分";
                let region = data[j].region;
                region=region.replace(/\[|]/g,'');
                region=region.split('"').join('');
                let regionList = region.split(',')
                // 将地名和对应的综合得分填充到对应的数据项中
                for(let k = 0; k<regionList.length ; k++){
                    x_data.push(regionList[k]);
                    series_data.push(Number(data[j].data[0][score]))
                }
                // console.log(regionList,'quyuchangdu');
                // console.log(data[j].data[0][score]);
            }
        }
        jsonData[tableName[i]]["GreenData"]["x_data"]=x_data;
        jsonData[tableName[i]]["GreenData"]["series_data"]=series_data;
        jsonData[tableName[i]]["GreenData"]["y_max"]=y_max;
        jsonData[tableName[i]]["GreenData"]["y_min"]=y_min;
        jsonData[tableName[i]]["GreenData"]["y_split"]=y_split;
    }
    // 2、填充MultiBarData数据
    for(let i = 0; i<tableName.length ; i++){
        let color = "#eba0c3";
        let series_data = [];
        let x_max = 100;
        let x_min = 0;
        let x_split=2;
        let y_data = [];
        var columnName = '';
        var barName = [];
        var barArr = [];
        // 先计算要生成几个柱状图
        // 2.1、拿到次级目标列名
        for (let keyname in data[0].data[0]){
            if (Object.prototype.hasOwnProperty.call(data[0].data[0],keyname)){
                if (keyname.indexOf("index") === -1) {
                    if(keyname.indexOf("得分") === -1 && keyname.indexOf("权重") === -1){
                        columnName = keyname;
                        break;
                        // var score = keyname + "得分";
                        // var weight = keyname + "权重";
                        // if(score in data[0].data[0] && weight in data[0].data[0]){
                        //     columnName.push(weight);
                        //     columnName.push(score);
                        // }
                    }
                }
            }
        }
        // 2.2、拿到具体的次级目标，每一个次级目标都是一个柱状图的图名
        for(let i = 0; i<data[0].data.length ; i++){
            if(barName.indexOf(data[0].data[i][columnName])=== -1 ){
                barName.push(data[0].data[i][columnName]);
            }
        }
        Global.viBarName = barName;
        // 2.3、根据barName中的每一个具体的次级目标，组建对应的json
        // 次级目标得分的列名
        var score = columnName + "得分";
        for(let i = 0; i<barName.length ; i++){
            for(let j = 0; j<data.length ; j++){
                for(let k = 0; k<data[j].data.length ; k++){
                    if(barName[i] == data[j].data[k][columnName]){
                        let region = data[j].region;
                        region=region.replace(/\[|]/g,'');
                        region=region.split('"').join('');
                        let regionList = region.split(',');
                        // 将地名和对应的综合得分填充到对应的数据项中
                        for(let place in regionList){
                            y_data.push(regionList[place]);
                            series_data.push(Number(data[j].data[k][score]));
                        }
                        break;
                    }
                }
            }
            let barJson = {};
            barJson["color"] = color;
            barJson["series_data"] = series_data;
            barJson["x_max"] = x_max;
            barJson["x_min"] = x_min;
            barJson["x_split"] = x_split;
            barJson["y_data"] = y_data;
            series_data = [];
            y_data = [];
            barArr.push(barJson)

        }
        jsonData[tableName[i]]["MultiBarData"] = barArr;
        jsonData[tableName[i]]["MultiBarData"][0]["barName"] = barName;
    }
    // 3、填充MultiPieData数据
    for(let a = 0; a<tableName.length ; a++){
        let name = '';
        let value = [];
        let pirArr = [];
        let count = 0 ;
        for(let i = 0; i<data.length ; i++){
            let region = data[i].region;
            region=region.replace(/\[|]/g,'');
            region=region.split('"').join('');
            let regionList = region.split(',');
            for(let place in regionList){
                name = regionList[place];
                count = 0;
                for(let j = 0; j<data[i].data.length ; j++){
                    if(barName[count] == data[i].data[j][columnName]){
                        console.log();
                        count++;
                        value.push(Number(data[i].data[j][score]));
                    }
                }
                let pieJson = {};
                pieJson.name = name;
                pieJson.value = value;
                value = [];
                pirArr.push(pieJson);
            }
        }
        jsonData[tableName[a]]["MultiPieData"] = pirArr;
        jsonData[tableName[a]]["MultiPieData"][0]["barName"] = barName;
    }
    // console.log(jsonData,'nicedata');
    return jsonData
}

export const getProvince = async (province) =>{
    let themeData = await getData(province)
    // console.log(themeData,'132');
    // 原先的匹配数据方法
    // switch (province) {
    //     case "ZheJiang" :
    //         return themeData.ZheJiang;

    //     case "AnHui" :
    //         return themeData.AnHui;

    //     case "FuJian" :
    //         return themeData.FuJian;
             
    //     default :
    //         return null;
    // }

    // 临时用的新匹配方法,之后肯定要改
    // console.log(themeData,'themeData');
    themeData = themeData[province];
    return themeData
}


// 其实只有singleBar的数据是写死的，我在getSingleBar的位置写好了替代代码，如果有接口就把原来写死的代码注释掉，把我写好的代码注释取消
export const getGreenData =async (province) =>{

    var greenData1 = await getProvince(province)
    // var greenData1 = await getData()
    // console.log(greenData1,'greenData1');
    let greenData = greenData1.GreenData
    let option = {
        //  backgroundColor: "#00265f",
        tooltip: {
            trigger: "axis",
            axisPointer: {
                type: "shadow"
            }
        },
        grid: {
            left: "0%",
            top:"20px",
            right: "0%",
            bottom: "0",
            width:"100%",
            height:"90%",
            // position: "bottom",
            containLabel: true
        },
        xAxis: [{
            type: "category",
            data: greenData.x_data,
            axisLine: {
                show: true,
                lineStyle: {
                    color: "rgba(255,255,255,.1)",
                    width: 2,
                    type: "solid"
                },
            },

            axisTick: {
                show: false,
            },
            axisLabel:  {
                interval: 0,
                // rotate:50,
                show: true,
                splitNumber: 15,
                textStyle: {
                    color: "rgba(255,255,255,.6)",
                    fontSize: "15",
                },
            },
        }],
        yAxis: [{
            type: "value",
            max : greenData.y_max,
            min : greenData.y_min,
            splitNumber : greenData.y_split,
            axisLabel: {
                //formatter: "{value} %"
                show:true,
                textStyle: {
                    color: "rgba(255,255,255,0.6)",
                    fontSize: "15",
                },
            },
            axisTick: {
                show: false,
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: "rgba(255,255,255,.1	)",
                    width: 2,
                    type: "solid"
                },
            },
            splitLine: {
                lineStyle: {
                    color: "rgba(255,255,255,.1)",
                }
            }
        }],
        series: [
            {
                type: "bar",
                data: greenData.series_data,
                barWidth:"35%", //柱子宽度
                // barGap: 1, //柱子之间间距
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            position: "top",
                            color:"#CDCDCD"
                        },
                        color:"#2f89cf",
                        opacity: 1,
                        barBorderRadius: 5,
                    }
                }
            }

        ]
    };
    return option;
}

export const getMultiBarData =async (province , num ) =>{

    var multiBarData1 = await getProvince(province)
    let multiBarData = multiBarData1.MultiBarData;
    let barData ;
    for(let i = 1; i <= multiBarData.length ; i++){
        if(num == i){
            barData = multiBarData[i-1];
            break;
        }
    }
    return {
        //  backgroundColor: "#00265f",
        tooltip: {
            trigger: "axis",
            axisPointer: {
                type: "shadow"
            }
        },
        grid: {
            left: "2%",
            top: "10px",
            right: "0%",
            bottom: "0",
            width: "90%",
            height: "90%",
            // position: "bottom",
            containLabel: true
        },
        yAxis: [{
            type: "category",
            data: barData.y_data,
            axisLine: {
                show: true,
                lineStyle: {
                    color: "rgba(255,255,255,.1)",
                    width: 2,
                    type: "solid"
                },
            },
            axisTick: {
                show: false,
            },
            axisLabel: {
                interval: 0,
                // rotate:50,
                show: true,
                splitNumber: 15,
                textStyle: {
                    color: "rgba(255,255,255,.6)",
                    fontSize: "15",
                },
            },
        }],
        xAxis: [{
            type: "value",
            max: barData.x_max,
            min: barData.x_min,
            splitNumber: barData.x_split,
            axisLabel: {
                //formatter: "{value} %"
                show: true,
                textStyle: {
                    color: "rgba(255,255,255,.6)",
                    fontSize: "15",
                },
            },
            axisTick: {
                show: false,
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: "rgba(255,255,255,.1	)",
                    width: 2,
                    type: "solid"
                },
            },
            splitLine: {
                lineStyle: {
                    color: "rgba(255,255,255,.1)",
                }
            }
        }],
        series: [
            {
                type: "bar",
                data: barData.series_data,
                barWidth: "35%", //柱子宽度
                // barGap: 1, //柱子之间间距
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            position: "right",
                            color: "#CDCDCD"
                        },
                        color: barData.color,
                        opacity: 1,
                        barBorderRadius: 3,
                    }
                }
            }
        ]
    };

}

export const getMultiPieData =async (province , num) =>{

    let radius = ["35%","100%"];
    var multiPieData1 =await getProvince(province);
    var multiPieData = multiPieData1.MultiPieData;
    let name = multiPieData[0].barName;
    let legendData = name.map((n) => {
        return { name: n };
      });
    //   原定数饼图配置项设置
    let singlePieData = {};
    // console.log(optionData,'1235');

    if(num == "legend"){
        return {
            legend: {
                left: "center",
                top: "bottom",
                data: name,
                textStyle:{
                    color:"#d2d2d2",
                }
            },
            series: [
                {
                    name: name,
                    type: "pie",
                    data: legendData,
                },
            ]
        };
    }else{
        for(let i = 1; i <= multiPieData.length ; i++){
            if(num == i){
                singlePieData = multiPieData[i-1];
                break;
            }
        }
    }
    let optionData = name.map((n, i) => ({ value: singlePieData.value[i], name: n }))
    let  option = {
        tooltip: {
            trigger: "axis",
            axisPointer: {
                type: "shadow"
            }
        },
        title: {
            text: singlePieData.name,
            left: 'center',
            top:"center",
            textStyle :{
                color:"rgba(255,255,255,.6)",
                fontWeight:"normal",
                fontSize:15
            }

        },
        series: [
            {
                name: name,
                type: "pie",
                radius: radius,
                center: "center",
                top:"3%",
                roseType: "radius",
                itemStyle: {
                    borderRadius: 5,
                    normal: {
                        label: {
                            show: true,
                            position: "inner",
                            formatter: "{c} "
                        }
                    }
                },
                label: {
                    show:false
                },
                emphasis: {
                    label: {
                        show: true
                    }
                },
                data: optionData
            },
        ]
    };
    return option;
}

// 这个方法还没改异步操作（用于安徽多出来的那个柱状图），考虑看到数据之后再决定
export const getSingleBarData = () =>{

    let y_data,series_data,x_max,x_min,x_split;
    y_data = ["合肥","淮北","亳州","宿州","蚌埠","阜阳","淮南","滁州","六安","马鞍山","芜湖","宣城","铜陵","池州","安庆","黄山"]
    series_data  = ["84.52","87.18","88.46","84.06","88.58","83.76","80.35","91.08","92.51","87.57","89.57","91.55","90.58","93.25","87.41","95.72"];
    x_min = 80;
    x_max = 100;
    x_split = 2;
    // let y_data,series_data,x_max,x_min,x_split,SingleBarData;
    // SingleBarData = getProvince(province).SingleBarData;
    // y_data = SingleBarData.y_data；
    // series_data = SingleBarData.series_data；
    // x_max = SingleBarData.x_max；
    // x_min = SingleBarData.x_min；
    // x_split = SingleBarData.x_split；

    let option  = {
        tooltip: {
            trigger: "axis",
            axisPointer: {
                type: "shadow"
            }
        },
        grid: {
            left: "0%",
            top: "10px",
            right: "0%",
            bottom: "0",
            width: "85%",
            height: "98%",
            containLabel: true
        },
        yAxis: {
            type: 'category',
            data: y_data,
            axisTick :{
                show:false
            },
            axisLabel: {
                interval: 0,
                show: true,
                splitNumber: 15,
                textStyle: {
                    color: "rgba(255,255,255,.6)",
                    fontSize: "15",
                },
            },
        },
        xAxis: {
            type: "value",
            max: x_max,
            min: x_min,
            splitNumber: x_split,
            axisLabel: {
                show: true,
                textStyle: {
                    color: "rgba(255,255,255,.6)",
                    fontSize: "15",
                },
            },
            axisTick: {
                show: false,
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: "rgba(255,255,255,.1	)",
                    width: 2,
                    type: "solid"
                },
            },
            splitLine: {
                lineStyle: {
                    color: "rgba(255,255,255,.1)",
                }
            }
        },
        series: [{
            itemStyle: {
                normal: {
                    label: {
                        show: true,
                        position: "right",
                        color: "#CDCDCD"
                    }
                }
            },
            data: series_data,
            type: 'scatter',
        }]
    }
    return option;
}

export const getHomeTable = () =>{

    // return themeData.Home;

}
