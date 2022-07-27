<template>
  <div :id="id" :style="style" ></div>
</template>

<script setup>
import * as echarts from 'echarts';
import {onMounted,ref,defineProps,onBeforeUnmount} from "vue";
const props = defineProps({
  id:{
    type:String,
    default:''
  },
  option:{},
  style:{}
})
let economicChart;
onMounted(()=>{
  economicChart = echarts.init(document.getElementById(props.id));
  economicChart.setOption(props.option)
  window.addEventListener('resize',economicChart.resize())
})

onBeforeUnmount(()=>{
  window.removeEventListener('resize',economicChart.resize())
})

</script>

<style scoped>

</style>
