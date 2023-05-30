import * as echarts from "echarts";
import {getGreenData, getMultiBarData, getMultiPieData, getSingleBarData} from "./getData";
// 上方从左到右分别为左下角的绿色发展指数数据、左上角六个柱状图数据、右下角五个饼图数据，最后一个是安徽特有的横版柱状图数据

export const initChart = async (chartData,dom) =>{
    let myChart = echarts.init(document.getElementById(dom),'hxy_theme');
    myChart.setOption({});
    myChart.setOption(chartData);
    window.addEventListener('resize',()=>{
        myChart.resize();
    })
    // return myChart;

};
export const drawPie = async (province,num) => {
        // 绘制右下角的五个饼图
        for (let i = num+1; i <= num+5; i++) {
            getMultiPieData(province, i).then(res => {
                initChart(res, `pie-item${i-num}`);
            });
        }
}
export const drawBar = async (province,num) => {
    // 绘制右上角的六个柱状图
    for (let i = num+1; i <= num+6; i++) {
        getMultiBarData(province, i).then(res => {
          initChart(res, `bar-item${i-num}`);
        });
    }
}
export const drawChart = async (province) => {
    // await Promise.all([]);
    // 绘制左下角的图表
    await getGreenData(province).then(res=>{ 
        initChart(res,"greenDevelop");
    })
    // 绘制右上角的六个柱状图
    for (let i = 1; i <= 6; i++) {
        getMultiBarData(province, i).then(res => {
          initChart(res, `bar-item${i}`);
        });
    }
    // 绘制右下角的五个饼图和图例
    for (let i = 1; i <= 5; i++) {
        getMultiPieData(province, i).then(res => {
          initChart(res, `pie-item${i}`);
        });
    }
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
    // if(province == "AnHui")
    //     initChart(getSingleBarData(province),"single-bar")
}


