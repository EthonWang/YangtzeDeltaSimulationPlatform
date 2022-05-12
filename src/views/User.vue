<template>
    <div>
        <div class="user-space">
            <el-divider style="top:3vw"></el-divider>
            <div class="user-info">
                <UserInfo></UserInfo>
            </div>
            <div class="function">
                <UserFunction></UserFunction>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, computed, ref, defineEmits, defineProps } from "vue";
import { useRoute, useRouter } from "vue-router";
import UserInfo from "@/components/User/UserInfo.vue";
import UserFunction from "@/components/User/UserFunction.vue";

</script>

<style lang="less" scoped>
.user-space {
    position: absolute;
    width: 100%;
    height: 92.5vh;
    top: 7.5vh;
    background-color: white;
}

.user-info {
    position: absolute;
    // background: red;
    width: 20vw;
    height: 65vh;
    left: 16.5vw;
    top: 3vh;
}

.function {
    position: absolute;
    // background: blue;
    // border-color: aqua;
    width: 49.2vw;
    right: 15vw;
    height: 88vh;
    top: 3vh;
}
</style>