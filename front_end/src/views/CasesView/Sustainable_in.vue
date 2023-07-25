<template>
  <div id="building">
    <div style="height: 95%; width: 100%">
      <!-- 占位p -->
      <P class="Title2"></P>
      <div style="height:12%; width: 15%; margin-left: 10%; padding-top: 15px">
          <!-- <el-steps :active="active" simple>
            <el-step title="体 系 浏 览" @click="turnTable"></el-step>
            <el-step title="位 置 浏 览" @click="turnMap"></el-step>
          </el-steps> -->
          <el-tabs v-model="activeName"  @click="handleClick" style="background-color: white !important ;border-radius: 15px;font-weight: bold !important;opacity: 0.9">
            <el-tab-pane label="体 系 浏 览" name="first" style="padding-left: 200px;margin-left: 200px;">
            </el-tab-pane>
            <el-tab-pane label="位 置 浏 览" name="second">
            </el-tab-pane>
          </el-tabs>
      </div>
      <div class="elContainerStyle" style="margin-left: 10%;">
        <router-view></router-view>
      </div>

    </div>

    <!-- 原嵌入式表格布局 -->
    <!-- 原嵌入式表格布局 -->
    <!-- 原嵌入式表格布局 -->
    <!-- 
  <el-container class="data-show">
    <el-main class="data-show-main">
      <el-row class="data-show-content">
        <div class="data-show-excel">
          <el-tabs style="height: 100%; width: 100%">
            <el-tab-pane
              label="长三角可持续发展评价指标体系"
              class="AnalyzeTitle"
            >
              <el-table
                class="tableStyle data-show-table"
                :data="SDGListA"
                :span-method="arraySpanMethod"
                max-height="700"
                border
                stripe
              >
                <el-table-column prop="dimension" label="维度" width="300">
                </el-table-column>
                <el-table-column prop="index" label="指标">
                </el-table-column>
                <el-table-column prop="value" label="值" width="150">
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="指标体系2" class="AnalyzeTitle" >
              <el-table
                class="tableStyle data-show-table"
                :data="SDGListA"
                :span-method="arraySpanMethod"  
                max-height="700"
                border
                stripe
              >
                <el-table-column prop="1" label="维度">
                </el-table-column>
                <el-table-column prop="2" label="指标">
                </el-table-column>
                <el-table-column prop="3" label="值">
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="指标体系3" class="AnalyzeTitle" >
              <el-table
                class="tableStyle data-show-table"
                :data="SDGListA"
                :span-method="arraySpanMethod"
                max-height="700"
                border
                stripe
              >
                <el-table-column prop="1" label="维度">
                </el-table-column>
                <el-table-column prop="2" label="指标">
                </el-table-column>
                <el-table-column prop="3" label="值">
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="指标体系4" class="AnalyzeTitle">
              <el-table
                class="tableStyle data-show-table"
                :data="SDGListA"
                :span-method="arraySpanMethod"
                max-height="700"
                border
                stripe
              >
                <el-table-column prop="1" label="维度">
                </el-table-column>
                <el-table-column prop="2" label="指标">
                </el-table-column>
                <el-table-column prop="3" label="值">
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-row>
    </el-main>

  </el-container> 
-->
  </div>
</template>

<script>
export default {
  name: "AnalyzePage",
  data() {
    return {
      RouterPath:['Table','Map'],
      active:0,
      //从后台请求的表格数据
      ExcelList: {},
      activeName: 'first',
    };
  },
  methods: {
    // 切换表格和地图
    turnMap(){
      this.active=1;
      // console.log(this.RouterPath[this.active],'进入指标页面');
      this.$router.push(this.RouterPath[this.active]);

    },
    turnTable(){
      this.active=0;
      // console.log(this.RouterPath[this.active],'进入地图页面');
      this.$router.push(this.RouterPath[this.active]);
    },
    handleClick(tab, event) {
      // console.log(tab,event);
      if(this.activeName==="first"){
        this.turnTable();
      }else if(this.activeName==="second"){
        this.turnMap();
      }
    },
  },
};
</script>

<style scoped>
@import "../../../public/case/sustainable/css/MyStyle.css";
#building {
  background: url("../../../public/case/sustainable/pic/background.jpg");
  width: 100%;
  height: 100%;
  position: fixed;
  background-size: 100% 100%;
}
.elContainerStyle {
  overflow-y: auto !important;
  height: 74%;
  width: 80%;
  /* margin-left: 10%; */
  margin-top: 0%;
  background-color: hsla(0, 0%, 100%, 0.2);
  border-radius: 20px;
  box-shadow: 3px 3px 15px #506a5a;
    /*实现横排*/
  display: flex; 
  /* 实现超出换行 */
  flex-wrap: wrap; 
}
.SystemCardStyle {
  /* 这里的vh和vw单位不要改成%，初步判断是因为加了滚动条之后，父容器的高度会随之拓展，导致子容器高度设定失效 */
  height: 28vh;
  width: 16.8vw;
  margin: 2%;
  background-color: hsla(0, 0%, 100%, 0.5);
  cursor: pointer;
  border-radius: 10px;
}

.SystemCardCharacterStyle {
  text-align: center;
  font-family: "Microsoft YaHei";
  font-size: 0.8rem;
  font-weight: 500;
  line-height: 1.5; 
}

/*聚集之后改变样式*/
.el-button:focus {
  background: #3a8ee6;
  border-color: #3a8ee6;
  color: #fff;
}
.leaflet-popup-close-button {
        display: none; 
    }
/deep/ .el-tabs__item{
  font-weight: bold !important;
  margin-left: 30px;
  padding: 0px;
  }
/* 原嵌入式表格css */
/* 原嵌入式表格css */
/* 原嵌入式表格css */
/*
.el-main{
  padding:0%;
}
.data-show {
        height: 100%;
        width: 100%;

    }
    .data-show-main{
        height: 95%;
        width: 100%;
    }

    data-show,
    data-show-main,
    .data-show-content > div {
        height: 100%;
    }

    .data-show-content {
        padding: 30px 20px;
    }

    .data-show-excel {
        display: flex;
        flex-direction: column;
        background-color: rgba(8, 16, 31, 0.2);
        position: relative;
        width:100%;
    }

    .AnalyzeTitle{
        color: #ffffff;
        font-size: 1.10rem;
        font-weight: 500;
        line-height: 1.2;
        font-family: "Oswald-Bold";

    }

    .data-show-table{
        height: 95%;
        width: 95%;
        margin-left: 2.5%;
        margin-bottom: 2.5%;
    }

    /deep/.el-tabs__item {
        padding: 0 20px;
        height: 40px;
        box-sizing: border-box;
        display: inline-block;
        list-style: none;
        font-size: 15px;
        font-weight: 500;
        margin-left: 2px;
        color: #ffffff;
       }

    /deep/.el_tabs_content{
        height: 100%;
        width:100%;
    }
    */
</style>