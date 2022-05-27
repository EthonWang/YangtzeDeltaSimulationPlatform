import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { dragMove, dragResize } from "./components/directives";
import '@/css/font/font.css'

const app = createApp(App);
app.use(ElementPlus);
app.use(store);
app.use(router);
app.mount("#app");
app.use(dragMove); // 窗口拖动
// app.use(dragResize); // 窗口缩放
