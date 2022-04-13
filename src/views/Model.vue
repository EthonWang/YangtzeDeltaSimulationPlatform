<template>
  <div class="about">
    <h1>This is a model page</h1>
    <mapbox-view :shpShowList="shpList"></mapbox-view>
  </div>
</template>

<!--<script setup>-->
<script>
//采用vue2写法的话把setup去掉，
import { reactive, computed, ref } from "vue";
import {useRouter} from "vue-router";
import {useStore} from "vuex";
import MapboxView from "../components/Model/MapboxView";
export default {
  components: {MapboxView},
  data() {
    return {

      //使用mapbox-view组件需要传递的参数
      shpList: [], //格式参考[{name: "111", type: "circle", nameId: "111_123"}]
    }
  },
}
const router=useRouter()//路由直接用router.push(...)
const store=useStore()//vuex直接用store.commit


</script>

<style lang="less" scoped>
// 兼容css

</style>

