<template>
    <el-container>
        <el-scrollbar style="min-height:50vh;width: 100%">
        <div style="min-height: 70vh;width: 100%;margin-left: 0%;margin-top: 0%;background-color: hsla(0, 0%, 100%, 0.2);border-radius: 20px;box-shadow: 3px 3px 15px #506a5a;display: flex;flex-wrap: wrap; overflow-y:auto; ">
        <!-- 写死的表格 -->
        <div class="SystemCardStyle" @click="dialogVisible = true" style="overflow-y: scroll">
          <el-image
            style="width: 28%; height: 35%; margin-left: 36%; margin-top: 8%"
            :src="require('../../../public/case/sustainable/pic/4.png')"
            :fit="fill">
          </el-image>
          <a class="close-icon" @click="closeCard">&times;</a>
          <div class="SystemCardCharacterStyle">长三角可持续发展评价指标体系</div>
          <div class="SystemCardCharacterStyle">研究区域:长三角</div>
          <div class="SystemCardCharacterStyle">创建时间:2022/11/13 下午12:00:00</div>
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
                <a class="close-icon" @click="closeCard(Excel.id)">&times;</a>
                <div class="SystemCardCharacterStyle">{{Excel.name}}</div>
                <div class="SystemCardCharacterStyle">研究区域:{{Excel.region}}</div>
                <div class="SystemCardCharacterStyle">创建时间:{{Excel.time}}</div>
          <!--  弹出对话框-->
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
</template>

<script>
import axios from "axios";
import "../../../src/mock/mockServe.js";
import Global from "../../../public/case/sustainable/Global";
import api from "../../../public/case/sustainable/js/axio"
// 这里用const引入axios，没有用import，具体区别我不知道，试一试
// const axios = require("axios");
export default{
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
        // 删除表格功能
        closeCard(id) {
          // 阻止父组件的点击事件
          event.stopPropagation();
          // alert(id);
          // if (confirm("你确定要删除这个综合体系吗？")) {
          //     // 用户单击了“确定”按钮
          //     api.deleteTableData(id).then((Response)=>{
          //       // console.log(Response,'getdelete');
          //       this.ExcelList = Response.data;
          //       this.$message({
          //               message: '已成功删除',
          //               type: 'success'
          //       });
          //     });
          // } else {
          //     // 用户单击了“取消”按钮
          //     this.$message({
          //               message: '删除操作已取消',
          //               type: 'success'
          //     });
          // }
              this.$confirm('此操作将永久删除该体系, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                // 用户单击了“确定”按钮
                api.deleteTableData(id).then((Response)=>{
                  // console.log(Response,'getdelete');
                  this.ExcelList = Response.data;
                  this.$message({
                          message: '删除成功',
                          type: 'success'
                  });
                });
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消删除'
                });          
              });
          

          // api.SaveBuildTableData(body).then((Response)=>{
          //           console.log(Response,'saveData2.2');
          // });
        },
        //控制对话框的展开
        controlDialog(id) {
          // 控制台输出数据列表，看看里面有什么内容，需要点击一个视图来打印
          // console.log(this.ExcelList,'111');
          // 展开前先清除现存数据，防止上一个dialogue的数据遗存（如果上一个dialogue没有点“确定”按钮退出而且点×或者别处，就会保留数据）
          this.IdJudge = "";
          this.ColumnName.length = 0;
          //控制对话框的展开
          this.dialogTableVisible = !this.dialogTableVisible;
          this.IdJudge = id;
          //通过JSON id获取属性列
          let i = 0
          for(i; i < this.ExcelList.length; i++) {
              if (this.ExcelList[i].id === id) {
              for (let keyname in this.ExcelList[i].data[0])
                  if (Object.prototype.hasOwnProperty.call(this.ExcelList[i].data[0],keyname)){
                      if (keyname.indexOf("index") === -1) {
                        if(keyname.indexOf("得分") === -1 && keyname.indexOf("权重") === -1){
                          this.ColumnName.push(keyname);
                          var score = keyname + "得分";
                          var weight = keyname + "权重";
                          if(score in this.ExcelList[i].data[0] && weight in this.ExcelList[i].data[0]){
                            this.ColumnName.push(weight);
                            this.ColumnName.push(score);
                          }
                        }
                      }
                  }
              break;
                  }
              };
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
      },
      mounted() {
    //加载表格数据
    // this.initListData()
    axios.get(Global.SDGUrl+'/api/EcoData').then((response) => {
      this.ExcelList = response.data;
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

}
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
  /* height: 74%;
  width: 80%;
  margin-left: 10%;
  margin-top: 0%; */
  height: 100%;
  width: 100%;
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
  position:relative;
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
.close-icon {
  font-size: 1.3em;
  color: #999;
  text-decoration: none;
  position: absolute;
  right: 15px;
  top: 10px;
}

.close-icon:hover {
  color: #333;
}
</style>