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
    "hsl(221, 100%, 25%)",
    "hsl(191, 100%, 75%)",
    "hsl(201, 100%, 75%)",
    "hsl(211, 100%, 75%)",
    "hsl(181, 100%, 75%)",
  ];
  const bgColor = "hsla(238,65%,8%,0)";
  const itemStyle = {
    star5: {
      color: "hsl(191, 100%, 75%)",
    },
    star4: {
      color: "hsl(191, 100%, 75%)",
    },

  };
  let option;
  const data = sciencePro;

  for (let j = 0; j < data.length; ++j) {
    let level1 = data[j].children; //第二层，到底了
    for (let i = 0; i < level1.length; ++i) {
      let block = level1;
      let bookScore = [];
      let bookScoreId;

      let style = (function (it) {
        //自定义一个临时函数
        switch (it%2) {
          case 0:
            bookScoreId = 0;
            return itemStyle.star4;
          case 1:
            bookScoreId = 1;
            return itemStyle.star5;
        }
      })(i); //使用临时函数
      block[i].label = {
        color: style.color,
        downplay: {
          opacity: 1,
        },
      };
      if (block) {
        style = {
          opacity: 1,
          color: style.color,
        };
        block.forEach(function (book) {
          book.value = 1;
          book.itemStyle = style;
          book.label = {
            color: "black",
            // color: "#fafafa",
            textShadow:
              "-1px 1px 0 #000, 1px 1px 0 #000, 1px -1px 0 #000,-1px -1px 0 #000",
            fontSize: "1.56rem",
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

      level1[i].itemStyle = {
        color: colors[0],
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
          color: "black",
          fontSize: "1.437rem",
          // formatter:(val)=>{
          //   while(val.length>5){

          //   }
          // }
        },
        itemStyle: {
          borderColor: "hsla(204,100%,90%,0.5)",
          borderWidth: 2,
        },
        levels: [
          {},

          {
            r0: 20,
            r: 180,
          },

          {
            r0: 230,
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
    console.log(params);

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
@randomNum: 0;
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