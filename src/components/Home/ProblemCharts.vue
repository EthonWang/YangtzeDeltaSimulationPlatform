<template>
  <div>
    <div ref="earthchart" class="img1" style="width: 100%; height: 100%"></div>
  </div>
</template>

<script setup>
import { reactive, computed, ref, onMounted, defineEmits } from "vue";
import * as echarts from "echarts";
import { sciencePro } from "@/assets/data/home/sciencePro.js";
// import 'echarts-gl';

const emit = defineEmits(["sendProblem"]);
const earthchart = ref();

const sendProblemToFather = (name, path, des) => {
  emit("sendProblem", name, path, des);
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
    "hsl(221, 60%, 67%)",
    "hsl(191, 60%, 67%)",
    "hsl(201, 60%, 67%)",
    "hsl(211, 60%, 67%)",
    "hsl(181, 60%, 67%)",
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
              // color: "#fafafa",
              textShadow:
                "-1px 1px 0 #000, 1px 1px 0 #000, 1px -1px 0 #000,-1px -1px 0 #000",
              fontSize: "25px",
              fontWeight: 700,
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
          borderColor: "hsla(14,100%,80%,0.5)",
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
            r: 220,
          },
          {
            r0: 180,
            r: 181,
            itemStyle: {
              shadowBlur: 10,
              shadowColor: colors[2],
              color: "transparent",
              opacity:0
            },
            label: {
              rotate: "tangential",
              fontSize: "0px",
              color: colors[0],
              opacity:0
            },
          },
          {
            r0: 235,
            r: 250,
            itemStyle: {
              shadowBlur: 10,
              shadowColor: "hsla(215,100%,95%,0.2)",
            },
            label: {
              position: "outside",
              textShadowBlur: 15,
              textShadowColor: "hsla(215,100%,95%,0.8)",
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
        console.log(params)

    if (params.name == "" || params.value != 1) {
      return;
    }
    sendProblemToFather(params.name, params.data.path, params.data.description);
  });
  // earthchart.value.addEventListener('click', (params)=> {
  // 	console.log(params);
  // })
}
</script>

<style lang="less" scoped>
// @randomNum: `Math.ceil(Math.random() * 30) -15`;
@randomNum:0;
.randMove() {
  animation: floating calc((abs(@randomNum / 2) + 20) * 1s) ease-in-out infinite
    alternate;
  @keyframes floating {
    0% {
      transform: translate(0px, 0px);
    }
    25% {
      transform: translate(-@randomNum*1px, @randomNum*1px);
    }
    50% {
      transform: translate(-@randomNum*1px, -@randomNum*1px);
    }
    75% {
      transform: translate(@randomNum*1px, @randomNum*1px);
    }
    100% {
      transform: translate(@randomNum*1px, -@randomNum*1px);
    }
  }
}
.img1 {
  .randMove();
}

</style>