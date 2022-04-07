<template>
  <div class="container">
    <div class="head">
      <div class="main-menucontainer">
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo topbar"
          mode="horizontal"
          @select="handleSelect"
          background-color="rgb(20, 133, 209)"
          text-color="#FFFFFF"
          active-text-color="#CCCCCC"
          :router="true"
          style="border: unset"
        >
          <el-menu-item v-for="bar in barList" :key="bar"
            @click="sendRouter(bar.path)"
            index="2"
            style="font-size: 20px;cursor:pointer"
            class="set_7_btn-wrapper"
          >
            <svg height="54" width="120">
              <rect id="set_7_button1" height="54" width="120"></rect>
            </svg>
            <div id="set_7_text"><a href="">{{bar.name}}</a></div>
          </el-menu-item>
          
        </el-menu>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, ref, defineEmits } from "vue";
import {useRouter} from "vue-router";
const router=useRouter()
const barList=ref(router.options.routes)
console.log(router)
const emit = defineEmits(["toRouter"]);
const sendRouter = (route) => {
  emit("toRouter", route);
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import "../../css/btn.css";

.topbar {
  margin-left: 20px;
  width: 100%;
}
.barItem {
  letter-spacing: 0;
  float: left;
  padding: 10px 10px;
  cursor: pointer;
  margin: 0px 10px;
  transition: all 280ms ease-in-out;
  &:hover {
    border-left: 2px solid;
    border-right: 2px solid;
    border-color: white;
    text-decoration: none;
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
  background: rgb(50, 53, 70);
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
