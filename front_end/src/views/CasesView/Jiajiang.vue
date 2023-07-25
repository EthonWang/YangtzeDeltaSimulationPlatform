<template>
  <video-case
      :video-path1="videoPath1"
      :video-path2="videoPath2"
      title1="应急响应-非溶于水"
      title2="应急响应-污染扩散"
  ></video-case>
</template>

<script setup>
import {ref} from "vue";
import VideoCase from "components/Cases/videoCase";
import {useStore} from "vuex"
const dataServer=useStore().getters.devIpAddress_backup
const videoPath1 = ref("")
videoPath1.value = dataServer+"/store/themeImg/jiajiang1.62d7b3ed443c3b60743a527a.mp4";
const videoPath2 = ref("")
videoPath2.value = dataServer+"/store/themeImg/jiajiang2.62d7b630443c3b60743a528c.mp4";
</script>

<style scoped>

</style>
