<template>
  <div id="building">
    <div style="height: 95%; width: 100%">
      <!-- 占位p -->
      <P class="Title2"></P>
      <div style="height: 12%; width: 17%; margin-left: 10%; padding-top: 15px">
        <el-steps simple>
          <el-step title="  可 持 续 指 标 体 系 浏 览"></el-step>
        </el-steps>
      </div>

        <el-container class="elContainerStyle" >
          <el-scrollbar style="height: 100%">
          <div style="height: 100%;width: 100%;margin-left: 0%;margin-top: 0%;background-color: hsla(0, 0%, 100%, 0.2);border-radius: 20px;box-shadow: 3px 3px 15px #506a5a;display: flex;flex-wrap: wrap; overflow-y:auto; ">
        <!-- 写死的表格 -->
        <!-- 写死的表格 -->
        <!-- 写死的表格 -->
        <div class="SystemCardStyle" @click="dialogVisible = true" style="overflow-y: scroll">
          <el-image
            style="width: 28%; height: 35%; margin-left: 36%; margin-top: 8%"
            :src="require('../../../public/case/sustainable/pic/4.png')"
            :fit="fill">
          </el-image>
          <div class="SystemCardCharacterStyle">长三角可持续发展评价指标体系</div>
          <div class="SystemCardCharacterStyle">研究范围：长三角可持续发展</div>
          <div class="SystemCardCharacterStyle">创建时间：2022年11月13日</div>
          <!-- 内容存储位置 -->
          <!-- :span-method是传递的一个合并行的方法，max-height是限定表格的长度（超出就滚动条），border边框，stripe斑马纹 -->
           <!-- 这里写了宽度的就是确定的，不写就独揽剩下的空间 -->
           <!-- 不要把这个dialog弄到div外面去，页面会崩溃，除了控制dialog显示的参数名要不同以外，同一级也不能出现两个dialog -->
          <el-dialog title="长三角可持续发展评价指标体系" v-model="dialogVisible" width="60%">
          <el-table :data="SDAsData" :span-method="arraySpanMethod1" max-height="400" border stripe>
            <el-table-column property="dimension" label="维度" width="200"></el-table-column>
            <el-table-column property="index" label="指标"></el-table-column>
            <el-table-column property="value" label="值" width="150"></el-table-column>
          </el-table>
          <slot name="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
          </slot>
        </el-dialog>
        </div>

        <!-- 遍历数据库获取表格的过程 -->
        <!-- 遍历数据库获取表格的过程 -->
        <!-- 遍历数据库获取表格的过程 -->
        <div v-for="Excel in ExcelList" :key="Excel.id"  class="SystemCardStyle" @click="controlDialog(Excel.id)" style="overflow-y: scroll">
                <el-image
                  style="width: 28%; height: 35%; margin-left: 36%; margin-top: 8%"
                  :src="require('../../../public/case/sustainable/pic/4.png')"
                  :fit="fill">
                </el-image>
                <div class="SystemCardCharacterStyle">{{Excel.name}}</div>
                <div class="SystemCardCharacterStyle">研究范围：{{Excel.region}}</div>
                <div class="SystemCardCharacterStyle">创建时间：{{Excel.time}}</div>
          <!--  弹出对话框-->
          <!-- TAT  TAT   TAT 我是个笨比，原来的:visible.sync被废弃了，只能用v-model，但是v-model又不能写表达式，导致前端点一下所有dialog都出来了TAT，我花了好长时间，包括计算属性、增添函数、增添参数、各种偏方都试过了还是不行，最后才想起来v-if，哇呜呜呜呜呜呜呜~~~ -->
          <el-dialog :title=Excel.name v-model="dialogTableVisible" width="60%" v-if="IdJudge == Excel.id">
            <el-table :data="Excel.data" :span-method="arraySpanMethod" max-height="400" border>
              <el-table-column v-for="item in ColumnName" :key="item" :prop="item" :label="item">
              </el-table-column>
            </el-table>
            <slot name="footer" class="dialog-footer">
              <el-button type="primary" @click="controlHide">确 定</el-button>
            </slot>
          </el-dialog>
        </div>

          </div>
        </el-scrollbar> 



      </el-container>

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
import axios from "axios";
import "../../../src/mock/mockServe.js";
import { toRaw } from '@vue/reactivity';
import Global from "../../../public/case/sustainable/Global";
// 这里用const引入axios，没有用import，具体区别我不知道，试一试
// const axios = require("axios");
let SystemSelectClickState = "";
let SystemSelectData = "";
//选择权重页面
let SystemWeightData = "";
let SystemSelectColumnName = new Array();
//记录是否进行权重设置
export default {
  name: "AnalyzePage",
  data() {
    return {
      // currentYear: new Date().getFullYear(),
      SDAsData: [
        {
          dimension: "生态绿色发展",
          index: "地表水水质优良（达到或好于Ⅲ类）比例（%）",
          value: "1",
        },
        {
          dimension: "生态绿色发展",
          index: "受污染耕地安全利用率（%）",
          value: "2",
        },
        {
          dimension: "生态绿色发展",
          index: "空气质量优良天数(天)",
          value: "3",
        },
        {
          dimension: "生态绿色发展",
          index: "森林覆盖率（%）",
          value: "4",
        },
        {
          dimension: "生态绿色发展",
          index: "能源消费总量",
          value: "5",
        },
        {
          dimension: "生态绿色发展",
          index: "人均公园绿地面积",
          value: "6",
        },
        {
          dimension: "生态绿色发展",
          index: "城镇生活污水集中收集率（%）",
          value: "7",
        },
        {
          dimension: "经济社会协调",
          index: "人均地区生产总值（万元）",
          value: "1",
        },
        {
          dimension: "经济社会协调",
          index: "社会保障和就业支出占财政支出比例",
          value: "2",
        },
        {
          dimension: "经济社会协调",
          index: "固定资产投资额占GDP比重（%）",
          value: "3",
        },
        {
          dimension: "经济社会协调",
          index: "城镇登记失业率(%)",
          value: "4",
        },
        {
          dimension: "经济社会协调",
          index: "养老保险参保率",
          value: "5",
        },
        {
          dimension: "基础设施融合",
          index: "交通（铁路、公路）路网密度",
          value: "1",
        },
        {
          dimension: "基础设施融合",
          index: "互联网覆盖率",
          value: "2",
        },
        {
          dimension: "基础设施融合",
          index: "公共文体设施覆盖率",
          value: "3",
        },
        {
          dimension: "基础设施融合",
          index: "城市二级及以上医院覆盖率",
          value: "4",
        },
        {
          dimension: "基础设施融合",
          index: "地方高等学校数量",
          value: "5",
        },
        {
          dimension: "基础设施融合",
          index: "人均避难场所面积",
          value: "6",
        },
        {
          dimension: "创新驱动引领",
          index: "科技拨款占财政拨款的比重",
          value: "1",
        },
        {
          dimension: "创新驱动引领",
          index: "R&D经费占GDP比重",
          value: "2",
        },
        {
          dimension: "创新驱动引领",
          index: "发明专利授权数占专利授权数的比重",
          value: "3",
        },
        {
          dimension: "创新驱动引领",
          index: "单位GDP能耗",
          value: "4",
        },
        {
          dimension: "创新驱动引领",
          index: "劳动力中大专及以上学历人数",
          value: "5",
        },
        {
          dimension: "创新驱动引领",
          index: "每万人R&D人员全时当量",
          value: "6",
        },
        {
          dimension: "对外开放共享",
          index: "每万人R&D人员全时当量",
          value: "1",
        },
        {
          dimension: "对外开放共享",
          index: "港口年集装箱吞吐量",
          value: "2",
        },
        {
          dimension: "对外开放共享",
          index: "机场年旅客吞吐量",
          value: "3",
        },
        {
          dimension: "对外开放共享",
          index: "实际利用外资金额",
          value: "4",
        },
        {
          dimension: "对外开放共享",
          index: "跨国公司地区总部数",
          value: "5",
        },
        {
          dimension: "对外开放共享",
          index: "留学归国人员和外籍从业人员数",
          value: "6",
        },
        {
          dimension: "对外开放共享",
          index: "入境旅游人数占国内外旅游总人数的比重",
          value: "7",
        },
        {
          dimension: "长三角一体化",
          index: "沪苏浙毗邻区域行政服务事项互联互通比重",
          value: "1",
        },
        {
          dimension: "长三角一体化",
          index: "长三角异地门诊和住院直接结算联网率及开通率",
          value: "2",
        },
        {
          dimension: "长三角一体化",
          index: "都市圈1小时通勤人口覆盖率",
          value: "3",
        },
        {
          dimension: "长三角一体化",
          index: "企业外省市设立分子公司数量",
          value: "4",
        },
      ],
      dialogVisible: false,
      // needMergeArr: ["维度", "指标", "值"],
      //从后台请求的表格数据
      ExcelList: {},
      //判断是否开启对话框
      dialogTableVisible: false,
      IdJudge: "",
      //获取json列表的列名
      ColumnName: [],
      needMergeArr1: [],
      rowMergeArrs: {},
    };
  },
  methods: {
    // 第一个写死数据的表格合并方法，练手，也是写死的
    arraySpanMethod1({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex === 0) {
          return [7, 1];
        } else if (rowIndex === 7) {
          return [5, 1];
        } else if (rowIndex === 12) {
          return [6, 1];
        } else if (rowIndex === 18) {
          return [6, 1];
        } else if (rowIndex === 24) {
          return [7, 1];
        } else if (rowIndex === 31) {
          return [4, 1];
        } else {
          return [0, 0];
        }
      }
    },

    //控制对话框的展开
    controlDialog(id) {
      //控制对话框的展开
      this.dialogTableVisible = !this.dialogTableVisible;
      this.IdJudge = id;
      //通过JSON id获取属性列
      let i = 0;
      for (i; i < this.ExcelList.length; i++) {
        if (this.ExcelList[i].id === id) {
          for (let keyname in this.ExcelList[i].data[0])
            if (
              Object.prototype.hasOwnProperty.call(
                this.ExcelList[i].data[0],
                keyname
              )
            ) {
              if (keyname.indexOf("权重") === -1) {
                this.ColumnName.push(keyname);
              }
            }
          break;
        }
      }
      //合并单元
      this.rowMergeArrs1 = this.rowMergeHandle(
        this.needMergeArr1,
        this.ExcelList[i].data
      );
    },
    // 隐藏对话框
    controlHide() {
      this.IdJudge = "";
      this.dialogTableVisible = false;
      this.ColumnName.length = 0;
    },
    // 合并表格的三个函数
    arraySpanMethod({ column, rowIndex }) {
      // 把需要循环的列名加入
      for (let i = 0; i < this.needMergeArr1.length; i++)
        if (column.property === this.needMergeArr1[i])
          return this.mergeAction(this.needMergeArr1[i], rowIndex);
    },
    mergeAction(val, rowIndex) {
      let _row = this.rowMergeArrs1[val].rowArr[rowIndex];
      let _col = _row > 0 ? 1 : 0;
      return [_row, _col];
    },
    rowMergeHandle(arr, data) {
      if (!Array.isArray(arr) && !arr.length) return false;
      if (!Array.isArray(data) && !data.length) return false;
      let needMerge = {};
      arr.forEach((i) => {
        needMerge[i] = {
          rowArr: [],
          rowMergeNum: 0,
        };
        data.forEach((item, index) => {
          if (index === 0) {
            needMerge[i].rowArr.push(1);
            needMerge[i].rowMergeNum = 0;
          } else {
            if (item[i] === data[index - 1][i]) {
              needMerge[i].rowArr[needMerge[i].rowMergeNum] += 1;
              needMerge[i].rowArr.push(0);
            } else {
              needMerge[i].rowArr.push(1);
              needMerge[i].rowMergeNum = index;
            }
          }
        });
      });
      return needMerge;
    },
    // 选择状态(勾选按钮的方法)
    // GetClickState(Prm) {
    //   //重新初始化数据
    //   SystemSelectClickState = Prm;
    //   SystemSelectColumnName.length = 0;
    //   SystemSelectData = "";
    //   let i = 0;
    //   for (i; i < this.ExcelList.length; i++) {
    //     if (this.ExcelList[i].id === SystemSelectClickState) {
    //       SystemSelectData = this.ExcelList[i];
    //       for (let keyname in this.ExcelList[i].data[0])
    //         if (
    //           Object.prototype.hasOwnProperty.call(
    //             this.ExcelList[i].data[0],
    //             keyname
    //           )
    //         ) {
    //           //要判断是否具有权重字段
    //           if (keyname.indexOf("权重") === -1) {
    //             SystemSelectColumnName.push(keyname);
    //             //说明这个地方已经设置过权重了

    //             // 我感觉这里是拼错了，原代码中WeightState仅在这里出现过一次，都没有声明。而且不知道为什么原代码没报错
    //             // WeightState = 1;
    //             SystemWeightData = 1;
    //           }
    //         }
    //       break;
    //     }
    //   }
    // },

    //删除数据（删除按钮的方法）
    // deleteDataById(id) {
    //   this.$confirm("此操作将永久删除该体系, 是否继续?", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //   })
    //     .then(() => {
    //       axios
    //         .post(
    //           "http://172.21.213.66:8080/newsdgplatformbackground_war/api/DeleteData",
    //           id
    //         )
    //         .then((response) => {
    //           this.ExcelList = response.data;
    //         });
    //       this.$message({
    //         type: "success",
    //         message: "删除成功!",
    //       });
    //     })
    //     .catch(() => {
    //       this.$message({
    //         type: "info",
    //         message: "已取消删除",
    //       });
    //     });
    // },
  },
  mounted() {
    //加载表格数据
    // this.initListData()
    axios.get(Global.SDGUrl+'/api/EcoData').then((response) => {
      this.ExcelList = response.data;
      console.log(this.ExcelList,'111');
      console.log(this.ExcelList[1].name,'222');
      //得到全部的属性列用来合拼表格
      for (let i = 0; i < this.ExcelList.length; i++) {
        for (let keyname in this.ExcelList[i].data[0])
          if (
            Object.prototype.hasOwnProperty.call(
              this.ExcelList[i].data[0],
              keyname
            )
          ) {
            this.needMergeArr1.push(keyname); 
          }
      }
    });
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
  margin-left: 10%;
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