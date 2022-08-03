<template>
    <el-scrollbar>
      <el-row style="height: 92.54vh;padding:20px 20px 15px 20px;overflow: scroll;min-width: 1735px">
        <el-col :span="8">
          <div class="box-left left1">
            <dv-border-box1 >
              <dv-decoration-7 class="box-title"><h3 class="box-title-text">创新投入</h3></dv-decoration-7>
              <div id="leftChart1" class="chart"></div>
            </dv-border-box1>
          </div>
          <div class="box-left left2">
            <dv-border-box1 >
              <dv-decoration-7 class="box-title"><h3 class="box-title-text">创新环境</h3></dv-decoration-7>
              <div id="leftChart2" class="chart"></div>
            </dv-border-box1>
          </div>
          <div class="box-left left3">
            <dv-border-box1 >
              <dv-decoration-7 class="box-title"><h3 class="box-title-text">创新产出</h3></dv-decoration-7>
              <div id="leftChart3" style="width: 100%;height: 90%;"></div>
            </dv-border-box1>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="box-mid mid1"><h1>长三角区域创新专题</h1></div>
          <div class="box-mid mid2">
            <dv-decoration-5 :dur="3" style="width:100%;height:40px;" />
          </div>
          <div class="box-mid mid3">
            <dv-border-box1>
              <el-row>
                <template v-for="(item,key) in midData" :key="key">
                  <el-col :span="8" style="display: flex;flex-direction: column;align-items: center;margin-top: 30px">
                    <h3>{{item.name}}</h3>
                    <h1 style="color:#4786d4 ">{{item.value}}</h1>
                  </el-col>
                </template>
              </el-row>
              <div id="midChart1" style="height:75%;width:95%;padding: 0 15px 0 15px"></div>
            </dv-border-box1>
          </div>
          <div class="box-mid mid4">
            <dv-border-box1>
              <div style="width: 100%;height: 30px;display: flex">
                <dv-decoration-7 style="margin-left:calc(calc(100% - 360px)/2);width:180px;height:30px;"><h3>瞪羚企业数</h3></dv-decoration-7>
                <dv-decoration-7 style="margin-left:calc(calc(100% - 480px)/2);width:180px;height:30px;"><h3>独角兽企业数</h3></dv-decoration-7>
              </div>
              <div style="width: 100%;height: 100%;display: flex">
                <div id="midChart2" style="width: 70%;height: 90%;"></div>
                <div id="midChart3" style="width: 30%;height: 90%;"></div>
              </div>
            </dv-border-box1>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="box-right right1">
            <dv-border-box1 >
              <dv-decoration-7 class="box-title"><h3 class="box-title-text">重点城市创新概况</h3></dv-decoration-7>
              <div id="rightChart1" style="width: 100%;height: 90%;"></div>
            </dv-border-box1>
          </div>
          <div class="box-right right2">
            <dv-border-box1 >
              <dv-decoration-7 class="box-title"><h3 class="box-title-text">创新综合评价结果</h3></dv-decoration-7>
              <div style="width: 100%;height: 60%;display: flex">
                <div id="rightChart2" style="width: 50%;height: 100%;"></div>
                <div id="rightChart3" style="width: 50%;height: 100%;"></div>
              </div>
              <div style="width: 100%;height: 40%;display: flex">
                <div id="rightChart4" style="width: 100%;height: 100%;"></div>
                <div id="rightChart5" style="width: 100%;height: 100%;"></div>
                <div id="rightChart6" style="width: 100%;height: 100%;"></div>
              </div>
            </dv-border-box1>
          </div>
        </el-col>
      </el-row>
    </el-scrollbar>
  <p style="position:fixed;color: gray;bottom: 0;right: 20px;font-size: 0.75em">*本专题数据时间2019年</p>
</template>

<script setup>
import * as echarts from 'echarts';
import {onMounted,ref} from "vue";
import "echarts/extension/bmap/bmap";

const midData = ref([]);
midData.value = [
  {
    name:'人均地区生产总值(元)',
    value:'104452'
  },{
    name:'常住人口(万人)',
    value:'22714'
  },{
    name:'土地面积(平方公里)',
    value:'359141'
  },
]
let leftChart1,leftChart2,leftChart3,rightChart1,rightChart2,rightChart3,midChart1,midChart3,midChart2,rightChart4,rightChart5,rightChart6;
onMounted(()=>{
  leftChart1 = echarts.init(document.getElementById('leftChart1'));
  leftChart2 = echarts.init(document.getElementById('leftChart2'));
  leftChart3 = echarts.init(document.getElementById('leftChart3'));
  rightChart1 = echarts.init(document.getElementById('rightChart1'));
  rightChart2 = echarts.init(document.getElementById('rightChart2'));
  rightChart3 = echarts.init(document.getElementById('rightChart3'));
  midChart1 = echarts.init(document.getElementById('midChart1'));
  midChart3 = echarts.init(document.getElementById('midChart3'));
  midChart2 = echarts.init(document.getElementById('midChart2'));
  rightChart4= echarts.init(document.getElementById('rightChart4'));
  rightChart5= echarts.init(document.getElementById('rightChart5'));
  rightChart6= echarts.init(document.getElementById('rightChart6'));
  loadLeftChart1();
  loadLeftChart2();
  loadLeftChart3();
  loadRightChart1();
  loadRightChart2();
  loadRightChart3();
  loadRightChart4(rightChart4,radarData[0].title,radarData[0].data);
  loadRightChart4(rightChart5,radarData[1].title,radarData[1].data);
  loadRightChart4(rightChart6,radarData[2].title,radarData[2].data);
  loadMidChart1();
  loadMidChart2();
  loadMidChart3();
})
//使echarts高度宽度自动变化
window.onresize = () =>{
  leftChart1.resize();
  leftChart2.resize();
  leftChart3.resize();
  rightChart1.resize();
  rightChart2.resize();
  rightChart3.resize();
  midChart1.resize();
  midChart3.resize();
  midChart2.resize();
  rightChart4.resize();
  rightChart5.resize();
  rightChart6.resize();
}
const loadLeftChart1 = () => {
  let option;

  option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    grid: {
      top:'0%',
      left: '5%',
      right: '5%',
      bottom: '18%',
      containLabel: true
    },
    legend: {
      data: ['R&D经费投入强度(%)', 'R&D人员(万人)'],
      bottom:'20'
    },
    xAxis: {
      type: 'value'
    },
    yAxis: {
      type: 'category',
      axisLine: { show: false },
      axisLabel: { show: true },
      axisTick: { show: false },
      splitLine: { show: false },
      data: ['上海市', '江苏省', '浙江省', '安徽省'],
      position:"right"
    },
    series: [
      {
        name:"R&D经费投入强度(%)",
        data: [-3.9958, -2.7898, -2.678, -2.0316],
        type: 'bar',
        stack: 'Total',
        itemStyle:{
          color:'#5791d8'
        },
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)'
        },
      },
      {
        name:"R&D人员(万人)",
        type: 'bar',
        stack: 'Total',
        itemStyle:{
          color:'#50c6c2'
        },
        label: {
          show: false,
        },
        data: [29.3346, 90, 70.3863, 26.0266],
      }
    ]
  };
  leftChart1.setOption(option);
}
const loadLeftChart2 = () => {
  let option;
  option = {
    tooltip: {
      trigger: 'item'
    },
    grid: {
      top:'0%',
      left: '5%',
      right: '5%',
      bottom: '20%',
      containLabel: true
    },
    title: {
      text:'高技术产业从业人员年平均数',
      bottom:'20',
      left:'center',
      textStyle:{
        color:'#a5a8c8',
        fontSize: 14,
      }
    },
    color:['#4ac3bf','#4f8cd7','#88eadf','#70b0eb'],
    series: [
      {
        name: '高技术产业从业人员年平均数(人)',
        type: 'pie',
        radius: ['40%', '60%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          formatter:'{b}: {d}%'
        },
        emphasis: {
          label: {
            show: true,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: true
        },
        data: [
          { value: 460478, name: '上海市'},
          { value: 2034327, name: '江苏省' },
          { value: 804887, name: '浙江省' },
          { value: 326070, name: '安徽省' },
        ],
        top:0,
      }
    ]
  };
  leftChart2.setOption(option);
}
const loadLeftChart3 = () => {
  let option;
  option = {
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      top:'20%',
      left: '5%',
      right: '15%',
      bottom: '15%',
      containLabel: true
    },
    legend: {
      data: ['专利申请数(件)', '专利授权数(件)'],
      bottom:'20'
    },
    calculable: true,
    xAxis: [
      {
        type: 'category',
        data: ['上海市', '江苏省', '浙江省', '安徽省']
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: '专利申请数',
        type: 'bar',
        data: [
          173586, 593878, 435805, 167039
        ],
        markPoint: {
          data: [
            { type: 'max', name: 'Max' },
            { type: 'min', name: 'Min' }
          ]
        },
        markLine: {
          data: [{ type: 'average', name: 'Avg' }]
        }
      },
      {
        name: '专利授权数',
        type: 'bar',
        data: [
          100587, 314153, 285320, 82524
        ],
        markPoint: {
          data: [
            { type: 'max', name: 'Max' },
            { type: 'min', name: 'Min' }
          ]
        },
        markLine: {
          data: [{ type: 'average', name: 'Avg' }]
        }
      }
    ]
  };
  leftChart3.setOption(option);
}
const loadRightChart1 = () => {
  let option;
  option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999'
        }
      }
    },
    grid: {
      top:'5%',
      left: '5%',
      right: '5%',
      bottom: '25%',
      containLabel: true
    },
    color:['#4ac3bf','#4f8cd7','#88eadf','#70b0eb'],
    legend: {
      bottom:"25",
      itemWidth:4,
      textStyle: {
        fontSize: 11,
      },
      data: ['常住人口增量(万人)', 'R&D人员(万人)', '高被引科学家数(人)','普通高校数量(所)','高校毕业生留存率(%)']
    },
    xAxis: [
      {
        type: 'category',
        data: ['上海市', '江苏省', '浙江省', '安徽省'],
        axisPointer: {
          type: 'shadow'
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        min: 0,
        max: 40,
      },
      {
        type: 'value',
        min: 0,
        max: 100,
      }
    ],
    series: [
      {
        name: '常住人口增量(万人)',
        type: 'bar',
        tooltip: {
          valueFormatter: function (value) {
            return value;
          }
        },
        data: [
          5.45,10.12,33.8,12.17
        ]
      },
      {
        name: 'R&D人员(万人)',
        type: 'bar',
        tooltip: {
          valueFormatter: function (value) {
            return value;
          }
        },
        data: [
          27.1223,12.94,9.2898,8.6032
        ]
      },
      {
        name: '高被引科学家数(人)',
        type: 'bar',
        tooltip: {
          valueFormatter: function (value) {
            return value;
          }
        },
        data: [
          40,28,23,16
        ]
      },
      {
        name: '普通高校数量(所)',
        type: 'bar',
        tooltip: {
          valueFormatter: function (value) {
            return value;
          }
        },
        data: [
          64,53,40,50
        ]
      },
      {
        name: '高校毕业生留存率(%)',
        type: 'line',
        yAxisIndex: 1,
        tooltip: {
          valueFormatter: function (value) {
            return value;
          }
        },
        data: [70,50,60,54]
      }
    ]
  };
  rightChart1.setOption(option);
}
const loadRightChart2 = () => {

  let option;

  option = {
    title:{
      text:'长三角创新力城市TOP10',
      top:0,
      left:'center',
      textStyle:{
        fontSize:'14'
      }
    },
    color:'#64afe9',
    grid: {
      top:'8%',
      left: '5%',
      right: '5%',
      bottom: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      axisLabel:{
        show:false
      },
      splitLine:{
        show:false
      }
    },
    yAxis: {
      type: 'category',
      data: ['芜湖市','南通市','常州市','无锡市','宁波市','合肥市','苏州市','南京市', '杭州市','上海市'],
      splitLine:{
        show:false
      }
    },
    series: [
      {
        data: [60,60,63,68,69,79,81,85,93,136],
        type: 'bar',
        label:{
          show:true,
          position:'right',
        }
      }
    ]
  };
  rightChart2.setOption(option)
}
const loadRightChart3 = () => {
  let option;
  option = {
    title: {
      text: '上海市',
      left:'center',
    },
    grid: {
      containLabel: true
    },
    color: ['#67F9D8', '#FFE434', '#56A3F1', '#FF917C'],
    radar: [
      {
        indicator: [
          { text: '工程师' },
          { text: '知识创新'},
          { text: '产业创新' },
          { text: '政府引导'},
          { text: '高新区'},
          { text: '合伙人' },
          { text: '创新热线'},
          { text: '企业成长'},
          { text: '新经济' },
          { text: '新空间' },
        ],
        center: ['50%', '50%'],
        radius: 90,
        startAngle: 90,
        splitNumber: 4,
        shape: 'circle',
        axisName: {
          formatter: '{value}',
          color: '#428BD4'
        },
        splitArea: {
          areaStyle: {
            color: ['#77EADF', '#26C3BE', '#64AFE9', '#428BD4'],
            shadowColor: 'rgba(0, 0, 0, 0.2)',
            shadowBlur: 10
          }
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(211, 253, 250, 0.8)'
          }
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(211, 253, 250, 0.8)'
          }
        }
      }
    ],
    series: [
      {
        type: 'radar',
        emphasis: {
          lineStyle: {
            width: 6,
          }
        },
        lineStyle:{
          width:4,
          color:'#f0a04d'
        },
        data: [
          {
            value: [140, 141, 99,140,232,100,175,83,142,131],
            name: '上海市',
            label:{
              show:true,
              formatter:'{c}'
            }
          },
        ]
      },
    ]
  };
  rightChart3.setOption(option)
}
let radarData = [
  {
    title:'南京市',
    data:[100,97,92,84,85,89,74,80,68,88]
  },
  {
    title:'杭州市',
    data:[90,71,84,86,92,100,100,100,100,100]
  },
  {
    title:'合肥市',
    data:[74,100,73,100,79,90,56,64,79,73]
  }
]
const loadRightChart4 = (chart,title,data) => {
  let option = radarChartOption(title,data);
  chart.setOption(option);
}
const radarChartOption = (title,data) => {
  let option;
  option = {
    title:{
      text:title,
      left:'center',
      top:5,
    },
    color: ['#67F9D8', '#FFE434', '#56A3F1', '#FF917C'],
    radar: [
      {
        indicator: [
          { name: '工程师',max:200},
          { name: '知识创新',max:200},
          { name: '产业创新',max:200},
          { name: '政府引导',max:200},
          { name: '高新区',max:200},
          { name: '合伙人' ,max:200},
          { name: '创新热线',max:200},
          { name: '企业成长',max:200},
          { name: '新经济',max:200},
          { name: '新空间',max:200},
        ],
        center: ['50%', '50%'],
        radius: 75,
        startAngle: 90,
        splitNumber: 4,
        shape: 'circle',
        axisName: {
          show:false,
          formatter: '【{value}】',
          color: '#428BD4'
        },
        splitArea: {
          areaStyle: {
            color: ['#77EADF', '#26C3BE', '#64AFE9', '#428BD4'],
            shadowColor: 'rgba(0, 0, 0, 0.2)',
            shadowBlur: 10
          }
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(211, 253, 250, 0.8)'
          }
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(211, 253, 250, 0.8)'
          }
        }
      },
    ],
    series: [
      {
        type: 'radar',
        symbolSize:3,
        emphasis: {
          lineStyle: {
            width: 4
          }
        },
        lineStyle:{
          width:3,
          color:'#f0a04d'
        },
        data: [
          {
            value: data,
            name: title,
            label:{
              show:true,
              formatter:'{c}',
              fontSize:10
            }
          },
        ]
      },
    ]
  };
  return option;
}
const loadMidChart1 = () => {
  var option;

  const data = [
    { name: '海门', value: 9 },
    { name: '鄂尔多斯', value: 12 },
    { name: '招远', value: 12 },
    { name: '舟山', value: 12 },
    { name: '齐齐哈尔', value: 14 },
    { name: '盐城', value: 15 },
    { name: '赤峰', value: 16 },
    { name: '青岛', value: 18 },
    { name: '乳山', value: 18 },
    { name: '金昌', value: 19 },
    { name: '泉州', value: 21 },
    { name: '莱西', value: 21 },
    { name: '日照', value: 21 },
    { name: '胶南', value: 22 },
    { name: '南通', value: 23 },
    { name: '拉萨', value: 24 },
    { name: '云浮', value: 24 },
    { name: '梅州', value: 25 },
    { name: '文登', value: 25 },
    { name: '上海', value: 25 },
    { name: '攀枝花', value: 25 },
    { name: '威海', value: 25 },
    { name: '承德', value: 25 },
    { name: '厦门', value: 26 },
    { name: '汕尾', value: 26 },
    { name: '潮州', value: 26 },
    { name: '丹东', value: 27 },
    { name: '太仓', value: 27 },
    { name: '曲靖', value: 27 },
    { name: '烟台', value: 28 },
    { name: '福州', value: 29 },
    { name: '瓦房店', value: 30 },
    { name: '即墨', value: 30 },
    { name: '抚顺', value: 31 },
    { name: '玉溪', value: 31 },
    { name: '张家口', value: 31 },
    { name: '阳泉', value: 31 },
    { name: '莱州', value: 32 },
    { name: '湖州', value: 32 },
    { name: '汕头', value: 32 },
    { name: '昆山', value: 33 },
    { name: '宁波', value: 33 },
    { name: '湛江', value: 33 },
    { name: '揭阳', value: 34 },
    { name: '荣成', value: 34 },
    { name: '连云港', value: 35 },
    { name: '葫芦岛', value: 35 },
    { name: '常熟', value: 36 },
    { name: '东莞', value: 36 },
    { name: '河源', value: 36 },
    { name: '淮安', value: 36 },
    { name: '泰州', value: 36 },
    { name: '南宁', value: 37 },
    { name: '营口', value: 37 },
    { name: '惠州', value: 37 },
    { name: '江阴', value: 37 },
    { name: '蓬莱', value: 37 },
    { name: '韶关', value: 38 },
    { name: '嘉峪关', value: 38 },
    { name: '广州', value: 38 },
    { name: '延安', value: 38 },
    { name: '太原', value: 39 },
    { name: '清远', value: 39 },
    { name: '中山', value: 39 },
    { name: '昆明', value: 39 },
    { name: '寿光', value: 40 },
    { name: '盘锦', value: 40 },
    { name: '长治', value: 41 },
    { name: '深圳', value: 41 },
    { name: '珠海', value: 42 },
    { name: '宿迁', value: 43 },
    { name: '咸阳', value: 43 },
    { name: '铜川', value: 44 },
    { name: '平度', value: 44 },
    { name: '佛山', value: 44 },
    { name: '海口', value: 44 },
    { name: '江门', value: 45 },
    { name: '章丘', value: 45 },
    { name: '肇庆', value: 46 },
    { name: '大连', value: 47 },
    { name: '临汾', value: 47 },
    { name: '吴江', value: 47 },
    { name: '石嘴山', value: 49 },
    { name: '沈阳', value: 50 },
    { name: '苏州', value: 50 },
    { name: '茂名', value: 50 },
    { name: '嘉兴', value: 51 },
    { name: '长春', value: 51 },
    { name: '胶州', value: 52 },
    { name: '银川', value: 52 },
    { name: '张家港', value: 52 },
    { name: '三门峡', value: 53 },
    { name: '锦州', value: 54 },
    { name: '南昌', value: 54 },
    { name: '柳州', value: 54 },
    { name: '三亚', value: 54 },
    { name: '自贡', value: 56 },
    { name: '吉林', value: 56 },
    { name: '阳江', value: 57 },
    { name: '泸州', value: 57 },
    { name: '西宁', value: 57 },
    { name: '宜宾', value: 58 },
    { name: '呼和浩特', value: 58 },
    { name: '成都', value: 58 },
    { name: '大同', value: 58 },
    { name: '镇江', value: 59 },
    { name: '桂林', value: 59 },
    { name: '张家界', value: 59 },
    { name: '宜兴', value: 59 },
    { name: '北海', value: 60 },
    { name: '西安', value: 61 },
    { name: '金坛', value: 62 },
    { name: '东营', value: 62 },
    { name: '牡丹江', value: 63 },
    { name: '遵义', value: 63 },
    { name: '绍兴', value: 63 },
    { name: '扬州', value: 64 },
    { name: '常州', value: 64 },
    { name: '潍坊', value: 65 },
    { name: '重庆', value: 66 },
    { name: '台州', value: 67 },
    { name: '南京', value: 67 },
    { name: '滨州', value: 70 },
    { name: '贵阳', value: 71 },
    { name: '无锡', value: 71 },
    { name: '本溪', value: 71 },
    { name: '克拉玛依', value: 72 },
    { name: '渭南', value: 72 },
    { name: '马鞍山', value: 72 },
    { name: '宝鸡', value: 72 },
    { name: '焦作', value: 75 },
    { name: '句容', value: 75 },
    { name: '北京', value: 79 },
    { name: '徐州', value: 79 },
    { name: '衡水', value: 80 },
    { name: '包头', value: 80 },
    { name: '绵阳', value: 80 },
    { name: '乌鲁木齐', value: 84 },
    { name: '枣庄', value: 84 },
    { name: '杭州', value: 84 },
    { name: '淄博', value: 85 },
    { name: '鞍山', value: 86 },
    { name: '溧阳', value: 86 },
    { name: '库尔勒', value: 86 },
    { name: '安阳', value: 90 },
    { name: '开封', value: 90 },
    { name: '济南', value: 92 },
    { name: '德阳', value: 93 },
    { name: '温州', value: 95 },
    { name: '九江', value: 96 },
    { name: '邯郸', value: 98 },
    { name: '临安', value: 99 },
    { name: '兰州', value: 99 },
    { name: '沧州', value: 100 },
    { name: '临沂', value: 103 },
    { name: '南充', value: 104 },
    { name: '天津', value: 105 },
    { name: '富阳', value: 106 },
    { name: '泰安', value: 112 },
    { name: '诸暨', value: 112 },
    { name: '郑州', value: 113 },
    { name: '哈尔滨', value: 114 },
    { name: '聊城', value: 116 },
    { name: '芜湖', value: 117 },
    { name: '唐山', value: 119 },
    { name: '平顶山', value: 119 },
    { name: '邢台', value: 119 },
    { name: '德州', value: 120 },
    { name: '济宁', value: 120 },
    { name: '荆州', value: 127 },
    { name: '宜昌', value: 130 },
    { name: '义乌', value: 132 },
    { name: '丽水', value: 133 },
    { name: '洛阳', value: 134 },
    { name: '秦皇岛', value: 136 },
    { name: '株洲', value: 143 },
    { name: '石家庄', value: 147 },
    { name: '莱芜', value: 148 },
    { name: '常德', value: 152 },
    { name: '保定', value: 153 },
    { name: '湘潭', value: 154 },
    { name: '金华', value: 157 },
    { name: '岳阳', value: 169 },
    { name: '长沙', value: 175 },
    { name: '衢州', value: 177 },
    { name: '廊坊', value: 193 },
    { name: '菏泽', value: 194 },
    { name: '合肥', value: 229 },
    { name: '武汉', value: 273 },
    { name: '大庆', value: 279 }
  ];
  const geoCoordMap = {
    海门: [121.15, 31.89],
    鄂尔多斯: [109.781327, 39.608266],
    招远: [120.38, 37.35],
    舟山: [122.207216, 29.985295],
    齐齐哈尔: [123.97, 47.33],
    盐城: [120.13, 33.38],
    赤峰: [118.87, 42.28],
    青岛: [120.33, 36.07],
    乳山: [121.52, 36.89],
    金昌: [102.188043, 38.520089],
    泉州: [118.58, 24.93],
    莱西: [120.53, 36.86],
    日照: [119.46, 35.42],
    胶南: [119.97, 35.88],
    南通: [121.05, 32.08],
    拉萨: [91.11, 29.97],
    云浮: [112.02, 22.93],
    梅州: [116.1, 24.55],
    文登: [122.05, 37.2],
    上海: [121.48, 31.22],
    攀枝花: [101.718637, 26.582347],
    威海: [122.1, 37.5],
    承德: [117.93, 40.97],
    厦门: [118.1, 24.46],
    汕尾: [115.375279, 22.786211],
    潮州: [116.63, 23.68],
    丹东: [124.37, 40.13],
    太仓: [121.1, 31.45],
    曲靖: [103.79, 25.51],
    烟台: [121.39, 37.52],
    福州: [119.3, 26.08],
    瓦房店: [121.979603, 39.627114],
    即墨: [120.45, 36.38],
    抚顺: [123.97, 41.97],
    玉溪: [102.52, 24.35],
    张家口: [114.87, 40.82],
    阳泉: [113.57, 37.85],
    莱州: [119.942327, 37.177017],
    湖州: [120.1, 30.86],
    汕头: [116.69, 23.39],
    昆山: [120.95, 31.39],
    宁波: [121.56, 29.86],
    湛江: [110.359377, 21.270708],
    揭阳: [116.35, 23.55],
    荣成: [122.41, 37.16],
    连云港: [119.16, 34.59],
    葫芦岛: [120.836932, 40.711052],
    常熟: [120.74, 31.64],
    东莞: [113.75, 23.04],
    河源: [114.68, 23.73],
    淮安: [119.15, 33.5],
    泰州: [119.9, 32.49],
    南宁: [108.33, 22.84],
    营口: [122.18, 40.65],
    惠州: [114.4, 23.09],
    江阴: [120.26, 31.91],
    蓬莱: [120.75, 37.8],
    韶关: [113.62, 24.84],
    嘉峪关: [98.289152, 39.77313],
    广州: [113.23, 23.16],
    延安: [109.47, 36.6],
    太原: [112.53, 37.87],
    清远: [113.01, 23.7],
    中山: [113.38, 22.52],
    昆明: [102.73, 25.04],
    寿光: [118.73, 36.86],
    盘锦: [122.070714, 41.119997],
    长治: [113.08, 36.18],
    深圳: [114.07, 22.62],
    珠海: [113.52, 22.3],
    宿迁: [118.3, 33.96],
    咸阳: [108.72, 34.36],
    铜川: [109.11, 35.09],
    平度: [119.97, 36.77],
    佛山: [113.11, 23.05],
    海口: [110.35, 20.02],
    江门: [113.06, 22.61],
    章丘: [117.53, 36.72],
    肇庆: [112.44, 23.05],
    大连: [121.62, 38.92],
    临汾: [111.5, 36.08],
    吴江: [120.63, 31.16],
    石嘴山: [106.39, 39.04],
    沈阳: [123.38, 41.8],
    苏州: [120.62, 31.32],
    茂名: [110.88, 21.68],
    嘉兴: [120.76, 30.77],
    长春: [125.35, 43.88],
    胶州: [120.03336, 36.264622],
    银川: [106.27, 38.47],
    张家港: [120.555821, 31.875428],
    三门峡: [111.19, 34.76],
    锦州: [121.15, 41.13],
    南昌: [115.89, 28.68],
    柳州: [109.4, 24.33],
    三亚: [109.511909, 18.252847],
    自贡: [104.778442, 29.33903],
    吉林: [126.57, 43.87],
    阳江: [111.95, 21.85],
    泸州: [105.39, 28.91],
    西宁: [101.74, 36.56],
    宜宾: [104.56, 29.77],
    呼和浩特: [111.65, 40.82],
    成都: [104.06, 30.67],
    大同: [113.3, 40.12],
    镇江: [119.44, 32.2],
    桂林: [110.28, 25.29],
    张家界: [110.479191, 29.117096],
    宜兴: [119.82, 31.36],
    北海: [109.12, 21.49],
    西安: [108.95, 34.27],
    金坛: [119.56, 31.74],
    东营: [118.49, 37.46],
    牡丹江: [129.58, 44.6],
    遵义: [106.9, 27.7],
    绍兴: [120.58, 30.01],
    扬州: [119.42, 32.39],
    常州: [119.95, 31.79],
    潍坊: [119.1, 36.62],
    重庆: [106.54, 29.59],
    台州: [121.420757, 28.656386],
    南京: [118.78, 32.04],
    滨州: [118.03, 37.36],
    贵阳: [106.71, 26.57],
    无锡: [120.29, 31.59],
    本溪: [123.73, 41.3],
    克拉玛依: [84.77, 45.59],
    渭南: [109.5, 34.52],
    马鞍山: [118.48, 31.56],
    宝鸡: [107.15, 34.38],
    焦作: [113.21, 35.24],
    句容: [119.16, 31.95],
    北京: [116.46, 39.92],
    徐州: [117.2, 34.26],
    衡水: [115.72, 37.72],
    包头: [110, 40.58],
    绵阳: [104.73, 31.48],
    乌鲁木齐: [87.68, 43.77],
    枣庄: [117.57, 34.86],
    杭州: [120.19, 30.26],
    淄博: [118.05, 36.78],
    鞍山: [122.85, 41.12],
    溧阳: [119.48, 31.43],
    库尔勒: [86.06, 41.68],
    安阳: [114.35, 36.1],
    开封: [114.35, 34.79],
    济南: [117, 36.65],
    德阳: [104.37, 31.13],
    温州: [120.65, 28.01],
    九江: [115.97, 29.71],
    邯郸: [114.47, 36.6],
    临安: [119.72, 30.23],
    兰州: [103.73, 36.03],
    沧州: [116.83, 38.33],
    临沂: [118.35, 35.05],
    南充: [106.110698, 30.837793],
    天津: [117.2, 39.13],
    富阳: [119.95, 30.07],
    泰安: [117.13, 36.18],
    诸暨: [120.23, 29.71],
    郑州: [113.65, 34.76],
    哈尔滨: [126.63, 45.75],
    聊城: [115.97, 36.45],
    芜湖: [118.38, 31.33],
    唐山: [118.02, 39.63],
    平顶山: [113.29, 33.75],
    邢台: [114.48, 37.05],
    德州: [116.29, 37.45],
    济宁: [116.59, 35.38],
    荆州: [112.239741, 30.335165],
    宜昌: [111.3, 30.7],
    义乌: [120.06, 29.32],
    丽水: [119.92, 28.45],
    洛阳: [112.44, 34.7],
    秦皇岛: [119.57, 39.95],
    株洲: [113.16, 27.83],
    石家庄: [114.48, 38.03],
    莱芜: [117.67, 36.19],
    常德: [111.69, 29.05],
    保定: [115.48, 38.85],
    湘潭: [112.91, 27.87],
    金华: [119.64, 29.12],
    岳阳: [113.09, 29.37],
    长沙: [113, 28.21],
    衢州: [118.88, 28.97],
    廊坊: [116.7, 39.53],
    菏泽: [115.480656, 35.23375],
    合肥: [117.27, 31.86],
    武汉: [114.31, 30.52],
    大庆: [125.03, 46.58]
  };
  const convertData = function (data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
      var geoCoord = geoCoordMap[data[i].name];
      if (geoCoord) {
        res.push({
          name: data[i].name,
          value: geoCoord.concat(data[i].value)
        });
      }
    }
    return res;
  };
  option = {
    tooltip: {
      trigger: 'item'
    },
    bmap: {
      center: [104.114129, 37.550339],
      zoom: 4,
      roam: true,
      mapStyle: {
        styleJson: [
          {
            featureType: 'water',
            elementType: 'all',
            stylers: {
              color: '#d1d1d1'
            }
          },
          {
            featureType: 'land',
            elementType: 'all',
            stylers: {
              color: '#f3f3f3'
            }
          },
          {
            featureType: 'railway',
            elementType: 'all',
            stylers: {
              visibility: 'off'
            }
          },
          {
            featureType: 'highway',
            elementType: 'all',
            stylers: {
              color: '#fdfdfd'
            }
          },
          {
            featureType: 'highway',
            elementType: 'labels',
            stylers: {
              visibility: 'off'
            }
          },
          {
            featureType: 'arterial',
            elementType: 'geometry',
            stylers: {
              color: '#fefefe'
            }
          },
          {
            featureType: 'arterial',
            elementType: 'geometry.fill',
            stylers: {
              color: '#fefefe'
            }
          },
          {
            featureType: 'poi',
            elementType: 'all',
            stylers: {
              visibility: 'off'
            }
          },
          {
            featureType: 'green',
            elementType: 'all',
            stylers: {
              visibility: 'off'
            }
          },
          {
            featureType: 'subway',
            elementType: 'all',
            stylers: {
              visibility: 'off'
            }
          },
          {
            featureType: 'manmade',
            elementType: 'all',
            stylers: {
              color: '#d1d1d1'
            }
          },
          {
            featureType: 'local',
            elementType: 'all',
            stylers: {
              color: '#d1d1d1'
            }
          },
          {
            featureType: 'arterial',
            elementType: 'labels',
            stylers: {
              visibility: 'off'
            }
          },
          {
            featureType: 'boundary',
            elementType: 'all',
            stylers: {
              color: '#fefefe'
            }
          },
          {
            featureType: 'building',
            elementType: 'all',
            stylers: {
              color: '#d1d1d1'
            }
          },
          {
            featureType: 'label',
            elementType: 'labels.text.fill',
            stylers: {
              color: '#999999'
            }
          }
        ]
      }
    },
    series: [
      {
        name: 'pm2.5',
        type: 'scatter',
        coordinateSystem: 'bmap',
        data: convertData(data),
        symbolSize: function (val) {
          return val[2] / 10;
        },
        encode: {
          value: 2
        },
        label: {
          formatter: '{b}',
          position: 'right',
          show: false
        },
        emphasis: {
          label: {
            show: true
          }
        }
      },
      {
        name: 'Top 5',
        type: 'effectScatter',
        coordinateSystem: 'bmap',
        data: convertData(
            data
                .sort(function (a, b) {
                  return b.value - a.value;
                })
                .slice(0, 6)
        ),
        symbolSize: function (val) {
          return val[2] / 10;
        },
        encode: {
          value: 2
        },
        showEffectOn: 'render',
        rippleEffect: {
          brushType: 'stroke'
        },
        label: {
          formatter: '{b}',
          position: 'right',
          show: true
        },
        itemStyle: {
          shadowBlur: 10,
          shadowColor: '#333'
        },
        emphasis: {
          scale: true
        },
        zlevel: 1
      }
    ]
  };
  midChart1.setOption(option)
}
const loadMidChart2 = () => {

  let option;

  const pathSymbols = {
    reindeer:
        'path://M-22.788,24.521c2.08-0.986,3.611-3.905,4.984-5.892 c-2.686,2.782-5.047,5.884-9.102,7.312c-0.992,0.005-0.25-2.016,0.34-2.362l1.852-0.41c0.564-0.218,0.785-0.842,0.902-1.347 c2.133-0.727,4.91-4.129,6.031-6.194c1.748-0.7,4.443-0.679,5.734-2.293c1.176-1.468,0.393-3.992,1.215-6.557 c0.24-0.754,0.574-1.581,1.008-2.293c-0.611,0.011-1.348-0.061-1.959-0.608c-1.391-1.245-0.785-2.086-1.297-3.313 c1.684,0.744,2.5,2.584,4.426,2.586C-8.46,3.012-8.255,2.901-8.04,2.824c6.031-1.952,15.182-0.165,19.498-3.937 c1.15-3.933-1.24-9.846-1.229-9.938c0.008-0.062-1.314-0.004-1.803-0.258c-1.119-0.771-6.531-3.75-0.17-3.33 c0.314-0.045,0.943,0.259,1.439,0.435c-0.289-1.694-0.92-0.144-3.311-1.946c0,0-1.1-0.855-1.764-1.98 c-0.836-1.09-2.01-2.825-2.992-4.031c-1.523-2.476,1.367,0.709,1.816,1.108c1.768,1.704,1.844,3.281,3.232,3.983 c0.195,0.203,1.453,0.164,0.926-0.468c-0.525-0.632-1.367-1.278-1.775-2.341c-0.293-0.703-1.311-2.326-1.566-2.711 c-0.256-0.384-0.959-1.718-1.67-2.351c-1.047-1.187-0.268-0.902,0.521-0.07c0.789,0.834,1.537,1.821,1.672,2.023 c0.135,0.203,1.584,2.521,1.725,2.387c0.102-0.259-0.035-0.428-0.158-0.852c-0.125-0.423-0.912-2.032-0.961-2.083 c-0.357-0.852-0.566-1.908-0.598-3.333c0.4-2.375,0.648-2.486,0.549-0.705c0.014,1.143,0.031,2.215,0.602,3.247 c0.807,1.496,1.764,4.064,1.836,4.474c0.561,3.176,2.904,1.749,2.281-0.126c-0.068-0.446-0.109-2.014-0.287-2.862 c-0.18-0.849-0.219-1.688-0.113-3.056c0.066-1.389,0.232-2.055,0.277-2.299c0.285-1.023,0.4-1.088,0.408,0.135 c-0.059,0.399-0.131,1.687-0.125,2.655c0.064,0.642-0.043,1.768,0.172,2.486c0.654,1.928-0.027,3.496,1,3.514 c1.805-0.424,2.428-1.218,2.428-2.346c-0.086-0.704-0.121-0.843-0.031-1.193c0.221-0.568,0.359-0.67,0.312-0.076 c-0.055,0.287,0.031,0.533,0.082,0.794c0.264,1.197,0.912,0.114,1.283-0.782c0.15-0.238,0.539-2.154,0.545-2.522 c-0.023-0.617,0.285-0.645,0.309,0.01c0.064,0.422-0.248,2.646-0.205,2.334c-0.338,1.24-1.105,3.402-3.379,4.712 c-0.389,0.12-1.186,1.286-3.328,2.178c0,0,1.729,0.321,3.156,0.246c1.102-0.19,3.707-0.027,4.654,0.269 c1.752,0.494,1.531-0.053,4.084,0.164c2.26-0.4,2.154,2.391-1.496,3.68c-2.549,1.405-3.107,1.475-2.293,2.984 c3.484,7.906,2.865,13.183,2.193,16.466c2.41,0.271,5.732-0.62,7.301,0.725c0.506,0.333,0.648,1.866-0.457,2.86 c-4.105,2.745-9.283,7.022-13.904,7.662c-0.977-0.194,0.156-2.025,0.803-2.247l1.898-0.03c0.596-0.101,0.936-0.669,1.152-1.139 c3.16-0.404,5.045-3.775,8.246-4.818c-4.035-0.718-9.588,3.981-12.162,1.051c-5.043,1.423-11.449,1.84-15.895,1.111 c-3.105,2.687-7.934,4.021-12.115,5.866c-3.271,3.511-5.188,8.086-9.967,10.414c-0.986,0.119-0.48-1.974,0.066-2.385l1.795-0.618 C-22.995,25.682-22.849,25.035-22.788,24.521z',
  };
  const labelSetting = {
    show: true,
    position: 'right',
    offset: [10, 0],
    fontSize: 16
  };
  option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      right:60,
      top:0,
      bottom:20,
      containLabel: true,
      left: 20
    },
    yAxis: {
      data: ['上海市', '江苏省', '浙江省', '安徽省'],
      inverse: true,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        margin: 30,
        fontSize: 14
      },
      axisPointer: {
        label: {
          show: true,
          margin: 30
        }
      }
    },
    xAxis: {
      splitLine: { show: false },
      axisLabel: { show: false },
      axisTick: { show: false },
      axisLine: { show: false }
    },
    series: [
      {
        name: '瞪羚企业数',
        type: 'pictorialBar',
        label: labelSetting,
        symbolRepeat: true,
        symbolSize: ['80%', '80%'],
        barCategoryGap: '1%',
        data: [
          {
            value: 1723,
            symbol: pathSymbols.reindeer
          },
          {
            value: 3180,
            symbol: pathSymbols.reindeer
          },
          {
            value: 2161,
            symbol: pathSymbols.reindeer
          },
          {
            value: 669,
            symbol: pathSymbols.reindeer
          },
        ]
      },
    ]
  };
  midChart2.setOption(option);
}
const loadMidChart3 = () => {
  let option;
  option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      right:60,
      top:0,
      bottom:20,
      containLabel: true,
      left: 20
    },
    xAxis: {
      splitLine: { show: false },
      axisLine: { show: false },
      axisLabel: { show: false },
    },
    yAxis: {
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        margin: 30,
        fontSize: 14
      },
      axisPointer: {
        label: {
          show: true,
          margin: 30
        }
      },
      data: ['安徽省','浙江省','江苏省','上海市' ]
    },
    animationEasing: 'elasticOut',
    series: [
      {
        type: 'pictorialBar',
        symbol: 'circle',
        label:{
          show: true,
          position: 'inside',
          offset: [0, 0],
          fontSize: 16,
          color:'white'
        },
        data: [
          {
            value: 1,
            symbolRepeat: false,
            symbolSize: [40, 40]
          },{
            value: 27,
            symbolRepeat: false,
            symbolSize: [40, 40]
          },{
            value: 19,
            symbolRepeat: false,
            symbolSize: [40, 40]
          },{
            value: 44,
            symbolRepeat: false,
            symbolSize: [40, 40]
          },
        ]
      }
    ]
  };
  midChart3.setOption(option)
}
</script>

<style scoped>
.box-title{
  height:30px;
}
.box-title-text{
  margin: 0px 10px;
}
.box-left{

}
.box-mid{
  width: 100%;
  display: flex;
  justify-content: center;
}
.right1{
  height: 28vh;
}
.right2{
  height: 60vh;
}
.mid1{

}
.mid3{
  height: 55vh;
}
.mid4{
  height: 25vh;
}
.left1{
  height: 29vh;
}
.left2{
  height: 30vh;
}
.left3{
  height: 30vh;
}
.chart{
  width: 100%;
  height: 95%;
  padding: 0;
}
</style>
