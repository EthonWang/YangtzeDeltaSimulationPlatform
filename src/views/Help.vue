<template>
  <div>
    <el-button>help page</el-button>
    <div class="segmented-control">
      
      <input type="radio" name="radio2" value="3" id="tab-1" checked/>
      <label for="tab-1" class= "segmented-control__1">
        <p>Tab 1</p></label>
      
      <input type="radio" name="radio2" value="4" id="tab-2" />
      <label for="tab-2" class= "segmented-control__2">
        <p>Tab 2</p></label>
      
      <input type="radio" name="radio2" value="5" id="tab-3" />
      <label for="tab-3" class= "segmented-control__3">
        <p>Tab 3</p></label>
      
      <div class="segmented-control__color"></div>
    </div>
    <button class="cyberpunk">12123</button>
    <input class="cyberpunk" type="text" placeholder="input 输入框" />
<textarea class="cyberpunk" placeholder="textarea 文本框"></textarea>
<label class="cyberpunk"><input class="cyberpunk" name="test" type="radio" />单选框1</label>
<label class="cyberpunk"><input class="cyberpunk" name="test" type="radio" />单选框2</label><br />
<label class="cyberpunk"><input class="cyberpunk" type="checkbox" />多选框</label><br />
<h1 class="cyberpunk">H1 title</h1>
<h1 class="cyberpunk glitched">H1 title glitched</h1>
<p class="cyberpunk">经典的赛博朋克角色是边缘且性格疏远的独行者。他们生活在社会群体的边缘，一个弥漫反乌托邦氛围的未来：日常生活受到急剧改变的科技影响，普及的计算机化信息笼罩全球，以及侵入性的人体改造。</p>
<p class="cyberpunk inverse">经典的赛博朋克角色是边缘且性格疏远的独行者。他们生活在社会群体的边缘，一个弥漫反乌托邦氛围的未来：日常生活受到急剧改变的科技影响，普及的计算机化信息笼罩全球，以及侵入性的人体改造。</p>
<p class="cyberpunk inverse dotted">经典的赛博朋克角色是边缘且性格疏远的独行者。他们生活在社会群体的边缘，一个弥漫反乌托邦氛围的未来：日常生活受到急剧改变的科技影响，普及的计算机化信息笼罩全球，以及侵入性的人体改造。</p>
<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
  </div>
</template>

<script setup>
import { reactive, computed, ref, defineProps } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";



</script>
<style lang="less" scoped>
@import "../css/tab/segmented.css";
@import "../css/global/cyberpunk.less";

</style>