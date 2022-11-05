<template>
  <div id="building">
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
  </div>
  
</template>

<script>
export default {
  name: "AnalyzePage",
  data() {
    return {
      // currentYear: new Date().getFullYear(),
      SDGListA: [
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
        }
      ],
      // needMergeArr: ["维度", "指标", "值"],
    };
  },
  methods: {
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          if (rowIndex === 0) {
            return [7, 1];
          } else if(rowIndex === 7){
            return [5, 1];
          }else if(rowIndex === 12){
            return [6, 1];
          }else if(rowIndex === 18){
            return [6, 1];
          }else if(rowIndex === 24){
            return [7, 1];
          }else if(rowIndex === 31){
            return [4, 1];
          }else{
            return [0, 0];
          }
        }
      }
  },
  mounted() {
    //加载表格数据
    // this.initListData()
  },
};
</script>

<style scoped>
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
        /* width: 100%; */
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
    #building{
    background:url("../../../public/case/sustainable/background.jpg");
    width:100%;
    height:100%;
    position:fixed;
    background-size:100% 100%;
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
</style>