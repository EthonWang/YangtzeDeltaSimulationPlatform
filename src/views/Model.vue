<template>
  <div class="about">
    <ModelTree  @getCheckData="getCheckData"></ModelTree>
    <button class="mapSwitchButton" @click="switchMap">2D/3D</button>
    <mapbox-view :shpShowList="shpList" v-if="mapType == 'mapBox'"></mapbox-view>
    <cesium v-if="mapType == 'cesium'"/>

  </div>
</template>

<!--<script setup>-->
<script>
//采用vue2写法的话把setup去掉，
import { reactive, computed, ref } from "vue";
import {useRouter} from "vue-router";
import {useStore} from "vuex";
import { toRaw } from '@vue/reactivity'
import MapboxView from "../components/Mapbox/MapboxView";
import Cesium from "../components/cesium/cesium.vue";
import ModelTree from "components/App/ModelTree";
export default {
  components: {ModelTree, MapboxView, Cesium},
  data() {
    return {
      mapType: "mapBox",
      //使用mapbox-view组件需要传递的参数
      shpList: [], //格式参考[{name: "111", type: "circle", nameId: "111_123"}]
      checkedData:[],
    }
  },
  mounted() {

  },

  methods: {
    switchMap(){
      if(this.mapType == 'mapBox'){
        this.mapType = 'cesium';
      } else {
        this.mapType = 'mapBox';
      }
    },
    getCheckData(data){
      //将选中的目录树的data值覆给shpList
      this.shpList =JSON.parse(JSON.stringify(data))
      console.log('this.shpList: ', toRaw(this.shpList))

    }
  }
}
const router=useRouter()//路由直接用router.push(...)
const store=useStore()//vuex直接用store.commit


</script>

<style lang="less" scoped>
// 兼容css
.about{
  position: relative;
}
.mapSwitchButton{
  position: absolute;
  bottom: 250px;
  right: 10px;
  z-index: 1000;
}

</style>

