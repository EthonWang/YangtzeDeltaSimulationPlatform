<template>
  <div class="dianChiPage">
    <el-card :body-style="{ padding: '0px' }">
      <video class="videoBox" loop autoplay controlsList="nodownload" controls>
        <source :src="videoPath1" type="video/mp4">
      </video>
      <div class="titleBox">
        <h2 class="font-title">{{title1}}</h2>
      </div>
    </el-card>
    <el-card :body-style="{ padding: '0px' }">
      <video class="videoBox"  controlsList="nodownload" controls >
        <source :src="videoPath2" type="video/mp4">
      </video>
      <div class="titleBox">
        <h2 class="font-title">{{title2}}</h2>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import {ref,defineProps} from "vue";
import Video from "views/CasesView/Video";
const props = defineProps({
  videoPath1:{
    type:String,
    default:''
  },
  videoPath2:{
    type:String,
    default:''
  },
  title1:{
    type:String,
    default:''
  },
  title2:{
    type:String,
    default:''
  }
})
</script>

<style scoped>
.dianChiPage{
  width: 100vw;
  height: 92.54vh;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #80D0C7;
  background-image: linear-gradient(180deg, #80D0C7 0%, #295563 86%);

}
.videoBox{
  width: 46vw;
}
.titleBox{
  padding: 10px;
  display: flex;
  justify-content: center;
}
.font-title{
  color: #3e5c66;

}
</style>
