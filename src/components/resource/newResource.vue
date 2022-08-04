<style scoped>
h1 {
  text-align: center;
  margin-top: 2%;
}
.main {
  margin-top: 7vh;
  height: 93vh;
  background-color: #fff;
}
.projectForm {
  width: 60%;
  margin-top: 40px;
  margin-left: 20%;
  margin-right: 20%;
}
.projectForm >>> .ivu-form-item-label {
  font-size: 16px;
}
.inline_style {
  display: flex;
}
.questionsSelect {
  width: 20vw;
}
.create {
  width: 20%;
  margin-right: 40%;
  margin-left: 40%;
}
#editor {
  /* position:fixed; */
  margin: 20px auto;
  bottom: 0;
  width: 80%;
  /* height: 200px; */
}
/* 上传图片 */
.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  /* overflow-x: hidden; */
  /* overflow-y: scroll; */
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
.uploadAvatar {
  position: relative;
  width: 58px;
  height: 58px;
  top: 0;
  left: 0;
  outline: none;
  background-color: transparent;
  opacity: 0;
}
.uploadBox {
  display: inline-block;
  width: 58px;
  height: 58px;
  line-height: 58px;
  border-width: 0.75px;
  border-style: dashed;
  border-color: lightslategray;
}

.uploader-example {
  width: 97%;
  padding: 5px;
  margin: 10px 0 10px 20px;
  font-size: 12px;
}

.uploader-example .uploader-btn {
  margin-right: 4px;
}

.uploader-example .uploader-list {
  max-height: 440px;
  overflow: auto;
  overflow-x: hidden;
  overflow-y: auto;
}

/* 结束 */
</style>
<template>
  <div class="main">
    <div class="project form">
      <h1>添加资源</h1>
      <div>
        <Form
          ref="formInline"
          :model="formInline"
          :rules="newProjectRule"
          class="projectForm"
        >
          <FormItem prop="resType" label="资源类别" :label-width="150">
            <RadioGroup v-model="formInline.resType" style="width: 80%">
              <Radio label="data" style="font-size: 14px">数据资源</Radio>
              <Radio label="model" style="font-size: 14px">模型资源</Radio>
              <Radio label="other" style="font-size: 14px">其他资源</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem prop="workName" label="资源名称" :label-width="150">
            <Input
              v-model="formInline.workName"
              placeholder="输入资源名称（少于 20 个字）..."
            />
          </FormItem>
          <FormItem prop="description" label="资源描述" :label-width="150">
            <Input
              v-model="formInline.description"
              type="textarea"
              placeholder="输入资源描述..."
            />
          </FormItem>
          <FormItem prop="description" label="资源描述" :label-width="150">
            <Input
              v-model="formInline.md5"
              type="textarea"
              placeholder="输入md5..."
            />
          </FormItem>
          <FormItem prop="description" label="资源描述" :label-width="150">
            <Input
              v-model="formInline.mdl"
              type="textarea"
              placeholder="输入mdl..."
            />
          </FormItem>
          <FormItem prop="problemTags" label="涉及问题选择" :label-width="150">
            <el-select
              v-model="formInline.problemTags"
              placeholder="请选择"
              class="questionsSelect"
              multiple
              collapse-tags
            >
              <el-option
                v-for="item in questionsSelectOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </FormItem>
          <FormItem prop="tagList" label="资源标签" :label-width="150">
            <!-- <el-input
              v-model="inputTag"
              placeholder="输入一些标签来描述作品..."
              style="width: 400px"
              @keyup.enter="addTag(inputTag)"
            /> -->
            <el-autocomplete
              class="inline-input"
              v-model="inputTag"
              :fetch-suggestions="querySearch"
              placeholder="输入一些标签来描述作品..."
              :trigger-on-focus="false"
              @select="handleSelect"
              @keyup.enter="addTag(inputTag)"
              style="width: 400px"
            ></el-autocomplete>
            <Button
              icon="ios-add"
              type="dashed"
              size="small"
              @click="addTag(inputTag)"
              style="margin-left: 2.5%"
              >添加标签</Button
            >
            <div>
              <Tag
                color="primary"
                v-for="(item, index) in this.formInline.tagList"
                :key="index"
                closable
                @on-close="deleteTag(index)"
                >{{ item }}</Tag
              >
            </div>
            <div>
              <Tag style="cursor: pointer" @click="addTag('地形')">地形</Tag>
              <Tag style="cursor: pointer" @click="addTag('土壤')">土壤</Tag>
              <Tag style="cursor: pointer" @click="addTag('海洋')">海洋</Tag>
              <Tag style="cursor: pointer" @click="addTag('气候')">气候</Tag>
              <Tag style="cursor: pointer" @click="addTag('生态')">生态</Tag>
              <Tag style="cursor: pointer" @click="addTag('地质')">地质</Tag>
              <Tag style="cursor: pointer" @click="addTag('水文')">水文</Tag>
              <Tag style="cursor: pointer" @click="addTag('社会经济')"
                >社会经济</Tag
              >
            </div>
          </FormItem>
          <FormItem
            prop="file"
            label="资源上传"
            :label-width="150"
            v-if="formInline.resType != 'model'"
          >
            <div style="width: 80%">
              <uploader
                :options="uploaderOptions"
                :autoStart="autoStart"
                :fileStatusText="{
                  success: '上传成功',
                  error: '上传失败',
                  uploading: '正在上传',
                  paused: '暂停上传',
                  waiting: '等待上传',
                }"
                @file-success="onFileSuccess"
                @file-added="fileAdded"
                @file-error="onFileError"
              >
                <uploader-unsupport></uploader-unsupport>
                <uploader-drop>
                  <uploader-btn :attrs="attrs" single>上传</uploader-btn>
                </uploader-drop>
                <uploader-list></uploader-list>
              </uploader>
            </div>
          </FormItem>

          <FormItem
            prop="visualType"
            label="数据类别"
            :label-width="150"
            v-if="formInline.resType == 'data'"
          >
            <RadioGroup v-model="formInline.visualType" style="width: 80%">
              <Radio label="shp" style="font-size: 14px">矢量</Radio>
              <Radio label="tif" style="font-size: 14px">栅格</Radio>
              <Radio label="txt" style="font-size: 14px">文本</Radio>
              <Radio label="img" style="font-size: 14px">图片</Radio>
              <Radio label="video" style="font-size: 14px">视频</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem
            prop="geoType"
            label="矢量数据类别"
            :label-width="150"
            v-if="
              formInline.resType == 'data' && formInline.visualType == 'shp'
            "
          >
            <RadioGroup v-model="formInline.geoType" style="width: 80%">
              <Radio label="circle" style="font-size: 14px">点</Radio>
              <Radio label="line" style="font-size: 14px">线</Radio>
              <Radio label="fill" style="font-size: 14px">面</Radio>
            </RadioGroup>
          </FormItem>
          <!-- <FormItem
            prop="visualFile"
            label="可视化文件上传"
            :label-width="150"
            v-if="formInline.resType == 'data'"
          >
            <div style="width: 300px">
              <Upload
                :max-size="1024 * 1024"
                multiple
                type="drag"
                :before-upload="gatherFile"
                action="-"
              >
                <div style="padding: 20px 0">
                  <Icon
                    type="ios-cloud-upload"
                    size="52"
                    style="color: #3399ff"
                  ></Icon>
                  <p>
                    点击或拖拽文件上传 ( 文件大小不超过
                    <span style="color: red">2GB</span>)
                  </p>
                </div>
              </Upload>
              <div
                style="
                  padding: 0 10px 0 10px;
                  max-height: 200px;
                  overflow-y: auto;
                "
              >
                <ul v-for="(list, index) in toUploadVisualFiles" :key="index">
                  <li style="display: flex">
                    文件名:
                    <span style="font-size: 10px; margin: 0 5px 0 5px"
                      >{{ list.name }} ( {{ list.fileSize }} )</span
                    >
                    <Icon
                      type="ios-close"
                      size="20"
                      @click="delFileList(index)"
                      style="
                        display: flex;
                        justify-content: flex-end;
                        cursor: pointer;
                      "
                    ></Icon>
                  </li>
                </ul>
              </div>
            </div>
          </FormItem> -->
          <FormItem prop="image" label="资源封面" :label-width="150">
            <div class="inline_style">
              <div class="demo-upload-list" v-if="img != ''">
                <!-- <template> -->
                <img v-bind:src="img" />
                <div class="demo-upload-list-cover">
                  <Icon type="ios-eye-outline" @click="handleView()"></Icon>
                  <Icon type="ios-trash-outline" @click="handleRemove()"></Icon>
                </div>
                <!-- </template> -->
              </div>
              <div class="uploadBox">
                <Icon
                  type="ios-camera"
                  size="20"
                  style="position: absolute; margin: 18px"
                ></Icon>
                <input
                  id="choosePicture"
                  @change="uploadPhoto($event)"
                  type="file"
                  class="uploadAvatar"
                  accept="image/*"
                />
              </div>
              <br />
            </div>
          </FormItem>
          <FormItem>
            <div class="inline_style" style="margin-top: 20px">
              <Button @click="back2List" style="margin-left: 37%; width: 150px"
                >取消</Button
              >
              <Button
                  v-if="formInline.resType == 'data'"
                  type="success"
                  @click="validateCreateProject('formInline')"
                  style="margin-left: 15px; width: 150px"
              >保存</Button
              >
              <Button
                v-if="formInline.resType == 'model'"
                type="success"
                @click="commitProjectModel()"
                style="margin-left: 15px; width: 150px"
                >保存</Button
              >
            </div>
          </FormItem>
        </Form>
      </div>
      <Modal title="View Image" v-model="visible">
        <img :src="img" v-if="visible" style="width: 100%" />
      </Modal>
    </div>
  </div>
</template>


<script>
import { useStore } from "vuex";
import axios from "axios";
import "./style.css";
// import { get, post, del, put } from "@/axios";

export default {
  data() {
    return {
      dataServer: useStore().getters.devIpAddress,
      formInline: {
        resType: "data",
        workName: "",
        md5:"",
        mdl:"",
        visualType: "shp",
        geoType: "circle",
        description: "",
        //tag列表
        tagList: [],
        problemTags: [],
        file: "",
      },
      questionsSelectOptions: [
        {
          value: "流域水循环及其驱动机制",
          label: "流域水循环及其驱动机制",
        },
        {
          value: "全球变化与区域环境演化",
          label: "全球变化与区域环境演化",
        },
        {
          value: "长三角灾害响应与治理",
          label: "长三角灾害响应与治理",
        },
        {
          value: "长三角城市化与人地关系协调发展",
          label: "长三角城市化与人地关系协调发展",
        },
      ],
      newProjectRule: {
        resType: [
          {
            required: true,
            message: "Please select category",
            trigger: "change",
          },
        ],
        workName: [
          {
            required: true,
            message: "The name cannot be empty and no more than 20 characters",
            trigger: "blur",
            max: 60,
          },
        ],
        visualType: [
          {
            required: true,
            message: "Please select category",
            trigger: "change",
          },
        ],
        geoType: [
          {
            required: true,
            message: "Please select category",
            trigger: "change",
          },
        ],
        problemTags: [
          {
            required: true,
            message: "Please select tag",
            trigger: "change",
          },
        ],
        tagList: [
          {
            required: true,
            message: "Please select tag",
            trigger: "blur",
          },
        ],
        file: [
          {
            required: true,
            message: "Please upload resource",
            trigger: "change",
          },
        ],
      },
      toUploadFiles: [],
      toUploadVisualFiles: [],
      fileCountTimer: null,
      //用来存储输入的单个标签变量
      inputTag: "",
      visible: false,
      tagTemplateList: [],
      useTagTemplate: "",
      saveTagTemplate: true,
      //表示图片
      img: "", //使用img来在新建页面临时显示图片
      pictureUrl: "", //使用pictureUrl来保留新建页面添加图片的url，用来上传
      imageFile: null,
      createProjectInfo: {},
      uploaderOptions: {
        target: this.dataServer+"/fileTransfer/upload", //上传地址
        chunkSize: 5 * 1024 * 1024,
        testChunks: false,
        simultaneousUploads: 1,
        headers: {
          //设置header,
        },
        singleFile: true,
        query: {
          //传参,没有可以不传
          // folderId: this.folderIdStack[0],
          // type: this.fileType,
        },
      },
      autoStart: true,
      attrs: {
        accept: "*", //接受文件类型
      },
      uploaderRes: {},
      restaurants: [
        { value: "基础地理", label: "基础地理" },
        { value: "土地利用/覆盖", label: "土地利用/覆盖" },
        { value: "人口", label: "人口" },
        { value: "社会经济", label: "社会经济" },
        { value: "地形", label: "地形" },
        { value: "地貌", label: "地貌" },
        { value: "土壤", label: "土壤" },
        { value: "湖泊", label: "湖泊" },
        { value: "植被", label: "植被" },
        { value: "生态系统", label: "生态系统" },
        { value: "灾害", label: "灾害" },
        { value: "环境", label: "环境" },
        { value: "气候", label: "气候" },
        { value: "水文", label: "水文" },
        { value: "农业", label: "农业" },
        { value: "自然模拟", label: "自然模拟" },
        { value: "人类活动", label: "人类活动" },
        { value: "综合分析", label: "综合分析" },
        { value: "其他", label: "其他" },
        { value: "学术研究", label: "学术研究" },
        { value: "说明文档", label: "说明文档" },
      ],
    };
  },
  created() {
    // 加入判断，如果未登录自动跳转登录页面
    // if (!this.$store.getters.userState) {
    //   this.$router.push({ name: "Login" });
    // }
    // Array.prototype.contains = function (obj) {
    //   var i = this.length;
    //   while (i--) {
    //     if (this[i] != undefined && this[i] === obj) {
    //       return true;
    //     }
    //   }
    //   return false;
    // };
  },
  mounted() {
    // this.checkUserRole();
    // this.getTagTemplateByType("Image");
  },
  methods: {
    checkUserRole() {
      //根据userId重新请求后台数据库，验证角色
      let role = JSON.parse(localStorage.getItem("userInfo")).role;
      if (role != "admin") {
        this.$router.go(-1);
        this.$Message.error("您不是管理员，没有权限进行该操作！");
      }
    },
    validateCreateProject(name) {
      //   this.$refs[name].validate((valid) => {
      //     if (valid) {
      //       this.commitProject();
      //     } else {
      //
      //     }
      //   });
      console.log(this.formInline);
      console.log(this.uploaderRes);
      if (
        this.formInline.workName != "" &&
        this.formInline.visualType != "" &&
        this.formInline.geoType != "" &&
        this.formInline.problemTags != [] &&
        this.formInline.tagList != [] &&
        this.uploaderRes.code == 0 &&
        this.formInline.resType == "data"
      ) {
        this.commitProjectData();
      } else if (
        this.formInline.workName != "" &&
        this.formInline.problemTags != [] &&
        this.formInline.tagList != [] &&
        
        this.formInline.resType == "model"
      ) {
        this.commitProjectData();
      } else {
        this.$Message.error("创建失败，请检查填写的内容！");
      }
    },
    commitProjectData() {
      // 将已经上传至chunk区的文件或压缩包进行保存
      let uploaderRes = this.uploaderRes;
      if (this.formInline.resType == "data") {
        let formData = new FormData();
        let info = {};
        info.name = this.formInline.workName;
        info.description = this.formInline.description;
        info.type = this.formInline.resType;
        info.normalTags = this.formInline.tagList.toString();
        info.problemTags = this.formInline.problemTags.toString();
        info.publicBoolean = true;
        info.visualizationBoolean = true;
        info.visualType = this.formInline.visualType;
        info.geoType = this.formInline.geoType;
        info.fileStoreName = uploaderRes.data.fileStoreName;
        info.fileSize = this.formInline.fileSize;
        info.fileOriginName = this.formInline.fileOriginName;

        formData.append("imgFile", this.imageFile);
        // formData.append("visualFile", this.toUploadVisualFiles[0]);
        formData.append(
          "info",
          new Blob([JSON.stringify(info)], { type: "application/json" })
        );

        axios({
          url: this.dataServer + "/saveResourceData",
          method: "post",
          //忽略contentType
          contentType: false,
          //取消序列换 formData本来就是序列化好的
          processData: false,
          dataType: "json",
          data: formData,
        }).then(
          (res) => {
            console.log(res.data);
            this.$router.go(-1);
          },
          (err) => {
            console.log(err);
          }
        );
      } else if (this.formInline.resType == "model") {
        console.log("come");
        let formData = new FormData();
        let info = {};
        info.name = this.formInline.workName;
        info.description = this.formInline.description;
        info.type = this.formInline.resType;
        info.normalTags = this.formInline.tagList.toString();
        info.problemTags = this.formInline.problemTags.toString();
        info.mdl = this.formInline.mdl;
        info.md5 = this.formInline.md5;
        info.mdlJson = {};

        formData.append("imgFile", this.imageFile);
        // formData.append("visualFile", this.toUploadVisualFiles[0]);
        console.log(info);
        formData.append(
          "info",new Blob([JSON.stringify(info)], { type: "application/json" })
        );

        axios({
          url: this.dataServer + "/createResourceModel",
          method: "post",
          //忽略contentType
          contentType: false,
          //取消序列换 formData本来就是序列化好的
          processData: false,
          dataType: "json",
          data: formData,
        }).then(
          (res) => {
            console.log(res.data);
            this.$router.go(-1);
          },
          (err) => {
            console.log(err);
          }
        );
      } else {
        confirm("Created project fail.");
      }
    },
    commitProjectModel() {
      console.log("come");
        let formData = new FormData();
        let info = {};
        info.name = this.formInline.workName;
        info.description = this.formInline.description;
        info.type = this.formInline.resType;
        info.normalTags = this.formInline.tagList.toString();
        info.problemTags = this.formInline.problemTags.toString();
        info.mdl = this.formInline.mdl;
        info.md5 = this.formInline.md5;
        info.mdlJson = {};

        formData.append("imgFile", this.imageFile);
        // formData.append("visualFile", this.toUploadVisualFiles[0]);
        console.log(info);
        formData.append(
          "info",new Blob([JSON.stringify(info)], { type: "application/json" })
        );

        axios({
          url: this.dataServer + "/createResourceModel",
          method: "post",
          //忽略contentType
          contentType: false,
          //取消序列换 formData本来就是序列化好的
          processData: false,
          dataType: "json",
          data: formData,
        }).then(
          (res) => {
            console.log(res.data);
            this.$router.go(-1);
          },
          (err) => {
            console.log(err);
          }
        );
    
      let searchInfo = {
        asc:false,
        page:1,
        pageSize:10,
        searchText:"",
        sortField:"createTime",
        tagClass:"problemTags",
        tagName:""
      }
      // axios.post(this.dataServer+"/getResourceModelList",searchInfo).then(res=>{
      //   console.log("查询结果",res)
      // })
    },
    //创建历史纪录的函数
    addHistoryEvent(scopeId) {
      let form = {};
      let description =
        this.$store.getters.userName +
        " created a " +
        this.formInline.category +
        " project named " +
        this.formInline.name;
      form["description"] = description; //此处的description可能有问题，应该使用createProjectInfo中的description
      form["scopeId"] = scopeId;
      form["eventType"] = "project";
      form["userId"] = this.$store.getters.userId;
      this.axios
        .post("/GeoProblemSolving/history/save", form)
        .then((res) => {
          if (res.data === "Success") {
            window.location.href = "/GeoProblemSolving/projectInfo/" + scopeId;
          } else {
            confirm("Created project fail.");
          }
        })
        .catch((err) => {
          console.log(err.data);
        });
    },
    addTag(tag) {
      if (tag != "" && this.formInline.tagList.toString().indexOf(tag) == -1) {
        this.formInline.tagList.push(tag);
        this.inputTag = "";
        this.useTagTemplate = "";
      }
    },
    deleteTag(index) {
      this.formInline.tagList.splice(index, 1);
    },
    pushTagTemplate(value) {
      console.log(value);
      if (value != undefined) {
        this.formInline.tagList = [];
        let list = value.split(",");
        for (let i = 0; i < list.length; i++) {
          this.formInline.tagList.push(list[i]);
        }
      }
    },
    uploadPhoto(e) {
      let file = e.target.files[0];
      let filesize = file.size;
      if (filesize > 2101440) {
        // 图片大于2MB
        this.$Message.error("size > 2MB");
      } else {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          this.img = e.target.result;
          this.pictureUrl = e.target.result;
          this.imageFile = file;
        };
      }
    },
    handleView() {
      this.visible = true;
    },
    handleRemove() {
      this.img = "";
      this.pictureUrl = "";
      this.imageFile = null;
    },
    back2List() {
      this.$router.go(-1);
    },
    //大文件上传所需
    fileAdded(file) {
      //选择文件后暂停文件上传，上传时手动启动
      file.pause();
    },
    gatherFile(file) {
      let that = this;
      if (that.toUploadVisualFiles.length >= 5) {
        if (this.fileCountTimer != null) {
          clearTimeout(this.fileCountTimer);
        }
        this.fileCountTimer = setTimeout(() => {
          this.$Message.info("最多只能上传5个文件");
        }, 500);
      } else {
        var fileSize = file.size;
        if (fileSize < 1024) {
          file.fileSize = fileSize + "b";
        } else if (fileSize < 1024 * 1024) {
          file.fileSize = Math.round((fileSize / 1024) * 100) / 100 + "Kb";
        } else {
          file.fileSize =
            Math.round((fileSize / (1024 * 1024)) * 100) / 100 + "Mb";
        }
        that.toUploadVisualFiles.push(file);
      }
      return false;
    },
    delFileList(index) {
      this.toUploadVisualFiles.splice(index, 1);
    },
    onFileError(file) {
      console.log("error", file);
    },
    onFileSuccess(rootFile, file, response, chunk) {
      this.uploaderRes = JSON.parse(response);
      this.formInline.file = this.uploaderRes.data.fileStoreName;
      this.formInline.fileSize = this.uploaderRes.data.fileSize;
      this.formInline.fileOriginName = this.uploaderRes.data.fileOriginName;
    },
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    handleSelect(item) {
      this.addTag(item.value);
      this.inputTag = "";
    },
  },
};
</script>
