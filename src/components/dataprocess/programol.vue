<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header">
        <h2>{{ workspace.userName }}的工作空间</h2>
        <div>
          <span style="font-size: 18px; font-weight: 600"
            >项目选择:&nbsp;&nbsp;</span
          >
          <el-select
            v-model="workspace.projectSelId"
            class="m-2"
            placeholder="请选择您的项目"
            size="large"
            @change="projectChange"
            ref="projSel"
          >
            <el-option
              v-for="item in workspace.projectOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-button
            type="primary"
            plain
            style="margin-left: 10px"
            @click="createProject"
          >
            创建新项目
          </el-button>
          <el-button
            type="danger"
            plain
            style="margin-left: 10px"
            @click="ProjectDeletedata.projectDeleteDialogShow = true"
            :disabled="workspace.projectSelId == ''"
          >
            删除该项目
          </el-button>
        </div>
      </el-header>
      <el-container
        v-loading="workspace.loading"
        element-loading-text="项目开启中，请稍后..."
      >
        <el-aside
          width="250px"
          class="aside"
          :style="{
            boxShadow: '--el-box-shadow-lighter',
          }"
        >
          <div class="btnbox">
            <div class="left">
              <span>项目:{{ projectdata.projectName }}</span>
            </div>
            <div class="btns">
              <el-upload
                :show-file-list="false"
                class="upload-demo"
                action=""
                :limit="1"
                :before-upload="uploadfile"
                :auto-upload="true"
              >
                <el-icon size="21px" class="icon" title="上传文件"
                  ><Upload
                /></el-icon>
              </el-upload>
              <el-icon
                @click="downloadfile"
                size="21px"
                class="icon"
                title="下载代码"
                ><Download
              /></el-icon>
              <el-icon
                size="21px"
                class="icon"
                title="新建文件"
                @click="createfile"
                ><DocumentAdd
              /></el-icon>
              <el-icon
                size="21px"
                class="icon"
                title="新建文件夹"
                @click="createfolder"
                ><FolderAdd
              /></el-icon>
            </div>
          </div>
          <el-tree
            ref="tree"
            :data="projectdata.projectDirectory"
            :props="projectdata.defaultProps"
            @node-click="handleNodeClick"
            @node-contextmenu="handleNodeContext"
            node-key="filePath"
            :current-node-key="projectdata.currentnode"
          />
          <div
            id="contextmenu"
            v-show="menuContextdata.foldervisible"
            class="menu folder"
          >
            <div class="contextmenu__item" @click="openfile">打开</div>
            <div class="contextmenu__item" @click="createfolder">
              新建文件夹
            </div>
            <div class="contextmenu__item" @click="createfile">新建文件</div>
            <div class="contextmenu__item" @click="deletefile">删除</div>
            <el-upload
              :show-file-list="false"
              class="upload-demo contextmenu__item"
              action=""
              :limit="1"
              :before-upload="uploadfile"
              :auto-upload="true"
            >
              <div>上传文件</div>
            </el-upload>
            <div class="contextmenu__item" @click="downloadfile">下载</div>
            <div class="contextmenu__item" @click="renamefile">重命名</div>
          </div>
          <div
            id="contextmenu"
            v-show="menuContextdata.filevisible"
            class="menu file"
          >
            <div class="contextmenu__item" @click="openfile">打开</div>
            <div class="contextmenu__item" @click="deletefile">删除</div>
            <div class="contextmenu__item" @click="renamefile">重命名</div>
            <div class="contextmenu__item" @click="downloadfile">下载</div>
            <div class="contextmenu__item" @click="addToLab">
              添加数据至实验室
            </div>
          </div>
        </el-aside>
        <el-container>
          <el-main>
            <el-tabs
              v-model="Tabdata.editableTabsValue"
              type="card"
              class="demo-tabs"
              closable
              @tab-remove="removeTab"
              @tab-change="tabchange"
            >
              <el-tab-pane
                v-for="item in Tabdata.editableTabs"
                :key="item.name"
                :label="item.title"
                :name="item.name"
              >
              </el-tab-pane>
            </el-tabs>
            <div class="content">
              <codemirror
                class="codemirror"
                ref="cm"
                :autofocus="CMdata.CMConfig.autofocus"
                :placeholder="CMdata.CMConfig.placeholder"
                :indentWithTab="CMdata.CMConfig.indentWithTab"
                :tabSize="CMdata.CMConfig.tabSize"
                :disabled="CMdata.CMConfig.disabled"
                :style="{
                  backgroundColor: CMdata.CMConfig.backgroundColor,
                  height: '400px',
                }"
                :extensions="extensions"
                :phrases="{}"
                v-model="codedata.code"
                @ready="handleReady"
                @change="consoleLog('change', $event)"
                @focus="consoleLog('focus', $event)"
                @blur="consoleLog('blur', $event)"
              />
            </div>
          </el-main>
          <el-footer class="footer" height="315px">
            <div class="res">
              <el-row>
                <el-col :span="24" class="outputcol">
                  <div class="outputbox">
                    {{ Outputdata.output }}
                  </div>
                </el-col>
                <!-- <el-col :span="12"> <div id="mycanvas"></div></el-col> -->
              </el-row>

              <!-- If you want turtle graphics include a canvas -->
            </div>
            <div class="btnss">
              <el-button
                type="primary"
                plain
                @click="savedit"
                :disabled="Tabdata.editableTabsValue == ''"
                >保存编辑</el-button
              >
              <el-button
                @click="donwloadDep"
                type="primary"
                plain
                :disabled="
                  workspace.projectSelId == '' &&
                  !projectdata.isrunning &&
                  !projectdata.isdownloading
                "
                >下载依赖</el-button
              >
              <el-button
                type="success"
                plain
                @click="runit"
                :disabled="
                  workspace.projectSelId == '' &&
                  !projectdata.isrunning &&
                  !projectdata.isdownloading
                "
                >运行</el-button
              >
              <el-button
                type="warning"
                plain
                @click="stopit"
                :disabled="
                  (workspace.projectSelId == '' &&
                    !projectdata.isdownloading) ||
                  !projectdata.isrunning
                "
                >停止运行</el-button
              >
            </div>
          </el-footer>
        </el-container>
      </el-container>
    </el-container>
    <el-dialog
      v-model="FolderCreatedata.folderCreateDialogShow"
      title="输入文件夹名称"
      width="400px"
    >
      <el-input v-model="FolderCreatedata.folderName"></el-input>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="CreateFolderCancel">取消</el-button>
          <el-button type="primary" @click="CreateFolderConfirm">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      v-model="FileCreatedata.fileCreateDialogShow"
      title="输入文件名称"
      width="400px"
    >
      <el-input v-model="FileCreatedata.fileName"></el-input>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="CreateFileCancel">取消</el-button>
          <el-button type="primary" @click="CreateFileConfirm">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      v-model="projectCreatedata.projectCreateDialogShow"
      title="创建新项目"
      width="400px"
    >
      <span>项目名称</span>
      <el-input v-model="projectCreatedata.projectName"></el-input>
      <div>版本</div>
      <el-select
        v-model="projectCreatedata.pythonValue"
        class="m-2"
        placeholder="请选择python版本"
        size="large"
      >
        <el-option
          v-for="item in projectCreatedata.pythonOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="projectCreatedata.projectCreateDialogShow = false"
            >取消</el-button
          >
          <el-button type="primary" @click="projectCreateConfirm">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      v-model="ProjectDeletedata.projectDeleteDialogShow"
      title="确认要删除该项目吗？"
      width="400px"
    >
      <span style="font-size: 20px">项目名称： </span>
      <span>{{ projectdata.projectName }}</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="ProjectDeletedata.projectDeleteDialogShow = false"
            >取消</el-button
          >
          <el-button type="primary" @click="deleteProject"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      v-model="FileRenamedata.fileRenameDialogShow"
      title="输入新名称"
      width="400px"
    >
      <el-input v-model="FileRenamedata.fileName"></el-input>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="RenameFileCancel">取消</el-button>
          <el-button type="primary" @click="RenameFileConfirm">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { Codemirror } from "vue-codemirror";
import { reactive, ref, computed, onMounted, onUnmounted, watch } from "vue";
import { Encrypt, Decrypt } from "@/util/codeUtil";
import {
  DocumentAdd,
  Download,
  FolderAdd,
  Upload,
} from "@element-plus/icons-vue";
import {
  Tree,
  CMData,
  projectData,
  TabData,
  menuContextData,
  FolderCreateData,
  FileCreateData,
  NodeContextData,
  ProjectCreateData,
  ProjectDeleteData,
  FileRenameData,
  CodeData,
  OutputData,
  Project,
  WorkSpace,
  Createfile,
} from "@/type/programol";
import Api from "@/api/user/programol";
import { ElMessage } from "element-plus";

//api
const api = new Api();
//local
const userInfo = reactive(
  JSON.parse(Decrypt(localStorage.getItem("userInfo")))
);
//Data
const CMdata = reactive(new CMData());
const projectdata = reactive(new projectData());
const Tabdata = reactive(new TabData());
const menuContextdata = reactive(new menuContextData());
const FolderCreatedata = reactive(new FolderCreateData());
const FileCreatedata = reactive(new FileCreateData());
const NodeContextdata = reactive(new NodeContextData());
const projectCreatedata = reactive(new ProjectCreateData());
const ProjectDeletedata = reactive(new ProjectDeleteData());
const FileRenamedata = reactive(new FileRenameData());
const workspace = reactive(new WorkSpace());
const codedata = reactive(new CodeData());
const Outputdata = reactive(new OutputData());
const tree = ref();
const projSel = ref();
const extensions = computed(() => {
  const result = [];
  result.push(CMdata.languages[CMdata.CMConfig.language]);
  if (CMdata.themes[CMdata.CMConfig.theme]) {
    result.push(CMdata.themes[CMdata.CMConfig.theme]);
  }
  return result;
});
// let code = ref("print('hello world')");
//methods
//获取workspace数据包括项目列表、用户名等
const getWorkSpaceData = () => {
  api.OpenWorkSpace(userInfo.id).then((res) => {
    if (res.data.code == 0) {
      workspace.userName = res.data.data.userName;
      workspace.projectOption = res.data.data.projectOption;
    }
  });
};
getWorkSpaceData();
//打开某个项目，初始化文件夹列表
const openproject = () => {
  workspace.loading = true;
  api.OpenProject(workspace.projectSelId).then((res) => {
    consoleLog(res);
    if (res.data.code == 0) {
      ElMessage({ message: "开启项目成功", type: "success" });
      projectdata.projectName = res.data.data.projectName;
      projectdata.projectDirectory = res.data.data.programFileDTO;
      NodeContextdata.currentNodeFolder =
        "E:/workspace/" + userInfo.id + "/" + projectdata.projectName;
      NodeContextdata.currentNodeId = projectdata.projectDirectory[0].id;
      projectdata.containerStatus = true;
      Tabdata.editableTabs = [];
      codedata.code = "";
      workspace.loading = false;
      // startWatch();
    } else {
      ElMessage({ message: "开启项目失败", type: "error" });
    }
  });
};
let timer = null;
const startTimer = () => {
  timer = setTimeout(() => {
    if (projectdata.containerStatus) {
      consoleLog(123123);
      ElMessage({ message: "长时间未操作关闭容器", type: "warning" });
      api.stopContainer(workspace.projectSelId).then((res) => {
        consoleLog(res);
        projectdata.containerStatus = false;
      });
    }
  }, 10 * 60 * 1000);
};
const resetTimer = () => {
  // consoleLog(123456);
  if (timer) {
    clearTimeout(timer);
  }
  if (!projectdata.containerStatus) {
    openproject();
    projectdata.containerStatus = true;
  }
  startTimer();
};
const startWatch = () => {
  // consoleLog(111111);
  document.addEventListener("mousedown", resetTimer);
  document.addEventListener("mousemove", resetTimer);
  document.addEventListener("keydown", resetTimer);
  document.addEventListener("scroll", resetTimer);
  startTimer();
};
// onUnmounted(() => {
//   document.removeEventListener("mousedown", resetTimer);
//   document.removeEventListener("mousemove", resetTimer);
//   document.removeEventListener("keydown", resetTimer);
//   document.removeEventListener("scroll", resetTimer);
//   if (timer) {
//     clearTimeout(timer);
//   }
//   if (projectdata.containerStatus) {
//     api.stopContainer(workspace.projectSelId);
//   }
// });
const consoleLog = console.log;
const handleReady = (payload: any) => {
  console.log("handleReady payload:", payload);
};

// const outf = (text) => {
//   var mypre = document.getElementById("output");
//   mypre.innerHTML = mypre.innerHTML + text;
// };
const addTab = (id: string, tablabel: string) => {
  Tabdata.editableTabs.push({
    title: tablabel,
    name: id,
  });
  Tabdata.editableTabsValue = id;
};
const removeTab = (targetName: string) => {
  const tabs = Tabdata.editableTabs;
  let activeName = Tabdata.editableTabsValue;
  if (activeName === targetName) {
    tabs.forEach((tab, index) => {
      if (tab.name === targetName) {
        const nextTab = tabs[index + 1] || tabs[index - 1];
        if (nextTab) {
          activeName = nextTab.name;
        } else {
          codedata.code = "";
          activeName = "";
        }
      }
    });
  }

  Tabdata.editableTabsValue = activeName;
  Tabdata.editableTabs = tabs.filter((tab) => tab.name !== targetName);
};
const tabchange = (TabPaneName) => {
  // consoleLog(TabPaneName);
  codedata.code = codedata.codeMap.get(TabPaneName);
};
//更换项目，也就是打开另一个项目
const projectChange = () => {
  consoleLog(workspace.projectSelId);
  openproject();
  consoleLog(projSel.value);
  Outputdata.output = "";
  // tree.value.setCurrentNode(node);
};
//文件夹目录点击事件
const handleNodeClick = (data: Tree) => {
  NodeContextdata.currentNodeId = data.id;
  if (data.type == "folder") {
    NodeContextdata.currentNodeFolder = data.filePath;
    NodeContextdata.currentNodeFile = null;
  } else if (data.type == "file") {
    NodeContextdata.currentNodeFile = data.filePath;
    NodeContextdata.currentNodeFolder = null;
  }
  // consoleLog(node);
  // tree.value.setCurrentNode(node, true);
};
//文件夹目录右键事件
const handleNodeContext = (event, data, node, self) => {
  NodeContextdata.nodeEvent = event;
  NodeContextdata.nodeData = data;
  NodeContextdata.nodeElement = null;
  NodeContextdata.currentNodeId = data.id;
  if (data.type == "folder") {
    NodeContextdata.currentNodeFolder = data.filePath;
    NodeContextdata.currentNodeFile = null;
    NodeContextdata.nodeElement = event.target.closest(
      ".el-tree-node__content"
    );
    menuContextdata.foldervisible = false; // 先把模态框关死，目的是 第二次或者第n次右键鼠标的时候 它默认的是true
    menuContextdata.foldervisible = true; // 显示模态窗口，跳出自定义菜单栏
    event.preventDefault(); //关闭浏览器右键默认事件
    let menu = document.querySelector(".folder");
    styleMenu(menu, event, data);
  } else {
    NodeContextdata.currentNodeFile = data.filePath;
    NodeContextdata.currentNodeFolder = null;
    menuContextdata.filevisible = false; // 先把模态框关死，目的是 第二次或者第n次右键鼠标的时候 它默认的是true
    menuContextdata.filevisible = true; // 显示模态窗口，跳出自定义菜单栏
    event.preventDefault(); //关闭浏览器右键默认事件
    let menu = document.querySelector(".file");
    styleMenu(menu, event, data);
  }
};
//设置contextmenu的位置
const styleMenu = (menu, e, data) => {
  if (data.type == "folder") {
    document.addEventListener("click", foofolder); // 给整个document新增监听鼠标事件，点击任何位置执行foo方法
    menu.style.top = e.layerY + 50 + "px";
    menu.style.left = e.layerX + "px";
  }
  if (data.type == "file") {
    document.addEventListener("click", foofile); // 给整个document新增监听鼠标事件，点击任何位置执行foo方法
    menu.style.top = e.layerY + 50 + "px";
    menu.style.left = e.layerX + "px";
  }
};
//点击别的地方，contextmenu就不显示
const foofolder = () => {
  // 取消鼠标监听事件 菜单栏
  menuContextdata.foldervisible = false;
  document.removeEventListener("click", foofolder); // 关掉监听，
};
//同上
const foofile = () => {
  // 取消鼠标监听事件 菜单栏
  menuContextdata.filevisible = false;
  document.removeEventListener("click", foofile); // 关掉监听，
};
//打开文件或者文件夹
const openfile = () => {
  if (NodeContextdata.nodeData.type == "folder") {
    NodeContextdata.nodeElement.click();
  } else {
    if (
      Tabdata.editableTabs.some(
        (item) => item.name == NodeContextdata.currentNodeId
      )
    ) {
      codedata.code = codedata.codeMap.get(NodeContextdata.currentNodeId);
      Tabdata.editableTabsValue = NodeContextdata.currentNodeId;
    } else {
      api.openFile(NodeContextdata.currentNodeId).then((res) => {
        consoleLog(res);
        // code.value = res.data.data;
        codedata.codeMap.set(NodeContextdata.currentNodeId, res.data.data);
        addTab(NodeContextdata.currentNodeId, NodeContextdata.nodeData.label);
        // addTab()
      });
    }

    consoleLog(NodeContextdata.nodeData.label);
  }
  closeMenu();
};
//创建项目
const createProject = () => {
  projectCreatedata.projectName = "";
  projectCreatedata.pythonValue = "";
  projectCreatedata.projectCreateDialogShow = true;
};
//确认创建
const projectCreateConfirm = () => {
  let project = new Project();
  project.projectName = projectCreatedata.projectName;
  project.pythonVersion = projectCreatedata.pythonValue;
  project.userId = userInfo.id;
  project.workspace = userInfo.id;
  api.CreateProject(project).then((res) => {
    consoleLog(res);
    if (res.code == 0) {
      projectdata.projectName = res.data.projectName;
      workspace.projectSelId = res.data.projectId;
      projectdata.projectDirectory = res.data.programFileDTO;
    }
    getWorkSpaceData();
  });
  projectCreatedata.projectCreateDialogShow = false;
};
//删除项目
const deleteProject = () => {
  api.DeleteProject(workspace.projectSelId).then((res) => {
    if (res.data.code == 0) {
      ElMessage({ message: res.data.data, type: "success" });
      getWorkSpaceData();
      projectdata.projectDirectory = [];
      projectdata.projectName = "";
    } else {
      ElMessage({ message: res.data, type: "error" });
    }
  });
  ProjectDeletedata.projectDeleteDialogShow = false;
};
//创建文件夹
const createfolder = () => {
  // 处理创建文件夹的逻辑
  if (workspace.projectSelId != "") {
    FolderCreatedata.folderName = "";
    FolderCreatedata.folderCreateDialogShow = true;
  } else {
    ElMessage({ message: "请先创建或选择项目", type: "warning" });
  }

  closeMenu();
};
//取消创建
const CreateFolderCancel = () => {
  FolderCreatedata.folderName = "";
  FolderCreatedata.folderCreateDialogShow = false;
};
//确认创建
const CreateFolderConfirm = () => {
  if (
    NodeContextdata.currentNodeFolder == null ||
    NodeContextdata.currentNodeId == null
  ) {
    // NodeContextdata.currentNodeFolder =
    //   "W:/YangtzeDataStore/workspace/" +
    //   userInfo.id +
    //   "/" +
    //   projectdata.projectName;
    NodeContextdata.currentNodeFolder =
      "E:/workspace/" + userInfo.id + "/" + projectdata.projectName;
    NodeContextdata.currentNodeId = projectdata.projectDirectory[0].id;
  }
  let file = new Createfile();
  file.fileName = FolderCreatedata.folderName;
  file.filePath =
    NodeContextdata.currentNodeFolder + "/" + FolderCreatedata.folderName;
  file.isFolder = true;
  file.projectName = projectdata.projectName;
  file.userId = userInfo.id;
  // file.parentId=
  file.parentId = NodeContextdata.currentNodeId;
  api.CreateFile(file).then((res) => {
    consoleLog(res);
    if (res.code == 0) {
      ElMessage({ message: res.data, type: "success" });
    } else {
      ElMessage({ message: res.data, type: "error" });
    }
    openproject();
    FolderCreatedata.folderCreateDialogShow = false;
  });
};
//创建文件
const createfile = () => {
  // 处理创建文件的逻辑
  if (workspace.projectSelId != "") {
    FileCreatedata.fileName = "";
    FileCreatedata.fileCreateDialogShow = true;
  } else {
    ElMessage({ message: "请先创建或选择项目", type: "warning" });
  }
  closeMenu();
};
//取消创建
const CreateFileCancel = () => {
  FileCreatedata.fileName = "";
  FileCreatedata.fileCreateDialogShow = false;
};
//确认创建
const CreateFileConfirm = () => {
  if (
    NodeContextdata.currentNodeFolder == null ||
    NodeContextdata.currentNodeId == null
  ) {
    // NodeContextdata.currentNodeFolder =
    //   "W:/YangtzeDataStore/workspace/" +
    //   userInfo.id +
    //   "/" +
    //   projectdata.projectName;
    NodeContextdata.currentNodeFolder =
      "E:/workspace/" + userInfo.id + "/" + projectdata.projectName;
    NodeContextdata.currentNodeId = projectdata.projectDirectory[0].id;
  }
  let file = new Createfile();
  file.fileName = FileCreatedata.fileName;
  file.filePath =
    NodeContextdata.currentNodeFolder + "/" + FileCreatedata.fileName;
  file.isFolder = false;
  file.projectName = projectdata.projectName;
  file.userId = userInfo.id;
  file.parentId = NodeContextdata.currentNodeId;
  api.CreateFile(file).then((res) => {
    // consoleLog(res);
    if (res.code == 0) {
      ElMessage({ message: res.data, type: "success" });
    } else {
      ElMessage({ message: res.data, type: "error" });
    }
    openproject();
    FileCreatedata.fileCreateDialogShow = false;
  });
};
//删除文件
const deletefile = () => {
  api.DeleteFile(NodeContextdata.currentNodeId).then((res) => {
    if (res.data.code == 0) {
      ElMessage({ message: res.data.data, type: "success" });
    } else {
      ElMessage({ message: res.data.data, type: "error" });
    }
    openproject();
    consoleLog(res);
  });
  closeMenu();
};
//重命名文件
const renamefile = () => {
  FileRenamedata.fileRenameDialogShow = true;
  FileRenamedata.fileName = NodeContextdata.nodeData.label;
  closeMenu();
};
//确认重命名
const RenameFileConfirm = () => {
  api
    .RenameFile(NodeContextdata.currentNodeId, FileRenamedata.fileName)
    .then((res) => {
      if (res.data.code == 0) {
        ElMessage({ message: res.data.data, type: "success" });
      } else {
        ElMessage({ message: res.data.data, type: "error" });
      }
      openproject();
      FileRenamedata.fileRenameDialogShow = false;
    });
};
//取消重命名
const RenameFileCancel = () => {
  FileRenamedata.fileName = "";
  FileRenamedata.fileRenameDialogShow = false;
};
//下载文件
const downloadfile = () => {
  if (workspace.projectSelId != "") {
    consoleLog(123123);
    api.downloadFile(NodeContextdata.currentNodeId);
  } else {
    ElMessage({ message: "请先创建或选择项目", type: "warning" });
  }
  closeMenu();
};

const uploadfile = (rowfile) => {
  if (workspace.projectSelId != "") {
    if (
      NodeContextdata.currentNodeFolder == null ||
      NodeContextdata.currentNodeId == null
    ) {
      // NodeContextdata.currentNodeFolder =
      //   "W:/YangtzeDataStore/workspace/" +
      //   userInfo.id +
      //   "/" +
      //   projectdata.projectName;
      NodeContextdata.currentNodeFolder =
        "E:/workspace/" + userInfo.id + "/" + projectdata.projectName;
      NodeContextdata.currentNodeId = projectdata.projectDirectory[0].id;
    }
    let form = new FormData();
    form.append("upFile", rowfile);
    api.uploadFile(NodeContextdata.currentNodeId, form).then((res) => {
      if (res.code == 0) {
        ElMessage({ message: res.data, type: "success" });
      } else {
        ElMessage({ message: res.data, type: "error" });
      }
      openproject();
    });
  } else {
    ElMessage({ message: "请先创建或选择项目", type: "warning" });
  }
  closeMenu();
};
const closeMenu = () => {
  menuContextdata.filevisible = false;
  menuContextdata.foldervisible = false;
};
//将所有结果数据加载至实验室中
const addToLab = () => {
  consoleLog("正在添加");
};
//保存编辑
const savedit = () => {
  let form = new FormData();
  form.append("content", codedata.code);
  api.saveEdit(Tabdata.editableTabsValue, form).then((res) => {
    consoleLog(res);
    if (res.code == 0) {
      ElMessage({ message: res.data, type: "success" });
    } else {
      ElMessage({ message: res.data, type: "error" });
    }
  });
};
//下载依赖
const donwloadDep = () => {
  ElMessage({ message: "开始下载", type: "success" });
  Outputdata.output = "";
  Outputdata.output += "正在下载依赖";
  projectdata.isdownloading = true;
  const ws = new WebSocket(
    "ws://localhost:8999/websocket/" + workspace.projectSelId
  );
  ws.onmessage = function (event) {
    // 接收到来自服务器的消息
    var message = event.data;
    console.log(message); // 将消息打印到控制台
    Outputdata.output += " \n";
    Outputdata.output += message;
  };
  api.donwloadDep(workspace.projectSelId).then((res) => {
    consoleLog(res);
    if (res.data.code == 0) {
      ElMessage({ message: res.data.data, type: "success" });
    } else {
      ElMessage({ message: res.data.data, type: "error" });
    }
    projectdata.isdownloading = false;
    ws.close();
    // Outputdata.output += "运行结束";
  });
};
//run
const runit = () => {
  ElMessage({ message: "开始运行", type: "success" });
  Outputdata.output = "";
  Outputdata.output += "正在运行";
  projectdata.isrunning = true;
  //ws
  const ws = new WebSocket(
    "ws://localhost:8999/websocket/" + workspace.projectSelId
  );
  ws.onmessage = function (event) {
    // 接收到来自服务器的消息
    var message = event.data;
    console.log(message); // 将消息打印到控制台
    Outputdata.output += " \n";
    Outputdata.output += message;
  };
  api.runDemo(workspace.projectSelId).then((res) => {
    openproject();
    if (res.data.code == 0) {
      ElMessage({ message: res.data.data, type: "success" });
    } else {
      ElMessage({ message: res.data.data, type: "error" });
    }
    projectdata.isrunning = false;
    ws.close();
    Outputdata.output += "\n运行结束";
  });
};
//stop
const stopit = () => {
  api.stopDemo(workspace.projectSelId).then((res) => {
    consoleLog(res);
    projectdata.isrunning = false;
  });
};
//watch,如果项目变化了的话，就把前一个项目的容器给关了
watch(
  () => workspace.projectSelId,
  (newValue, oldValue) => {
    console.log(
      `Previous project selected: ${oldValue}, new project selected: ${newValue}`
    );
    api.stopContainer(oldValue).then((res) => {
      consoleLog(res);
    });
  }
);
</script>

<style scoped lang="less">
.content {
  width: 100%;
  .codemirror .cm-editor {
    width: 30vw;
    height: 50vh;
    margin: 0 1rem;
    border: 1px solid #ddd;
  }
}
.header {
  display: flex;
  justify-content: space-between;
}
.aside {
  // border: 1px solid #dcdcdc;
  // box-shadow: --el-box-shadow-lighter;
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.12);
  position: relative;
  .contextmenu__item {
    display: block;
    line-height: 34px;
    text-align: center;
  }
  .contextmenu__item:not(:last-child) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
  .menu {
    position: absolute;
    background-color: #fff;
    width: 100px;
    /*height: 106px;*/
    font-size: 12px;
    color: #444040;
    border-radius: 4px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border-radius: 3px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
    white-space: nowrap;
    z-index: 1000;
  }
  .contextmenu__item:hover {
    cursor: pointer;
    background: #66b1ff;
    border-color: #66b1ff;
    color: #fff;
  }
}
.btnbox {
  display: flex;
  padding: 5px;
  margin-bottom: 10px;
  margin-top: 10px;
  justify-content: space-between;
  align-content: center;
  align-items: center;
  // border: 1px solid #dcdcdc;
  height: 30px;
  // background: linear-gradient(0deg, rgba(0, 0, 0, 0.02), rgba(0, 0, 0, 0.02)),
  // #fafafa;
  .left {
    line-height: 30px;
    font-size: 15px;
    font-weight: 400;
  }
  .btns {
    width: 98px;
    display: flex;
    justify-content: space-between;
    align-content: center;
    align-items: center;
    line-height: 30px;
    height: 30px;
  }
  .upload-demo {
    display: flex;
    justify-content: space-between;
    align-content: center;
    align-items: center;
  }
  .icon:hover {
    color: rgb(28, 169, 224);
    cursor: pointer;
  }
}
.footer {
  display: flex;
  flex-direction: column;
  align-content: space-between;
  justify-content: space-between;
  .res {
    height: 80%;
    width: 100%;
    border: 1px solid rgba(0, 0, 0, 0.15);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
    background-color: #444040;
    color: #fff;
    .outputcol {
      display: flex;
      justify-content: center;
      align-content: center;
      justify-items: center;
      align-items: center;
      border-right: 1px solid #7c7777;
      .outputbox {
        white-space: pre-wrap;
        overflow: scroll;
        height: 250px;
        width: 80%;
      }
    }
  }
  .btnss {
    height: 12%;
    width: 80%;
    margin-left: 45%;
  }
}
</style>