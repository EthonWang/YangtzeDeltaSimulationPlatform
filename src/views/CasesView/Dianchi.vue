<template>
  <video-case
      :video-path1="videoPath1"
      :video-path2="videoPath2"
      title1="滇池模型-富营养化水质参数"
      title2="滇池模型-水华"
  ></video-case>
</template>

<script setup>
import {ref} from "vue";
import VideoCase from "components/Cases/videoCase";
const videoPath1 = ref("")
videoPath1.value = "/back/store/themeImg/Eutrophication.62d77135443c3b60743a520c.mp4";
const videoPath2 = ref("")
videoPath2.value = "/back/store/themeImg/shuihua.62d771a9443c3b60743a520e.mp4";
</script>

<style scoped>

</style>
