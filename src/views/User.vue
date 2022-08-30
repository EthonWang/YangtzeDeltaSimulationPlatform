<template>
    <div>
        <div class="user-space">
            <el-divider style="top:4.6vh"></el-divider>
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
    height: 93vh;
    top: 65px;
    background-color: hsl(0, 0%, 98%);
    overflow-y: hidden;
}

.user-info {
    position: absolute;
    // background: red;
    width: 18vw;
    height: 88vh;
    left: 16.5vw;
    top: 3vh;
      transition: all 1s;
}

.function {
    position: absolute;
    // background: blue;
    // border-color: aqua;
    width: 51.2vw;
    max-width: calc(88vw - 290px);
    right: 15vw;
    height: 95vh;
    top: 3vh;
    transition: all 1s;
}
</style>