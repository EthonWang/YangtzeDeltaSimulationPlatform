<template>
  <div class="container">
    <div class="head">
      <div class="main-menucontainer">
        
          <div
            v-for="(bar,index) in barList"
            :key="bar"
            @click="sendRouterToFather(bar.path,index)"
            style="font-size: 20px; cursor: pointer"
            class="set_7_btn-wrapper"
            :class="{pickup:pick[index]}"
          >
            <svg height="54" width="120">
              <rect id="set_7_button1" height="54" width="120"></rect>
            </svg>
            <div id="set_7_text">
              <span>{{ bar.name }}</span>
            </div>
          
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, ref, defineEmits } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const barList = reactive(router.options.routes);
const emit = defineEmits(["RouterFromBar"]);
const sendRouterToFather = (route,index) => {
  pickup(index);
  emit("RouterFromBar", route);
};
let pick = ref([0, 0, 0, 0, 0]);
const pickup = (row) => {
  pick.value = [0, 0, 0, 0, 0];
  pick.value[row] = 1;
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import "../../css/btn/btn7.css";

.topbar {
  margin-left: 20px;
  width: 100%;
}
.pickup {
  border: 2px solid;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 0, 0, 0.1) inset;
}
.barItem {
  height: 80px;
  transition: all 1000ms ease-in-out;
  &:hover {
    background-color: rgba(255, 255, 255, 0.521);

    a {
      color: rgb(77, 77, 77) !important;
    }
  }
}

.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
.head {
  width: 100%;
  background: rgb(41, 41, 41);
  height: 100%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

::v-deep.head .el-menu--horizontal .el-menu-item {
  height: 70px;
  line-height: 70px;
}

.main {
  width: 100%;
  height: 100%;
}
.contact-info {
  width: fit-content;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-right: 12px;
}
.head .main-iconbox {
  display: flex;
  align-items: center;
  margin-left: 40px;
  margin-right: 10px;
}
.head .main-iconbox .main-icon {
  width: 38px;
  height: 38px;
  margin-right: 5px;
}
.head .main-iconbox .main-iconname {
  width: 80px;
  height: 40px;
}
.head .main-menucontainer {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
  width: fit-content;
}
.head .main-user {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;

  margin-right: 40px;
}
.head .main-user i {
  font-size: 30px;
  color: white;
  font-size: 28px;
}
.head .main-user p {
  margin-left: 10px;
  font-size: 20px;
  color: white;
}
</style>
