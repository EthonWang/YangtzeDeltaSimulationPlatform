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
          <el-menu-item
            @click="sendRouter('/home')"
            index="2"
            style="font-size: 20px"
            class="barItem"
            >主页</el-menu-item
          >
          <el-menu-item
            @click="sendRouter('/data')"
            index="3"
            style="font-size: 20px"
            class="barItem"
            >数据</el-menu-item
          >
          <el-menu-item
            @click="sendRouter('/model')"
            index="3"
            style="font-size: 20px"
            class="barItem"
            >模型</el-menu-item
          >
          <el-menu-item
            @click="sendRouter('/method')"
            index="4"
            style="font-size: 20px"
            class="barItem"
            >方法</el-menu-item
          >
          <el-menu-item
            @click="sendRouter('/function')"
            index="5"
            style="font-size: 20px"
            class="barItem"
            >功能</el-menu-item
          >
          <el-menu-item
            @click="sendRouter('/help')"
            index="6"
            style="font-size: 20px"
            class="barItem"
            >帮助</el-menu-item
          >
          <el-menu-item
            @click="sendRouter('/about')"
            index="7"
            style="font-size: 20px"
            class="barItem"
            >关于</el-menu-item
          >
        </el-menu>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, ref, defineEmits } from "vue";
const emit=defineEmits(['toRouter']);
const sendRouter = (route) => {
  emit('toRouter',route)
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.topbar{
  margin-left:20px ;
}
.barItem {
  padding: 10px 10px;
  cursor: pointer;
  margin: 0px 10px;
  &:hover{
    border: 2px solid;
    border-color: white;
    
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
  background: rgb(47, 55, 100);
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
