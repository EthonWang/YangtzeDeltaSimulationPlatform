<!-- ·主题：注册 -->
<!-- ·设计人：张子卓 -->
<!-- ·功能 -->
<!-- 1.用户注册 -->

<template>
  <div class="login-page" v-loading="loading">
    <div class="bg"></div>
    <div style="margin: 9vh"></div>
    <img src="../assets/globle.svg" class="logo" />
    <h4>注册长三角综合模拟平台</h4>
    <div class="user-info">
      <div style="margin: 20px" />
      <el-form
        :label-position="labelPosition"
        label-width="100px"
        :model="formLabelAlign"
        :rules="rules"
        style="min-width: 460px"
        ref="ruleFormRef"
      >
        <el-form-item label="请输入邮箱" prop="email">
          <el-input v-model="formLabelAlign.email" />
        </el-form-item>
        <el-form-item label="请输入姓名" prop="name">
          <el-input v-model="formLabelAlign.name" />
        </el-form-item>
        <el-form-item label="请输入密码" prop="password">
          <el-input
            type="password"
            show-password
            v-model="formLabelAlign.password"
          />
        </el-form-item>
        <el-form-item label="请确认密码" prop="re_password">
          <el-input
            type="password"
            show-password
            v-model="formLabelAlign.re_password"
          />
        </el-form-item>
        <el-form-item>
          <br /><br />
          <el-button type="success" style="width: 100%" @click="toLogin(0,ruleFormRef)"
            >确认注册</el-button
          ><br />
          <el-button style="width: 100%" @click="toLogin(-1,ruleFormRef)"
            >转到登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
//采用vue2写法的话把setup去掉，
import { reactive, computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import Api from "@/api/user/user";
import { ElMessage } from "element-plus";
import { Encrypt } from "@/util/codeUtil";

const api = new Api();
const router = useRouter(); //路由直接用router.push(...)
const store = useStore(); //vuex直接用store.commit
const labelPosition = ref("top");
const loading = ref(false);

const formLabelAlign = reactive({
  email: "",
  password: "",
  name: "",
  re_password: "",
});
const rules = reactive({
  name: [
    { required: true, message: "请输入姓名", trigger: "blur" },
    { min: 1, max: 15, message: "至少一个字符", trigger: "blur" },
  ],
  email: [
    {
      required: true,
      type: "email",
      message: "请输入邮箱",
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
      trigger: "blur",
    },
    { min: 5, max: 10, message: "密码为5到10位", trigger: "blur" }
  ],
  re_password: [
    {
      required: true,
      message: "请再次输入密码",
      trigger: "blur",
    },
    { min: 5, max: 10, message: "密码为5到10位", trigger: "blur" }
  ],
});
const ruleFormRef=ref()
const toLogin = (index = 0, formEl) => {
  if (!formEl) {
    return;
  }
  if (index == -1) {
    router.push("/login");
    return;
  }
  formEl.validate((valid, fields) => {
    if (valid) {
      if (formLabelAlign.password != formLabelAlign.re_password) {
        ElMessage.error("密码两次输入不一致");
        return;
      }
      loading.value = true;
      api.register(formLabelAlign).then((res) => {
        ElMessage({
          message: "注册成功",
          type: "success",
        });
        loading.value = false;
        router.push({
          path: "/login",
          query: { user: Encrypt(JSON.stringify(formLabelAlign)) },
        });
      });
    } else {
      ElMessage.error("信息验证失败");
      console.log("error submit!", fields);
    }
  });
};
</script>

<style lang="less" scoped>
// 兼容css
.login-page {
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  top: 0;
}
.bg {
  background-image: url("../assets/img/rainForecast_back.png");
  background-size: 100% 100%;
  filter: blur(0px);
  width: 100%;
  height: 100vh;
  position: absolute;
}
h4 {
  position: relative;
  font-size: 1.5vw;
  font-weight: 400;
  color: white;
}
/deep/.el-form-item__label {
  color: white;
}
.user-info {
  width: fit-content;
  height: fit-content;
  position: relative;
  background-color: hsla(220, 100%, 6%, 0.5);
  border: 0px solid rgb(221, 221, 221);
  padding: 1%;
}
.logo {
  position: relative;
  width: 5%;
  background-color: black;
  border-radius: 50%;
  border: 1px solid;
  // top: 5vh;
  //   background: #409eff;
}
</style>

