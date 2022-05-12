<template>
    <div style="width:100% ;height:100% ;display: flex;flex-wrap: wrap;  align-items: center;
flex-direction: column;">
        <avatar class="img" style="" />
        <div class="infoSpan">
            <h4>{{ data.name }}</h4>
            <span style="color: gray;">{{ data.email }}</span><br>
            <span>{{ data.description }} </span><br>
        </div>
        <el-button style="width: 90% ;margin: .8vh;">编辑信息</el-button>
        <div class="otherSpan">
            <span>机构名：</span><span>{{ data.instruction }}</span><br>
            <span>数据量：</span><span>{{ data.data_num }} </span><br>
            <span>模型量：</span><span>{{ data.model_num }} </span><br>
            <span>任务量：</span><span>{{ data.task_num }} </span><br>
        </div>
    </div>
</template>

<script setup>
//采用vue2写法的话把setup去掉，
import { reactive, computed, ref, } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
const router = useRouter()//路由直接用router.push(...)
const store = useStore()//vuex直接用store.commit
const data = reactive({
    name: "ZZZ",
    email: "zzz@myzzz.zzz",
    description: "个人介绍是用来介绍自己的，所以要用个人介绍来介绍自己。",
    data_num:5,
    instruction:"nnu",
    model_num:5,
    task_num:50,
})
</script>

<style lang="less" scoped>
// 兼容css
.img {
    color: aliceblue;
    width: 15vw;
    height: $width;
    margin-right: 8px;
    margin-top: 2%;
    border-radius: 50%;
    background-color: rgb(20, 20, 20);
}

.infoSpan {
    text-align: left;
    margin-left: 1vw;
    margin-right: 0.5vw;
    line-height: 150%;
    font-size: 1.1vw;
width: 90%;
    h4 {
        margin: 0;
        font-size: 1.4vw;
    }
}
.otherSpan{
    width: 90%;
    text-align: left;
    margin-left: 1vw;
    margin-right: 0.5vw;
    line-height: 150%;
    font-size: 1vw;
}
</style>