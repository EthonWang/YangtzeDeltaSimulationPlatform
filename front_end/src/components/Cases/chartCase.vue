<template>
  <div :id="id" :style="style" ></div>
</template>

<script setup>
import * as echarts from 'echarts';
import {onMounted, ref, defineProps, onBeforeUnmount} from "vue";
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
  loadChart();
  window.addEventListener('resize',economicChart.resize())
})
const loadChart=()=>{
  economicChart.setOption(props.option)
}

onBeforeUnmount(()=>{
  window.removeEventListener('resize',economicChart.resize())
})

</script>

<style scoped>

</style>
