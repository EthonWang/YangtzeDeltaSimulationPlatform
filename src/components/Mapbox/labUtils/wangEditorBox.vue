<template>
  <div id="wangeditor">
    <div ref="editorElem"></div>
  </div>
</template>

<script>
import axios from "axios";
import E from "wangeditor";
export default {
  data() {
    return {
      editor: null,
      txtContent: "",
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
        .get("http://172.21.212.63:8999" + this.txtInfo.data.fileWebAddress)
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
      // txtData = txtData.replace(/(\r\n)|(\n)/g,'<br>');
      this.editor.txt.html(txtData);
      this.editor.config.onchange = (html) => {
        // console.log(html);
        this.$emit("saveTxtHtml",html);
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