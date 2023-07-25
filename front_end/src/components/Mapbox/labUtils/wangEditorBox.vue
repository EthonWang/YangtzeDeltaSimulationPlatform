<template>
  <div id="wangeditor">
    <div ref="editorElem"></div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import axios from "axios";
import E from "wangeditor";
export default {
  data() {
    return {
      editor: null,
      txtContent: "",
      originalContent: "",
      dataServer: useStore().getters.devIpAddress,
    };
  },
  props: ["txtInfo"],
  mounted() {
    this.getTxtContent();
    // this.init();
  },
  methods: {
    getTxtContent() {
      axios
        .get(this.dataServer + this.txtInfo.data.fileWebAddress)
        .then((res) => {
          this.txtContent = res.data;
          this.init();
        });
    },
    init() {
      //methods里创建调用、或是mounted里面直接生产
      this.editor = new E(this.$refs.editorElem); //获取组件并构造编辑器
      //   this.editor.create(); // 创建富文本实例
      this.editor.config.menus = [
        "head", // 标题
        "bold", // 粗体
        "fontSize", // 字号
        "fontName", // 字体
        "italic", // 斜体
        "underline", // 下划线
        "strikeThrough", // 删除线
        "foreColor", // 文字颜色
        "backColor", // 背景颜色
        "link", // 插入链接
        "list", // 列表
        "justify", // 对齐方式
        "quote", // 引用
        // 'emoticon',  // 表情
        // 'image',  // 插入图片
        "table", // 表格
        // 'video',  // 插入视频
        "code", // 插入代码
        "undo", // 撤销
        "redo", // 重复
      ];
      this.editor.config.pasteFilterStyle = false; // 去除复制过来文本的默认样式
      this.editor.create(); // 创建富文本实例
      let txtData = this.txtContent.toString();
      this.editor.txt.html(txtData);
      //获取原始内容，以判断是否修改
      let txtElemId = this.editor.textElemId;
      let txtElemBox = document.getElementById(txtElemId);
      // console.log(txtElemBox.childNodes[0].innerHTML);
      this.originalContent = txtElemBox.childNodes[0].innerHTML;
      this.editor.config.onchange = (html) => {
        if (
          this.originalContent != txtElemBox.childNodes[0].innerHTML ||
          txtElemBox.childNodes.length > 1
        ) {
          this.$emit("saveTxtHtml", html, true);
        } else {
          this.$emit("saveTxtHtml", html, false);
        }
      };
    },
  },
};
</script>

<style>
#wangeditor {
  width: 100%;
  height: 100%;
}
</style>