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
        <h3 class="header-title">{{province}}生态文明建设年度评价专题展示系统
       </h3>
    </header>
    <el-select v-model="require" placeholder=require class="selection">
      <el-option
        v-for="item in options"
        v-on:click="placeChange"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
     </el-select>

   
   
     <div id="content-panel">
      <!-- .row11是左上角的地图模型容器 -->
      <div class="card-panel row11">
        <div class="card" >
          <div class="chart-header"><h4 class="chart-title multiChart-title">20xx年{{province}}生态文明建设年度考核结果</h4></div>
          <div id="map-show" class="map-panel">
          </div>
        </div>
      </div>
      <!-- .row12是右上角的六个柱状图模型容器 -->
      <div class="card-panel row12">
        <div class="multi-bar card ">
          <div class="chart-panel">
            <div class="chart-header"><h4 class="chart-title multiChart-title">资源利用指数</h4></div>
            <div id="bar-item1" class="bar-item bar-item1"></div>

          </div>
          <div class="chart-panel">
            <div class="chart-header"><h4 class="chart-title multiChart-title">环境治理指数</h4></div>
            <div id="bar-item2" class="bar-item bar-item2"></div>

          </div>
          <div class="chart-panel">
            <div class="chart-header"><h4 class="chart-title multiChart-title">环境质量指数</h4></div>
            <div id="bar-item3" class="bar-item bar-item3"></div>

          </div>
          <div class="chart-panel">
            <div class="chart-header"><h4 class="chart-title multiChart-title">生态保护指数</h4></div>
            <div id="bar-item4" class="bar-item bar-item4"></div>

          </div>
          <div class="chart-panel">
            <div class="chart-header"><h4 class="chart-title multiChart-title">增长质量指数</h4></div>
            <div id="bar-item5" class="bar-item bar-item5"></div>

          </div>
          <div class="chart-panel">
            <div class="chart-header"><h4 class="chart-title multiChart-title">绿色生活指数</h4></div>
            <div id="bar-item6" class="bar-item bar-item6"></div>

          </div>
        </div>
      </div>
      <!-- .row21是左下角的柱状图容器 -->
      <div class="card-panel row21">
        <div class="card">
          <div class="chart-panel ">
            <div class="chart-header">
              <h4 class="chart-title">绿色发展指数</h4>
            </div>
            <div class="chart-area" id="greenDevelop"></div>
          </div>
        </div>
      </div>
      <!-- .row22是右下角的五个饼图容器 -->
      <div class="card-panel row22">
        <div class="multi-pie card">
            <div id="pie-item-title" class="pie-item-title text-center"><h4 class="chart-title" style="text-align: center">Top5 城市</h4></div>
            <div id="pie-item1"  class="pie-item1 pie-item "></div>
            <div id="pie-item2"  class="pie-item2 pie-item "></div>
            <div id="pie-item3"  class="pie-item3 pie-item "></div>
            <div id="pie-item4"  class="pie-item4 pie-item "></div>
            <div id="pie-item5"  class="pie-item5 pie-item "></div>
            <div id="pie-item-legend" class="pie-item-legend pie-item"></div>

<!--          <div class="multiPie-panel">-->
<!--            <div class="chart-header"><h4 class="chart-title multiChart-title">TOP5城市</h4></div>-->
<!--            <div id="pie-item" class="pie-item pie-item1"></div>-->
<!--          </div>-->
        </div>
      </div>

    </div>
  </div>

  <!--  </div>-->
</template>


<script>
// 左上角地图绘制
import { DataShowMap } from "../../../public/case/sustainable/js/map";
// 其余的统计图表模型绘制
import {drawChart} from "../../../public/case/sustainable/js/CreateChart";
import { provide } from '@vue/runtime-core';
export default {
  name: "themeZJ",
  data() {
    return{
      province :'浙江省',
      require:'ZheJiang',
      chartData:{},
      options: [{
          value: 'AnHui',
          label: '安徽省'
        }, {
          value: 'ZheJiang',
          label: '浙江省'
        }, {
          value: 'JiangSu',
          label: '江苏省'
        }, {
          value: 'ShangHai',
          label: '上海市'
        }],
        value: require
    }
  },
  mounted() {
    // 重新获取数据时必须清空_echarts_instance_ 属性，否则不匹配就不会显示图表
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

    document.title = this.province+'生态文明建设年度评价专题展示系统'
    // 通过require中的省份数据，绘制echarts图表
    drawChart(this.require);
    // 左上角地图绘图方法
    this.mapInit();
  },
  beforeUnmount() {
    this.mapObj && this.mapObj.destroy();
    this.myChart && this.myChart.destroy();
  },
  methods: {
    mapInit() {
      this.mapObj = new DataShowMap("map-show");
    },
    // 点击省份切换下拉框，自动更新可视化图表
    placeChange(){
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
      // console.log(this.require,"require");
      if(this.require == 'AnHui'){
        document.title = '安徽省生态文明建设年度评价专题展示系统';
        this.province = '安徽省'
      }else if(this.require == 'ZheJiang'){
        document.title = '浙江省生态文明建设年度评价专题展示系统';
        this.province = '浙江省'
      }else if(this.require == 'JiangSu'){
        document.title = '江苏省生态文明建设年度评价专题展示系统';
        this.province = '江苏省'
      }else if(this.require == 'ShangHai'){
        document.title = '上海市生态文明建设年度评价专题展示系统';
        this.province = '上海市'
      }else{
        document.title = '浙江省生态文明建设年度评价专题展示系统';
      }
    // 通过require中的省份数据，绘制echarts图表
      drawChart(this.require);
    // 左上角地图绘图方法
      this.mapInit();
    }
  },
}

</script>

<style scoped>
/*global*/
/*global*/
/*global*/

* {margin:0;padding:0;box-sizing:border-box;}
.selection{
    z-index:999;
    position: absolute;
    top: 2.8%;
    left: 1.4%;
    border-radius: 25px;
    /* opacity: 0.8; */
    font-size: 300%;
    width: 100px;
    height: 50px;
    background-color: transparent;
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
}
.row21{
    grid-area: 12 / 1 / 20 / 10;
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

    grid-template-columns:  repeat(3,32%);
    grid-template-rows: repeat(2,49%);
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

.multi-pie{
    display: grid;
    grid-template-columns:  repeat(5,19%);
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

/* 待添加模块，如果需要就把下方css样式加上 */
/* .row12{
  grid-area: 1 / 14 / 12 / 26 ;
}
.row13{
  grid-area: 1 / 10 / 12 / 14;
} */

</style>