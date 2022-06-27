<template>
  <div class="about">
    <div style="height: 100%; width: 100%;">
      <!-- <span class="demonstration"
        >Switch when indicator is hovered (default)</span
      > -->
      <el-carousel height="60vh">
        <el-carousel-item style="height: 100%;">
          <div class="over-item" v-for="config in configs" :key="config">
            <div style="margin: 2%; width: 100%"></div>
            <h3>{{ config.tittle }}：{{ config.all }}</h3>
            <div class="des" v-if="!config.edit_des">{{ config.des }}</div>
            <div class="des" v-if="config.edit_des">
              <el-input
                v-model="config.des"
                autosize
                type="textarea"
                placeholder="Please input"
              />
            </div>
            <br />
            <div>
              <span
                ><el-icon><Aim /></el-icon> 灾害响应与治理：{{
                  config.q1
                }}</span
              >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span
                ><el-icon><TrendCharts /></el-icon> 全球变化与区域环境演化：{{
                  config.q2
                }}</span
              >&nbsp;&nbsp;<br />
              <span
                ><el-icon><Sunset /></el-icon> 流域水循环及驱动机制：{{
                  config.q3
                }}</span
              >&nbsp;&nbsp;&nbsp;&nbsp;
              <span
                ><el-icon><School /></el-icon> 城市化与人地关系协调发展：{{
                  config.q4
                }}</span
              >
            </div>
            <el-button
              style="
                position: absolute;
                right: 0;
                bottom: 70%;
                background: hsl(0, 0%, 95%);
              "
              v-if="!config.edit_des"
              @click="config.edit_des = !config.edit_des"
              ><el-icon><EditPen /></el-icon>&nbsp;描述</el-button
            >
            <el-button
              style="
                position: absolute;
                right: 0;
                bottom: 70%;
                background: hsl(120, 80%, 45%);
                color: white;
              "
              v-if="config.edit_des"
              @click="config.edit_des = !config.edit_des"
              ><el-icon><EditPen /></el-icon>&nbsp;完成</el-button
            >
            <svg
              width="15%"
              height="30"
              style="position: absolute; right: 0%; bottom: 30%"
            >
              <defs>
                <linearGradient
                  id="gradient-385534153"
                  x1="0"
                  x2="0"
                  y1="1"
                  y2="0"
                >
                  <stop offset="0%"></stop>
                  <stop offset="10%"></stop>
                  <stop offset="25%"></stop>
                  <stop offset="50%"></stop>
                </linearGradient>
                <mask
                  id="sparkline-385534153"
                  x="0"
                  y="0"
                  width="155"
                  height="28"
                >
                  <polyline
                    transform="translate(0, 28) scale(1,-1)"
                    points="0,2.2199999999999998 3,2.2199999999999998 6,2.2199999999999998 9,4.65 12,24.74 15,29.0 18,15.61 21,18.65 24,4.04 27,1.0 30,1.0 33,1.0 36,1.0 39,1.0 42,1.0 45,1.0 48,1.0 51,1.0 54,1.0 57,1.0 60,1.0 63,1.0 66,1.0 69,1.0 72,1.0 75,1.0 78,1.0 81,1.0 84,1.0 87,1.0 90,1.0 93,1.0 96,1.0 99,1.0 102,1.0 105,1.0 108,1.0 111,1.0 114,1.0 117,1.0 120,1.0 123,1.0 126,1.0 129,1.0 132,1.0 135,1.0 138,1.0 141,1.0 144,1.0 147,1.0 150,1.0 153,1.0 "
                    fill="transparent"
                    stroke="#8cc665"
                    stroke-width="2"
                  ></polyline>
                </mask>
              </defs>
              <g transform="translate(0, 2.0)">
                <rect
                  x="0"
                  y="-2"
                  width="155"
                  height="30"
                  style="
                    stroke: none;
                    fill: url(#gradient-385534153);
                    mask: url(#sparkline-385534153);
                  "
                ></rect>
              </g>
            </svg>
            <div style="margin: 3%; width: 100%"></div>
            <el-divider></el-divider>
          </div>
        </el-carousel-item>
        <!-- <el-carousel-item
          style="height: 100%"
          v-for="item in props.picture"
          :key="item"
        >
          <el-image
            style="height: 100%; width: 100%"
            :src="item"
            :fit="fill"
            alt=""
          />
        </el-carousel-item> -->
      </el-carousel>
    </div>
  </div>
</template>

<script setup>
//采用vue2写法的话把setup去掉，
import { reactive, computed, ref, defineProps } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
const router = useRouter(); //路由直接用router.push(...)
const store = useStore(); //vuex直接用store.commit
const props = defineProps({
  picture: [],
});
const fill = ref("fill");

const edit_des = ref(false);
const configs = reactive([
  {
    tittle: "数据总量",
    des: "您在各个科学问题的研究中储存的数据",
    edit_des: false,
    all: 0,
    q1: 0,
    q2: 0,
    q3: 0,
    q4: 0,
  },
  {
    tittle: "模型总量",
    des: "您在各个科学问题的研究中储存与收藏的模型",
    edit_des: false,
    all: 0,
    q1: 0,
    q2: 0,
    q3: 0,
    q4: 0,
  },
  {
    tittle: "任务总量",
    des: "您在各个科学问题的研究中执行的任务",
    edit_des: false,
    all: 0,
    q1: 0,
    q2: 0,
    q3: 0,
    q4: 0,
  },
]);
</script>

<style lang="less" scoped>
// 兼容css
.demonstration {
  color: var(--el-text-color-secondary);
}
.over-item {
  margin-left: 7.5%;
  position: relative;
  width: calc(90% - $margin-left);
  height: fit-content;
  line-height: 120%;
  text-align: left !important;
  float: left !important;
  .des {
    color: rgb(58, 58, 58);
    width: 50%;
  }
  h3 {
    color: #0969da;
    font-weight: 500;
    margin:2% 0 2% 0 ;
  }
  span {
    color: rgb(105, 105, 105);
    justify-items: center;
    vertical-align: middle;
  }
}



</style>

