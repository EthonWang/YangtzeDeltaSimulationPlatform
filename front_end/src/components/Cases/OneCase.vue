<template>
  <div>
    <div class="card">
      <img
        class="img"
        :src="props.img_url"
        alt=""
      />
      <h2>{{props.tittle}}</h2>
      <p>{{props.description}}</p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, defineProps, defineExpose } from "vue";
const props = defineProps({
  img_url: String,
  tittle: String,
  description:String,
});
// const img=require(props.img_url)
</script>

<style lang="less" scoped>
@margin-left:5%;
.card {
  width: 100%;
  height: 100%;
  box-shadow: 0 2px 12px 0 hsla(220, 50%, 8%, 0.4);
  transition: box-shadow 1s;
//   text-align: center;
  &:hover {
    box-shadow: 0 2px 24px 0 hsla(220, 100%, 58%, .6);
  }
  .img{
      height: 35%;
      width: 100% - 2 * @margin-left;
      margin: @margin-left;
  }
  h2{
      font-size: 35px;
      margin-left: @margin-left;
      margin-top: -2.5%;
      margin-bottom: -2.5%;
  }
  p{
      font-size: 18px;
      line-height: 150%;
      margin-left: @margin-left;
      margin-right: @margin-left;
      text-indent: 2 * $font-size;
  }
}
</style>