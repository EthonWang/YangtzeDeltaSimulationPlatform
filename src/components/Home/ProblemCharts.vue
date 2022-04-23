<template>
  <div>
    <div
      ref="earthchart"
      style="
        width: 100%;
        height: 100%;
        transform: perspective(1200px) rotateY(-30deg);
      "
    ></div>
  </div>
</template>

<script setup>
import { reactive, computed, ref, onMounted, defineEmits } from "vue";
import * as echarts from "echarts";
import { sciencePro } from "@/assets/data/home/sciencePro.js";
// import 'echarts-gl';

const emit = defineEmits(["sendProblem"]);
const earthchart = ref();

const sendProblemToFather = (name) => {
  emit("sendProblem", name);
};

onMounted(() => {
  init();
});
function init() {
  console.log(12589);
  // 基于准备好的dom，初始化echarts实例
  const myChart = echarts.init(earthchart.value);
  // 指定图表的配置项和数据
  const colors = [
    "hsl(0,100%,55%)",
    "hsl(10,80%,55%)",
    "hsl(50,100%,55%)",
    "hsl(30,100%,60%)",
    "hsl(40,80%,55%)",
  ];
  const bgColor = "hsla(238,65%,8%,0)";
  const itemStyle = {
    star5: {
      color: colors[0],
    },
    star4: {
      color: colors[1],
    },
    star3: {
      color: colors[2],
    },
    star2: {
      color: colors[3],
    },
  };
  let option;
  const data = sciencePro;

  for (let j = 0; j < data.length; ++j) {
    let level1 = data[j].children;
    for (let i = 0; i < level1.length; ++i) {
      let block = level1[i].children;
      let bookScore = [];
      let bookScoreId;
      for (let star = 0; star < block.length; ++star) {
        let style = (function (name) {
          switch (name) {
            case "5☆":
              bookScoreId = 0;
              return itemStyle.star5;
            case "4☆":
              bookScoreId = 1;
              return itemStyle.star4;
            case "3☆":
              bookScoreId = 2;
              return itemStyle.star3;
            case "2☆":
              bookScoreId = 3;
              return itemStyle.star2;
          }
        })(block[star].name);
        block[star].label = {
          color: style.color,
          downplay: {
            opacity: 1,
          },
        };
        if (block[star].children) {
          style = {
            opacity: 1,
            color: style.color,
          };
          block[star].children.forEach(function (book) {
            book.value = 1;
            book.itemStyle = style;
            book.label = {
              color: style.color,
              fontSize: "23px",
              fontWeight: 500,
            };
            let value = 1;
            if (bookScoreId === 0 || bookScoreId === 3) {
              value = 5;
            }
            if (bookScore[bookScoreId]) {
              bookScore[bookScoreId].value += value;
            } else {
              bookScore[bookScoreId] = {
                color: colors[bookScoreId],
                value: value,
              };
            }
          });
        }
      }
      level1[i].itemStyle = {
        color: data[j].itemStyle.color,
      };
    }
  }
  option = {
    backgroundColor: bgColor,
    color: colors,
    series: [
      {
        type: "sunburst",
        center: ["50%", "48%"],
        data: data,
        sort: function (a, b) {
          if (a.depth === 1) {
            return b.getValue() - a.getValue();
          } else {
            return a.dataIndex - b.dataIndex;
          }
        },
        label: {
          rotate: "radial",
          color: "white",
          fontSize: "23px",
          // formatter:(val)=>{
          //   while(val.length>5){

          //   }
          // }
        },
        itemStyle: {
          borderColor: bgColor,
          borderWidth: 2,
        },
        levels: [
          {},
          {
            r0: 0,
            r: 40,
            label: {
              rotate: 0,
            },
          },
          {
            r0: 43,
            r: 230,
          },
          {
            r0: 230,
            r: 255,
            itemStyle: {
              shadowBlur: 2,
              shadowColor: colors[2],
              color: "transparent",
            },
            label: {
              rotate: "tangential",
              fontSize: "14px",
              color: colors[0],
            },
          },
          {
            r0: 255,
            r: 280,
            itemStyle: {
              shadowBlur: 80,
              shadowColor: colors[0],
            },
            label: {
              position: "outside",
              textShadowBlur: 5,
              textShadowColor: "#333",
            },
            downplay: {
              label: {
                opacity: 0.9,
              },
            },
          },
        ],
      },
    ],
  };

  option && myChart.setOption(option);
  myChart.on("click", (params) => {
    console.log(params);
    if (params.name == "" || params.value != 1) {
      return;
    }
    sendProblemToFather(params.name);
  });
  // earthchart.value.addEventListener('click', (params)=> {
  // 	console.log(params);
  // })
}
</script>

<style lang="less" scoped>
</style>