<template>
  <div class="watershedPage" >
    <template v-for="(item, key) in themeCase" :key="key">
      <div class="caseCard">
        <div class="caseImageWrap">
          <el-image
              class="caseImage"
              @click="toCase(item.path)"
              :src="baseUrl + item.thumbnail"
              fit="fill"
          ></el-image>
          <div class="imageMask">
            <img :src="mdOpenIcon" class="caseIcon" />
            <span>打开案例</span>
          </div>
        </div>
        <div class="cardText">
          <el-tooltip
              effect="dark"
              placement="bottom"
              content="查看案例详情"
          >
            <h4
                class="font-size-1"
                style="cursor: pointer"
                @click="toCase(item.path)"
            >
              {{ item.name }}
            </h4>
          </el-tooltip>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
//采用vue2写法的话把setup去掉，
import { reactive, computed, ref, defineProps,defineEmits,watch } from "vue";
import {useRouter} from "vue-router";
import {useStore} from "vuex";
const router=useRouter()//路由直接用router.push(...)
const store=useStore()//vuex直接用store.commit
const baseUrl = store.state.devBackIp;
const mdOpenIcon = require("@/assets/img/icon/md-open.png");

const themeCase = ref([])
themeCase.value = [
  {
    "path": "watershedFlood",
    "thumbnail": "/store/themeImg/ljz.62e4fb53a5c5c216ecbe027f.png",
    "name": "小流域山洪灾害在线模拟",
    "id": "62e4fb54443cd8773cd0f72b"
  },
  {
    "path": "RainForecast",
    "thumbnail": "/store/themeImg/长三角rainforest.62e4f9aca5c5c216ecbe01d9.png",
    "name": "长三角降雨预报专题",
    "id": "62e4f9ae443cd8773cd0f722"
  },
  {
    "path": "SUFS",
    "thumbnail": "/store/themeImg/QQ截图20220902211000.631200c6c8a49e6b82ce5191.png",
    "name": "南京城市内涝模拟",
    "id": "62ee22e7abf46a637a825eab"
  },
]
const toCase = (path) => {
  router.push("/case/" + path + "/");
};
</script>

<style lang="less" scoped>
// 兼容css
.watershedPage{
  width: 100vw;
  height: 92.54vh;
  display: flex;
  justify-content: space-around;

  align-items: center;
  background-color: #80D0C7;
  background-image: linear-gradient(180deg, #80D0C7 0%, #295563 86%);
}
@imageHeight: 350px;
@imageWidth: 560px;
.caseImageWrap {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  position: relative;

  height: @imageHeight;
  width: @imageWidth;
  cursor: pointer;
}

.caseImage {
  height: @imageHeight;
  width: @imageWidth;
  border-bottom: 1px solid lightgray;
}

.imageMask {
  height: @imageHeight;
  width: @imageWidth;
  opacity: 0;
  position: absolute;
  top: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  color: hsl(0, 0%, 98%);
  pointer-events: none;
  transition: opacity 200ms linear;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
}

.caseImageWrap:hover .imageMask {
  opacity: 1;
}

.caseIcon {
  width: 1em;
}

.font-size-1 {
  line-height: 1.5;
  font-size: 1.2rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.cardText {
  padding: 0.5rem;
  text-align: center;
  width: @imageWidth;
  background-color: white;
}

.caseCard {
  margin-bottom: 20px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
}
</style>

