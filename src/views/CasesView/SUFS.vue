<template>
  <div>
    <iframe
      class="sufs"
      src="http://172.21.213.190:8888/"
      frameborder="0"
      v-if="!inhttps"
    ></iframe>
    <div style="position: absolute; top: 70px; left: 15px" v-if="inhttps">
      该案例数据涉及版权与安全问题无法公开，暂时仅支持南京师范大学内网访问，连接到内网后请
      <a href="http://172.21.213.190:8888/">点此此处以查看案例</a>
    </div>
  </div>
</template>

<script setup>
//采用vue2写法的话把setup去掉，
import { reactive, computed, ref, defineProps, defineEmits, watch } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
const router = useRouter(); //路由直接用router.push(...)
const store = useStore(); //vuex直接用store.commit
const inhttps = ref(false);
const herf = window.location.href.toLowerCase();
if (herf.indexOf("geomodeling.njnu.edu.cn") != -1) {
  inhttps.value = true;
}
</script>

<style lang="less" scoped>
// 兼容css
.sufs {
  width: 100vw;
  height: 100%;
}
</style>

