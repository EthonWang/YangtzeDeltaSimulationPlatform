import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { dragMove, dragResize } from "./components/directives";
import '@/css/font/font.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import dataV from '@jiaminghi/data-view'
import ViewUIPlus from 'view-ui-plus'
import 'view-ui-plus/dist/styles/viewuiplus.css'
import uploader from 'vue-simple-uploader';



const app = createApp(App);
app.use(ElementPlus);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
// app.component()
app.use(store);
app.use(router);
app.use(ViewUIPlus);
app.use(uploader);
app.mount("#app");
app.use(dragMove); // 窗口拖动
// app.use(dragResize); // 窗口缩放

app.use(dataV)

