<template>
  <video-case
      :video-path1="videoPath1"
      :video-path2="videoPath2"
      title1="太湖流场"
      title2="太湖水污染扩散系统演示"
  ></video-case>
</template>

<script setup>
import {ref} from "vue";
import VideoCase from "components/Cases/videoCase";
import {useStore} from "vuex"
const dataServer=useStore().getters.devIpAddress_backup

const videoPath1 = ref("")
videoPath1.value = dataServer+"/store/themeImg/taihu1.62d7b5c7443c3b60743a5286.mp4";
console.log("video",videoPath1.value)
const videoPath2 = ref("")
videoPath2.value = dataServer+"/store/themeImg/taihu2.62d7a06c443c3b60743a5251.mp4";
</script>

<style scoped>

</style>
