<template>
  <div class="login-page">
    <div class="bg"></div>
    <div style="margin: 10vh"></div>
    <img src="../assets/globle.svg" class="logo" />
    <h4>登录长三角综合模拟平台</h4>
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
        <el-form-item label="请输入密码" prop="password">
          <el-input
            type="password"
            show-password
            v-model="formLabelAlign.password"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="success" style="width: 100%" @click="login(ruleFormRef)"
            >登录</el-button
          ><br /><br />
          <el-button @click="toRegister" style="width: 100%">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
//采用vue2写法的话把setup去掉，
import { reactive, computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import userApi from "@/api/user/user";
import { ElLoading, ElNotification } from "element-plus";
import graphAPI from "@/api/user/graph";
import { Encrypt, Decrypt } from "@/util/codeUtil";
import { ElMessage } from "element-plus/lib/components";

const graphapi = new graphAPI();
const api = new userApi();
const route = useRoute();
const router = useRouter(); //路由直接用router.push(...)
const store = useStore(); //vuex直接用store.commit
const labelPosition = ref("top");
const ruleFormRef=ref()
let toLast = localStorage.getItem("toLast");
if (toLast) {
  toLast = Decrypt(toLast);
}
const formLabelAlign = reactive({
  email: "",
  password: "",
});
const rules = reactive({
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
  ],
});

if ("user" in route.query) { //自动填充注册信息
  const new_user = JSON.parse(Decrypt(route.query.user));
  if (new_user != null) {
    formLabelAlign.email = new_user.email;
    formLabelAlign.password = new_user.password;
  }
}

const toRegister = () => {
  router.push("/register");
};
const login = (formEl) => {
  if (!formEl) {
    return;
  }
  formEl.validate((valid, fields) => {
    if (valid) {
      api.login(formLabelAlign.email, formLabelAlign.password).then((res1) => {
        if(res1.data==null){
          ElNotification({
            title: "Error",
            message: res1.msg,
            type: "error",
          });
        }
        localStorage.setItem("token", Encrypt(res1.data.token));
        api.getUserInfo(formLabelAlign.email).then((res) => {
          localStorage.setItem(
            "userInfo",
            Encrypt(JSON.stringify(res.data.data))
          );
          const loading = ElLoading.service({
            lock: true,
            text: "Loading",
            background: "rgba(0, 0, 0, 0.7)",
          });
          graphapi.initGraph(res.data.data.id).then((res) => {
            console.log("res is ", res);
            setTimeout(() => {
              loading.close();
              // document.getElementsByClassName("user-topbar")[0].style.right = "1vw";
              // document.getElementById("logo").style.marginLeft = "2vw";
              // document.getElementsByClassName("topbar")[0].style.left = "5vw";
              // document.getElementsByClassName("user-info")[0].style.opacity = 1;
              // document.getElementsByClassName("science")[0].style.opacity = 0;
            }, 601);
            if (toLast) {
              router.push(toLast);
            } else {
              localStorage.removeItem("toLast");
              router.push("/user");
            }
          });
        });
      });
    } else {
      ElMessage.error('信息验证失败')
      console.log("error submit!", fields);
    }
  });
};
</script>

<style lang="less" scoped>
// 兼容css
.bg {
  background-image: url("../assets/img/rainForecast_back.png");
  background-size: 100% 100%;
  filter: blur(0px);
  width: 100%;
  height: 100vh;
  position: absolute;
}
.login-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  top: 0px;
}
h4 {
  position: relative;
  font-size: 1.5vw;
  font-weight: 400;
  color: hsl(0,0,98%);
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
/deep/.el-form-item__label {
  color: hsl(0,0,98%);
}
</style>

