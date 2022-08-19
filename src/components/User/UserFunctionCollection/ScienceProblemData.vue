<!-- ·设计人：张子卓 -->
<!-- ·功能： -->
<!-- 1.应用于个人空间“我的数据”与“我的实验”的科学问题组织与筛选 -->
<template>
  <div style="background-color: white">
    <h2>科学问题分类</h2>
    <el-tree
      style="width: 100%; height: 95%; background: white"
      :data="data"
      show-checkbox
      node-key="label"
      :default-expanded-keys="[
        '全选',
        '灾害响应与治理',
        '全球变化与区域环境演化',
        '流域水循环及驱动机制',
        '城市化与人地关系协调发展',
      ]"
      :default-checked-keys="['全选']"
      :props="defaultProps"
      :current-change="changeScienceChoose()"
      ref="scienceTree"
    />
  </div>
</template>

<script setup>
//采用vue2写法的话把setup去掉，
import { reactive, computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { scienceChoose } from "@/assets/user/scienceChoose.js";
const router = useRouter(); //路由直接用router.push(...)
const store = useStore(); //vuex直接用store.commit
const defaultProps = {
  children: "children",
  label: "label",
};
const scienceTree = ref(null);
// setTimeout(()=>{console.log(scienceTree.value.getCheckedKeys());},5000)
// watch(()=>scienceTree.value,(newval,oldval)=>{
//   scienceChoose=newval.getCheckedKeys()
//   console.log(scienceTree.value.getCheckedKeys());
//   console.log(scienceChoose);
// })

setTimeout(() => {
  scienceChoose.value = scienceTree.value.getCheckedKeys();
  console.log("scienceChoose", scienceChoose.value);
}, 800);
const changeScienceChoose = () => {
  if (scienceTree.value == null) {
    return;
  } else {
    scienceChoose.value = scienceTree.value.getCheckedKeys();
  }
};
const data = [
  {
    id: 0,
    label: "全选",
    children: [
      {
        id: -1,
        label: "未分类",
      },
      {
        id: 1,
        label: "灾害响应与治理",
        children: [
          {
            id: 11,
            label: "台风与风暴潮",
          },
          {
            id: 12,
            label: "洪涝水环境灾害",
          },

          {
            id: 13,
            label: "地质灾害",
          },
          {
            id: 14,
            label: "大气污染",
          },
        ],
      },
      {
        id: 2,
        label: "全球变化与区域环境演化",
        children: [
          {
            id: 21,
            label: "海岸带变迁",
          },
          {
            id: 22,
            label: "河口海岸水动力",
          },
          {
            id: 23,
            label: "湖泊碳循环",
          },
          {
            id: 24,
            label: "土壤碳氮循环",
          },
          {
            id: 25,
            label: "土壤氮转化过程及其环境效应",
          },
        ],
      },
      {
        id: 3,
        label: "流域水循环及驱动机制",
        children: [
          {
            id: 31,
            label: "流域生态环境演变",
          },
          {
            id: 32,
            label: "流域碳水耦合循环",
          },
          {
            id: 33,
            label: "地表地下水耦合",
          },
          {
            id: 34,
            label: "湖泊水环境监测",
          },
        ],
      },
      {
        id: 4,
        label: "城市化与人地关系协调发展",
        children: [
          {
            id: 41,
            label: "湿地保护",
          },
          {
            id: 42,
            label: "城市扩张",
          },
          {
            id: 43,
            label: "农业生态",
          },
          {
            id: 44,
            label: "人地关系",
          },
          {
            id: 45,
            label: "城市水问题",
          },
          {
            id: 46,
            label: "自然遗产",
          },
          {
            id: 47,
            label: "城市群发展",
          },
        ],
      },
    ],
  },
];
</script>

<style lang="less" scoped>
// 兼容css
h2 {
  padding-left: 70px;
  position: relative;
  font-size: 23px;
  z-index: 400;
  background: white;
}
</style>

