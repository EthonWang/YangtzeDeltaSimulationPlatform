<template>
  <div class="watershedPage" >
    <video class="videoBox" loop autoplay controlsList="nodownload" controls width="1200" >
      <source :src="videoPath" type="video/mp4">
    </video>
  </div>
</template>

<script setup>
import {ref} from "vue";
import Video from "views/CasesView/Video";
import {useStore} from "vuex"
const dataServer=useStore().getters.devIpAddress_backup
const videoPath = ref("")
videoPath.value = dataServer+"/store/themeImg/watershedFlood.62d6c5ad443c3b60743a51bd.mp4";
</script>

<style scoped>
.watershedPage{
  width: 100vw;
  height: 92.54vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #80D0C7;
  background-image: linear-gradient(180deg, #80D0C7 0%, #295563 86%);
}

.videoBox{
  box-shadow: rgba(40, 122, 172, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
}
</style>
