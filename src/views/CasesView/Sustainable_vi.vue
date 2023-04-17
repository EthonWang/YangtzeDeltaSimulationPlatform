<template>
    
  <div class="container">
    <!-- 这是之前返回页面的按钮 -->
    <!-- <button  class="backBtn" >
      <router-link to="/SdgPlatform/EvaluateTheme/" class="btn-title">
        <i class="el-icon-back" style="color: #2f89cf"></i>
      </router-link>
    </button> -->

    <!-- 这个是滑块式，一开始就是展开的 -->
  <!-- <div>
    <el-radio-group v-model="radio2" size="small">
      <el-radio-button label="安徽省"></el-radio-button>
      <el-radio-button label="浙江省"></el-radio-button>
      <el-radio-button label="江苏省"></el-radio-button>
      <el-radio-button label="上海市"></el-radio-button>
    </el-radio-group>
  </div> -->
  


    <header id="header-panel">
        <h3 class="header-title">可持续发展目标评价专题展示系统
       </h3>
    </header>
    <h4 style="position:absolute;top:3%;left:0.5%;color:white;z-index: 99;">体系选择:</h4>
    <el-select v-model="require" placeholder="require" class="selection" style="width:250px;color:skyblue">
      <el-option
        v-for="(item,index) in tableName"
        v-on:click="placeChange"
        :key="index"
        :label="item"
        :value="item">
      </el-option>
     </el-select>

   
   
     <div id="content-panel">
      <!-- .row11是左上角的地图模型容器 -->
      <div class="card-panel row11">
        <div class="card" >
          <div class="chart-header"><h4 class="chart-title multiChart-title">{{require}}考核结果</h4></div>
          <div id="map-show" class="map-panel">
          </div>
        </div>
      </div>
      <!-- .row12是右上角的六个柱状图模型容器 -->
      <div class="card-panel row12">
        <div class="multi-bar card ">
          <div v-for="i in 6" class="chart-panel" :key="i">
            <div class="chart-header"><h4 class="chart-title multiChart-title">{{ barName3[i-1] }}</h4></div>
            <div :id="'bar-item'+i" :class="'bar-item bar-item'+i"></div>
          </div>
        </div>
      </div>
      <!-- .row21是左下角的柱状图容器 -->
      <div class="card-panel row21">
        <div class="card">
          <div class="chart-panel ">
            <div class="chart-header">
              <h4 class="chart-title">指标系统综合得分</h4>
            </div>
            <div class="chart-area" id="greenDevelop"></div>
          </div>
        </div>
      </div>
      <!-- .row22是右下角的五个饼图容器 -->
      <div class="card-panel row22">
        <div class="multi-pie card">
            <div id="pie-item-title" class="pie-item-title text-center"><h4 class="chart-title" style="text-align: center">各城市主要指标得分</h4></div>
            <div v-for="i in 5" :key="i" :id="'pie-item'+i" :class="'pie-item'+i+' pie-item'"></div>
            <div id="pie-item-legend" class="pie-item-legend pie-item"></div>
            <!-- <el-pagination
              small
              layout="prev, pager, next"
              :total="20">
            </el-pagination> -->
        </div>

      </div>

    </div>
  </div>

  <!--  </div>-->
</template>


<script>
// 左上角地图绘制
// import { DataShowMap } from "../../../public/case/sustainable/js/map";
import {AnalyzeMap} from "../../../public/case/sustainable/js/AnalyzeMap";
// 其余的统计图表模型绘制
import {drawChart,drawPie,drawBar} from "../../../public/case/sustainable/js/CreateChart";
// import { provide } from '@vue/runtime-core';
import inMap from "./Sustainable_inmap";
import Global from "../../../public/case/sustainable/Global";
import {JudgeSelectJson} from "../../../public/case/sustainable/js/getData_cr";
import axios from "axios";
import * as echarts from "echarts";



export default {
  name: "themeZJ",
  data() {
    return{
      require:'请选择体系',
      value: require,
      //数据库读取的数据 
      MongoDBDataOb:{},
      tableNameOb:[],
      // 综合得分，染色依据
      MapIndex: [],
      IndexJson: [],
      // 染色区域组
      placeList:[],
      regionList:[],
      // 该可视化大屏所用的数据
      selectedData:[],
      tableName:[],
      barName:[],
      barName2:[],
      barName3:[],
      timer:null,
      timer2:null,
    }
  },
  mounted() {
    this.timer = null;
    this.timer2 = null;
    // 重新获取数据时必须清空_echarts_instance_ 属性，否则不匹配就不会显示图表
    this.chartsRemove();
    // document.title = this.province+'生态文明建设年度评价专题展示系统'
    this.createData();
    // 左上角地图绘图方法
    // this.mapInit();
    // 上色方法
    // this.radioClickMap();
  },
  beforeUnmount() {
    this.mapObj && this.mapObj.destroy();
    this.myChart && this.myChart.destroy();
    clearInterval(this.timer);
    clearInterval(this.timer2);
  },
  methods: {
    mapInit() {
      this.mapObj = new AnalyzeMap("map-show");
    },
    // 拿到BarName2的值，它是为了计算柱状图的数量
    getBarName2(){
      var columnName = '';
      this.barName2 = [];
      for(let i =0 ; i < this.MongoDBDataOb.length ; i++){
        if(this.MongoDBDataOb[i].name == this.require){
          for (let keyName in this.MongoDBDataOb[i].data[0]){
            if (keyName.indexOf("得分") === -1 && keyName.indexOf("权重") === -1) {
              columnName = keyName;
              break;
            }         
          }
        }
      }
      for(let i =0 ; i < this.MongoDBDataOb.length ; i++){
        if(this.MongoDBDataOb[i].name == this.require){
          for(let j = 0 ; j < this.MongoDBDataOb[i].data.length ; j++){
            if(this.barName2.indexOf(this.MongoDBDataOb[i].data[j][columnName])=== -1 ){
              this.barName2.push(this.MongoDBDataOb[i].data[j][columnName]);
            }
          }
          break;
        }
      }
    },
    changeByTime(){
      // 清除先前可能产生的计时器
      if (this.timer) {
        clearInterval(this.timer);
      }
      if (this.timer2) {
        clearInterval(this.timer2);
      }
      let num = 1 ;
      let barNum = 3;
      let max = 0;
      for(let i = 0 ; i<this.MongoDBDataOb.length ; i++){
        if(this.require == this.MongoDBDataOb[i].name){
          let region = this.MongoDBDataOb[i].region;
          region=region.replace(/\[|]/g,'');
          region=region.split(',');
          max += region.length;
        }
      }
      this.getBarName2();
      if(this.barName2.length>6){
        this.timer2 = setInterval(() => {
          // 柱状图清空
          document.getElementById("bar-item1").removeAttribute('_echarts_instance_');
          document.getElementById("bar-item2").removeAttribute('_echarts_instance_');
          document.getElementById("bar-item3").removeAttribute('_echarts_instance_');
          document.getElementById("bar-item4").removeAttribute('_echarts_instance_');
          document.getElementById("bar-item5").removeAttribute('_echarts_instance_');
          document.getElementById("bar-item6").removeAttribute('_echarts_instance_');
          for(let i=0; i<=6 ; i++){
            let name = "bar-item" + i;
            if(document.getElementById(name)){
              let barContainer =document.getElementById(name);
              barContainer.innerHTML = '';
            }
          }
          // 重新绘制柱状图
          for(let i=0; i<=6 ; i++){
            this.barName3[i]=this.barName2[i+barNum];
          }
          drawBar(this.require,barNum)
          if(barNum+6 < this.barName2.length){
            barNum += 3;
          }else{
            barNum = 0;
          }
        }, 5000);
      }
      if(max > 5){
        // 生成计时器
        this.timer = setInterval(() => {
          // 饼图清空
          document.getElementById("pie-item1").removeAttribute('_echarts_instance_');
          document.getElementById("pie-item2").removeAttribute('_echarts_instance_');
          document.getElementById("pie-item3").removeAttribute('_echarts_instance_');
          document.getElementById("pie-item4").removeAttribute('_echarts_instance_');
          document.getElementById("pie-item5").removeAttribute('_echarts_instance_');
          for(let i=0; i<=5 ; i++){
            let name = "pie-item" + i;
            if(document.getElementById(name)){
              let pieContainer =document.getElementById(name);
              pieContainer.innerHTML = '';
            }
          }
          // 重新绘制饼图
          drawPie(this.require,num);
          if(num+5 < max){
            num++;
          }else{
            num = 0;
          }
        }, 5000);
      }
    },
    // 给tableName赋值
    createData(){
      axios.get(Global.SDGUrl+'/api/EcoData').then((response) => {
        // this.MongoDBData = response.data;
        this.MongoDBDataOb = response.data;
        this.tableNameOb = [];
        // 初始化tableName，决定有可视化大屏有哪些数据组
        for(let i =0; i<this.MongoDBDataOb.length;i++){
          if(this.tableNameOb.indexOf(this.MongoDBDataOb[i].name) === -1){
            this.tableNameOb.push(this.MongoDBDataOb[i].name);
          }
        }
        for(let i =0; i<this.tableNameOb.length;i++){
          let count = 0;
          for(let j =0; j<this.MongoDBDataOb.length;j++){
            if(this.MongoDBDataOb[j].name == this.tableNameOb[i]&&this.MongoDBDataOb[j].data.length>5){
              let region = this.MongoDBDataOb[j].region;
              region=region.replace(/\[|]/g,'');
              region=region.split(',');
              count += region.length;
            }
          }
          // 必须超过3个城市，才会被纳入可视化页面
          if(count>3){
            this.tableName.push(this.tableNameOb[i])
          }
        }
        // 如果列表里面有值，把第一个当成默认值，这样打开页面就能加载
        if(this.tableName.length > 0) {
          this.require = this.tableName[0];
          this.placeChange()
        }
      });
    },
    // 点击省份切换下拉框，自动更新可视化图表
    placeChange(){
      this.changeByTime()
      this.chartsRemove();
      // 通过require中的省份数据，绘制echarts图表
      // drawChart(this.require);
      // 左上角地图绘图方法
      console.log(this.require,'111');
        // 上色方法
      this.radioClickMap()
      this.mapInit();

    },  
    // 显色
    async radioClickMap(){
      // 通过require中的省份数据，绘制echarts图表,getData中的异步数据这里要用，所以加上await
      await drawChart(this.require);
      // 先拿到所有数据的region值
      this.selectedData = Global.viSelectedJson;
      // this.tableName = Global.viTableName;
      this.barName = Global.viBarName;
      this.barName3 = this.barName.slice(0,6);
      // console.log(this.selectedData,Global.viTableName,Global.viBarName,'111');
      this.placeList = [];
      for(var i = 0 ; i<this.selectedData.length ; i++){
          if(this.selectedData[i].region != null){
              this.placeList.push(this.selectedData[i].region);
          }
      }
      // 格式化拿到的region值
      this.regionList = [];
      for(var j = 0 ; j<this.placeList.length ; j++){
          // 去除原格式中的[]和双引号
          this.placeList[j]=this.placeList[j].replace(/\[|]/g,'');
          this.placeList[j]=this.placeList[j].split('"').join('');
          var arr = this.placeList[j].split(',');
          this.regionList.push(arr);
      }
      this.getIndexJson();
      // 获取VisualJson数据
      Global.VisualJson=[];
      var visualJson= [];
      for(var k=0;k<this.regionList.length;k++){
          for(var l=0;l<this.regionList[k].length;l++){
              JudgeSelectJson(this.regionList[k][l],this.IndexJson[k]);
          }
          visualJson[k]=Global.VisualJson;
          Global.VisualJson=[];
      }
      Global.VisualJson = visualJson;
      visualJson = [];
      this.mapObj.RemoveJson();
      // MapIndex是染色依据，在这里是综合得分的字符串名称
      // VisualJson是地图位置信息，通过JudgeSelectJson（）方法赋值，从Global.VisualJson中获取
      // console.log(Global.VisualJson,this.MapIndex,'147');
      for(var m = 0 ; m<Global.VisualJson.length ; m++){
          if(this.MapIndex[m] != undefined){
              // console.log(this.MapIndex[m],m);
              this.mapObj.VisualGeoJson3(Global.VisualJson[m],this.MapIndex[m]);
          }
      }
    },
    getIndexJson(){
        this.IndexJson = [];
        for(var i = 0 ; i<this.selectedData.length ; i++){
            if(this.selectedData[i].data[0] != null){
                var scoreName = this.selectedData[i].name + "综合得分";
                if(scoreName in this.selectedData[i].data[0]){
                    var index = {};
                    index.Name = scoreName;
                    index.NameData = this.selectedData[i].data[0][scoreName];
                    this.IndexJson[i] = index;
                    this.MapIndex[i] = index.Name;
                }
            }
        }
        // console.log(this.IndexJson,this.MapIndex,'1234');
    },
    chartsRemove(){
      document.getElementById("greenDevelop").removeAttribute('_echarts_instance_');
      document.getElementById("pie-item1").removeAttribute('_echarts_instance_');
      document.getElementById("pie-item2").removeAttribute('_echarts_instance_');
      document.getElementById("pie-item3").removeAttribute('_echarts_instance_');
      document.getElementById("pie-item4").removeAttribute('_echarts_instance_');
      document.getElementById("pie-item5").removeAttribute('_echarts_instance_');
      document.getElementById("pie-item-legend").removeAttribute('_echarts_instance_');
      document.getElementById("bar-item1").removeAttribute('_echarts_instance_');
      document.getElementById("bar-item2").removeAttribute('_echarts_instance_');
      document.getElementById("bar-item3").removeAttribute('_echarts_instance_');
      document.getElementById("bar-item4").removeAttribute('_echarts_instance_');
      document.getElementById("bar-item5").removeAttribute('_echarts_instance_');
      document.getElementById("bar-item6").removeAttribute('_echarts_instance_');
      // 饼图清空
      for(let i=1; i<=5 ; i++){
        let name = "pie-item" + i;
        if(document.getElementById(name)){
          let pieContainer =document.getElementById(name);
          pieContainer.innerHTML = '';
        }
      }
      // 条形图图清空
      for(let i=1; i<=6 ; i++){
        let name = "bar-item" + i;
        if(document.getElementById(name)){
          let barContainer =document.getElementById(name);
          barContainer.innerHTML = '';
        }
      }
    },
  },
}

</script>

<style scoped>
/* @import "../../../public/case/sustainable/css/themeGlobel.css"; */
/*global*/
/*global*/
/*global*/

* {margin:0;padding:0;box-sizing:border-box;}
/deep/ .selection{
    z-index:999;
    position: absolute;
    top: 2.8%;
    left: 6.4%;
    border-radius: 25px;
    /* opacity: 0.8; */
    font-size: 300%;
    width: 100px;
    height: 50px;
    /* background-color: ; */
    /* color:red !important; */
}
/deep/ .el-input__inner{
    background-image:linear-gradient(135deg,#FFFACD,#aac6ee);
}
.container{
    position:absolute;
    background:#050d3c url("../../../public/case/sustainable/pic/map_bg.png") 0 0/ 100% 100% no-repeat;
    width: 100%;
    height: 100%;
    min-width:750px;
    min-height:500px;
    overflow:hidden;
    margin: 0;
}

.backBtn{
    z-index: 999;
    position: absolute;
    top: 3.5%;
    left: 2%;
    border-radius: 25px;
    /* opacity: 0.8; */
    font-size: 300%;
    width: 50px;
    height: 50px;
    background-color: transparent;
}

.backBtn:hover{
    border: #96b1c9 2px solid;

}
/*title*/
/*title*/
/*title*/
#header-panel {
    position: relative;
    height:72px;
    background-image:url("../../../public/case/sustainable/pic/header.png");
    background-position: center top;
    background-size: 110% 100%;
    background-repeat: no-repeat;
    overflow:hidden;
}

.header-title {
    line-height:64px;
    text-align:center;
    font-size: 25px;
    font-weight: 350;
    color:#bef2ff;
    margin: 0;
}


/* media query */
/* media query */
/* media query */
@media (max-width:1900px) {
    #header-panel {height:48px;}
    #content-panel {top:36px;bottom:10px;}
    .header-title {line-height:42px;font-size:20px;}
    .flex-cell {padding:10px;}
    .chart-title {height:24px;font-size:16px;}
    .chart-div {top:24px;}
    .table-font{
        font-size: 12px;
    }
}

@media (max-width: 979px) {
    #table1,#table2{
        display: none;
    }
    
}
@-webkit-keyframes spin {
    0% {
        -webkit-transform: rotate(0deg);
        -ms-transform: rotate(0deg);
        transform: rotate(0deg)
    }
    100% {
        -webkit-transform: rotate(360deg);
        -ms-transform: rotate(360deg);
        transform: rotate(360deg)
    }
}
@keyframes spin {
    0% {
        -webkit-transform: rotate(0deg);
        -ms-transform: rotate(0deg);
        transform: rotate(0deg)
    }
    100% {
        -webkit-transform: rotate(360deg);
        -ms-transform: rotate(360deg);
        transform: rotate(360deg)
    }
}

/*grid*/
/*grid*/
/*grid*/
.card-panel{
    padding: 10px
}
.map-panel{
    width: 100%;
    height: 90%;
    margin: 2% 0 2%;
}

.card{
    width: 100%;
    height: 100%;
    border-style:solid;
    border-width:10px;
    border-image:url("../../../public/case/sustainable/pic/chart-wrapper.png") 20 / 1 / 0 repeat;
}

.row11{
    grid-area: 1 / 1 / 12 / 10 ;
}

.row12{
    grid-area: 1 / 10 / 12 / 26 ;
    /* overflow: auto; */
}
.row21{
    grid-area: 12 / 1 / 20 / 10;
    /* overflow: auto; */
    margin-bottom: 15px;
}
.row22{
    grid-area: 12 / 10 / 20 / 26;
    margin-bottom: 15px;
}


/*chart*/
/*chart*/
/*chart*/
.multiPie-panel{

    padding: 1% 1% 0;
}
.chart-panel{
    width: 100%;
    height: 100%;
    padding: 1% 3% 0;
}


.chart-header{
    text-align: center;
}
.chart-title{
    position: relative;
    top: 5%;
    margin: 0;
    color: #2f89cf;
    letter-spacing: 2px;
}
.chart-area{
    width: 100%;
    height: 90%;
    /*height: calc(100% - 30px);*/
}
/*.multiChart-title{*/
/*    color: #2f89cf;*/

/*}*/
.multi-bar{
    display: grid;
    /* overflow: auto; */
    grid-template-columns:  repeat(3,32%);
    grid-template-rows: repeat(2,48%);
    grid-area: 1 / 10 / 12 / 26;
    grid-template-areas:"a b c" "d e f";
    grid-gap: 2% 2%;
    /*grid-template-columns:  1% 32% 1% 32% 1% 32% 1%;*/
    /*grid-template-rows: 2% 47% 2% 47% 2%;*/
    /*grid-template-areas:*/
    /*                     ". . . . . . ."*/
    /*                     ". a . b . c ."*/
    /*                     ". . . . . . ."*/
    /*                     ". d . e . f ."*/
    /*                     ". . . . . . .";    */

}
.bar-item{
    width: 100%;
    height: 90%;
}
.bar-item1{
    grid-area: a;
}
.bar-item2{

    grid-area: b;
}
.bar-item3{

    grid-area: c;
}
.bar-item4{

    grid-area: d;
}
.bar-item5{

    grid-area: e;
}
.bar-item6{

    grid-area: f;
}
.bar-item7{

    grid-area: g;
}

.multi-pie{
    display: grid;
    overflow: auto;
    grid-template-columns:  repeat(6,19%);
    grid-template-rows: 10% 80% 10%;
    grid-area: 12 / 10 / 20 / 26;
    grid-template-areas:". . g . ."
                        "a b c d e"
                        "f f f f f";
    grid-gap: 0 1.25% ;
}
.pie-item{
    width: 100%;
    height: 90%;
}
.pie-item1{
    grid-area: a;
}
.pie-item2{
    grid-area: b;
}
.pie-item3{
    grid-area: c;
}
.pie-item4{
    grid-area: d;
}
.pie-item5{
    grid-area: e;
}
.pie-item-title{
    grid-area: g;
}
.pie-item-legend{
    grid-area: f;
}




/*content*/
/*content*/
/*content*/
#content-panel {
    display: grid;
    width: 100%;
    height: 100%;
    grid-template-columns: repeat(25, 4%);
    grid-template-rows: repeat(20,5%);
    padding: 10px 10px 15px 10px;
    /*position:absolute;*/
    /*top:0;*/
    /*bottom:20px;*/
    /*left:0;*/
    /*right:0;*/
}

</style>