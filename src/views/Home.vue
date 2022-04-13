<template>
  <div class="about">
    <!-- <div style="position:relative;top:0px;left:0;z-index:1;"> -->
      <h1>This is a home page</h1>
      <p class="cyberpunk introduce">长江三角洲地区是中国经济发展最活跃、开放程度最高、创新能力最强的区域之一，在国家现代化建设大局和全方位开放格局中具有举足轻重的战略地位。推动长三角一体化发展，增强长三角地区创新能力和竞争能力，提高经济集聚度、区域连接性和政策协同效率，对引领全国高质量发展、建设现代化经济体系意义重大 [5]  。2021年11月23日消息，即日起，长三角区域户籍居民可在实际居住地公安机关申请办理新生儿入户，不再需要在实际居住地和入户地之间来回奔波。这是沪苏浙皖四地公安机关在“我为群众办实事”实践活动中推出的又一项便民服务举措</p>

      <!-- </div> -->
    <Fire style="position:absolute;top:0px;left:0;z-index:-1"></Fire>


  </div>
</template>

<script setup>
//采用vue2写法的话把setup去掉，
import { reactive, computed, ref } from "vue";
import {useRouter} from "vue-router";
import {useStore} from "vuex";
import Fire from "@/components/Home/Fire.vue"

const router=useRouter()//路由直接用router.push(...)
const store=useStore()//vuex直接用store.commit


</script>

<style lang="less" scoped>
// 兼容css
.introduce{
  width: 45%;
}
</style>

