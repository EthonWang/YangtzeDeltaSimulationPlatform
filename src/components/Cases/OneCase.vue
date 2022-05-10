<template>
  <div>
    <div class="card">
      <img
        class="img"
        :src="img_url"
        alt=""
      />
      <h2>{{tittle}}</h2>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, defineProps, defineExpose } from "vue";
const props = defineProps({
  img_url: String,
  tittle: String,
});
// const img=require(props.img_url)
</script>

<style lang="less" scoped>
.card {
  width: 100%;
  height: 100%;
  box-shadow: 0 2px 12px 0 hsla(220, 50%, 8%, 0.4);
  transition: box-shadow 1s;
  text-align: center;
  &:hover {
    box-shadow: 0 2px 24px 0 hsla(220, 100%, 58%, .6);
  }
  .img{
      height: 65%;
      width: 90%;
      margin: 5%;
  }
  h2{
      margin: -2.5%;
  }
}
</style>