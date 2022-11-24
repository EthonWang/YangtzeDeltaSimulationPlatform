import * as echarts from "echarts";
import {getGreenData, getMultiBarData, getMultiPieData, getSingleBarData} from "./getData";
// 上方从左到右分别为左下角的绿色发展指数数据、左上角六个柱状图数据、右下角五个饼图数据，最后一个是安徽特有的横版柱状图数据

export const initChart = (chartData,dom) =>{
    let myChart = echarts.init(document.getElementById(dom),'hxy_theme');
    myChart.setOption(chartData);
    window.addEventListener('resize',()=>{
        myChart.resize();
    })
    // return myChart;

};

export const drawChart = (province) => {
    // console.log(province)
    // 绘制左下角的图表
    getGreenData(province).then(res=>{ 
        initChart(res,"greenDevelop");
    })
    // 绘制右上角的六个柱状图
    getMultiBarData(province,1).then(res=>{
        initChart(res,"bar-item1");
    })
    getMultiBarData(province,2).then(res=>{
        initChart(res,"bar-item2");
    })
    getMultiBarData(province,3).then(res=>{
        initChart(res,"bar-item3");
    })
    getMultiBarData(province,4).then(res=>{
        initChart(res,"bar-item4");
    })
    getMultiBarData(province,5).then(res=>{
        initChart(res,"bar-item5");
    })
    getMultiBarData(province,6).then(res=>{
        initChart(res,"bar-item6");
    })

    // 这些是原方法，能获取写死的数据，但是没办法通过异步请求获取后端数据，故注释掉了
    // initChart(getMultiBarData(province,1),"bar-item1");
    // initChart(getMultiBarData(province,2),"bar-item2");
    // initChart(getMultiBarData(province,3),"bar-item3");
    // initChart(getMultiBarData(province,4),"bar-item4");
    // initChart(getMultiBarData(province,5),"bar-item5");
    // initChart(getMultiBarData(province,6),"bar-item6");

    // 绘制右下角的五个饼图和图例
    getMultiPieData(province,1).then(res=>{
        initChart(res,"pie-item1");
    })
    getMultiPieData(province,2).then(res=>{
        initChart(res,"pie-item2");
    })
    getMultiPieData(province,3).then(res=>{
        initChart(res,"pie-item3");
    })
    getMultiPieData(province,4).then(res=>{
        initChart(res,"pie-item4");
    })
    getMultiPieData(province,5).then(res=>{
        initChart(res,"pie-item5");
    })
    getMultiPieData(province,"legend").then(res=>{
        initChart(res,"pie-item-legend");
    })

    // initChart(getMultiPieData(province,1),"pie-item1");
    // initChart(getMultiPieData(province,2),"pie-item2");
    // initChart(getMultiPieData(province,3),"pie-item3");
    // initChart(getMultiPieData(province,4),"pie-item4");
    // initChart(getMultiPieData(province,5),"pie-item5");
    // initChart(getMultiPieData(province,"legend"),"pie-item-legend");

    //如果是安徽省就额外绘制一个中间上方的柱状图
    if(province == "AnHui")
        initChart(getSingleBarData(province),"single-bar")
}


