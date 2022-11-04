<!-- 如果只是在首页点击就弹出而不跳转的话，这个页面没有必要，先保存备用，如若之后需要跳转到新的页面并选择再重新启用或废弃 -->
<!-- 如果只是在首页点击就弹出而不跳转的话，这个页面没有必要，先保存备用，如若之后需要跳转到新的页面并选择再重新启用或废弃 -->
<!-- 如果只是在首页点击就弹出而不跳转的话，这个页面没有必要，先保存备用，如若之后需要跳转到新的页面并选择再重新启用或废弃 -->

<template>
      <div>
    <!-- 一个按钮，点击显示dialog -->
    <el-button type="text" @click="dialogVisible = true">点击打开 Dialog</el-button>
    <!-- title是弹出表格的首标题， -->
    <el-dialog title="提示" v-model="dialogVisible" width="60%">
        <!-- 内容存储位置 -->
      <span>这是1段信息</span>
      <span>这是2段信息</span>
      <span>这是3段信息</span>
      <span>这是4段信息</span>
      <span>这是5段信息</span>
      <span class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
    };
  },
};
</script>

<style scoped>

</style>