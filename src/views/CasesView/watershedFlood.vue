<template>
    <video autoplay controls width="1000vw" height="100%">
      <source :src="videoPath" type="video/mp4">
    </video>
</template>

<script setup>
import {ref} from "vue";
import Video from "views/CasesView/Video";
const videoPath = ref("")
videoPath.value = "/back/store/themeImg/watershedFlood.62d6c5ad443c3b60743a51bd.mp4";
</script>

<style scoped>

</style>
