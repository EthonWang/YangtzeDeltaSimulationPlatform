<template>
  <div>
    <div class="model-item">
      <h2>{{ props.model.name }}</h2>
      <img src="https://geomodeling.njnu.edu.cn/static/modelItem/////////5299fa74-0d3a-4cd5-a005-d2613b0b51f9.jpg" alt="">
<p>{{ props.model.description }}</p>
      <el-divider></el-divider>
      <span>作者：{{ props.model.author }}</span>
      <el-button type="primary" class="btn">查看详情</el-button>
    </div>
  </div>
</template>

<script setup>
//采用vue2写法的话把setup去掉，
import { reactive, computed, ref,defineProps } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
const router = useRouter(); //路由直接用router.push(...)
const store = useStore(); //vuex直接用store.commit
const props=defineProps({
    model:reactive(Object),
})

</script>

<style lang="less" scoped>
// 兼容css
.model-item {
  position: relative;
  width: calc(99% - 2 * $padding) ;
  height: 100%;
  padding: 15px;
  border: .5px solid rgba(201, 201, 201, 0.5);
  .btn{
      position: absolute;
      right: 2%;
      bottom: 5%;
  }
}
h2{
    width: calc(100% - 150px);
}
img{
    width: 130px;
    position: absolute;
    right: 2%;
    top: 0;
    z-index: 0;
}
p{
    position: relative;
    margin-top: 3%;
    line-height: 160%;
}

</style>

