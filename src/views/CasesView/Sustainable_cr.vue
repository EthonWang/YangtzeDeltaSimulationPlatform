<template>
    <el-container class="data-show" >
        <el-container class="data-show-main">
            <el-aside style="height: 100%;width: 10%;">
                <el-menu 
                        class="el-menu-vertical-demo data-show"
                        background-color="#545c64"
                        text-color="#fff"
                        active-text-color="#ffd04b"
                        :router="true"
                        >
<!--                    <el-menu-item index="/SdgPlatform/EvaluateAnalyze/System/Introduce">-->
<!--                        <i class="el-icon-menu"></i>-->
<!--                        <span slot="title">-->
<!--                            操作介绍-->
<!--                        </span>-->
<!--                    </el-menu-item>-->
                    <el-menu-item index="Map" >
                        <i class="el-icon-document"></i>
                        <slot name="title">
                            位置选取
                        </slot>
                    </el-menu-item>
                    <el-menu-item index="Table">
                        <i class="el-icon-setting"></i>
                        <slot name="title">
                            评估分析
                        </slot>
                    </el-menu-item>
                    <el-menu-item index="Visual">
                        <i class="el-icon-picture"></i>
                        <slot name="title">
                            数据展示
                        </slot>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <el-container style="height: 100%;width: 90%;">
                <router-view></router-view>
            </el-container>
        </el-container>
    </el-container>
</template>


<script>
    export default {
        name: "SystemPage",

        methods: {

        }
    }
</script>


<style scoped>

.data-show {
        height:100%;
        width: 100%;
    }
    .data-show-main{
        height: 100%;
        width: 100%;
    }
    .data-show-header,
    .data-show-header div,
    .data-show-content > div {
        height: 100%;
    }
    .data-show-footer > span {
        right: 10px;
        position: absolute;
    }
</style>