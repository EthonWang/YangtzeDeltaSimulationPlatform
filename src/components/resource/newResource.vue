<style scoped>
h1 {
  text-align: center;
  margin-top: 2.5%;
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
  <div class="project form">
    <h1>创建新作品</h1>
    <div>
      <Form
        ref="formInline"
        :model="formInline"
        :rules="newProjectRule"
        class="projectForm"
      >
        <!-- 选择类别 -->
        <FormItem prop="type" label="作品类别" :label-width="100">
          <RadioGroup
            v-model="formInline.type"
            style="width: 80%"
            @on-change="changeTagTemplate"
          >
            <Radio label="Image" style="font-size: 18px">图像类</Radio>
            <Radio label="Video" style="font-size: 18px">视频类</Radio>
            <Radio label="Model" style="font-size: 18px">模型类</Radio>
            <Radio label="Website" style="font-size: 18px">网站类</Radio>
            <Radio label="music" style="font-size: 18px">音乐类</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem prop="workName" label="作品名称" :label-width="100">
          <Input
            v-model="formInline.workName"
            placeholder="输入作品名称（少于 20 个字）..."
          />
        </FormItem>
        <FormItem prop="description" label="作品描述" :label-width="100">
          <Input
            v-model="formInline.description"
            type="textarea"
            placeholder="输入作品描述..."
          />
        </FormItem>
        <FormItem prop="tagList" label="赏析模板" :label-width="100">
          <Input
            v-model="inputTag"
            placeholder="输入一些标签来描述作品..."
            style="width: 400px"
            @keyup.enter="addTag(inputTag)"
          />
          <Button
            icon="ios-add"
            type="dashed"
            size="small"
            @click="addTag(inputTag)"
            style="margin-left: 2.5%"
            >添加标签</Button
          >
          <Select
            v-model="useTagTemplate"
            style="width: 200px; margin-left: 15px"
            placeholder="从历史模板中选择"
            @on-change="pushTagTemplate"
          >
            <Option
              v-for="(tagItem, index) in tagTemplateList"
              :value="tagItem.value"
              :key="index"
              >{{ tagItem.label }}</Option
            >
          </Select>
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
          <!-- <div>
            <Tag style="cursor: pointer" @click.native="addTag('陆地')"
              >陆地</Tag
            >
            <Tag style="cursor: pointer" @click.native="addTag('沿海')"
              >沿海</Tag
            >
            <Tag style="cursor: pointer" @click.native="addTag('海洋')"
              >海洋</Tag
            >
            <Tag style="cursor: pointer" @click.native="addTag('气候')"
              >气候</Tag
            >
            <Tag style="cursor: pointer" @click.native="addTag('生态')"
              >生态</Tag
            >
            <Tag style="cursor: pointer" @click.native="addTag('地质')"
              >地质</Tag
            >
            <Tag style="cursor: pointer" @click.native="addTag('人类')"
              >人类</Tag
            >
            <Tag style="cursor: pointer" @click.native="addTag('GIS & RS')"
              >GIS & RS</Tag
            >
          </div> -->
          <Checkbox
            v-model="saveTagTemplate"
            v-if="
              formInline.tagList.length > 0 &&
              (useTagTemplate == '' || useTagTemplate == undefined)
            "
            >是否保存模板</Checkbox
          >
        </FormItem>
        <FormItem prop="file" label="资源上传" :label-width="100">
          <div style="width: 80%">
            <uploader
              :options="uploaderOptions"
              :autoStart="true"
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
          <!-- <Upload
            :max-size="1024 * 1024"
            type="drag"
            v-if="this.toUploadFiles.length == 0"
            :before-upload="gatherFile"
            action="-"
            style="width: 30%"
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
            style="padding: 0 10px 0 10px; max-height: 200px; overflow-y: auto"
            v-else
          >
            <ul v-for="(list, index) in toUploadFiles" :key="index">
              <li style="display: flex">
                File name:
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
          </div> -->
        </FormItem>
        <Alert
          type="warning"
          v-if="formInline.type == 'Model'"
          style="width: 70%; margin-left: 8%"
          >1.请上传模型文件的压缩文件，尽量使用英文命名。2.目前仅支持obj、pmx、fbx格式的模型。</Alert
        >
        <FormItem prop="image" label="作品封面" :label-width="100">
          <div class="inline_style">
            <div class="demo-upload-list" v-if="img != ''">
              <template>
                <img v-bind:src="img" />
                <div class="demo-upload-list-cover">
                  <Icon
                    type="ios-eye-outline"
                    @click="handleView()"
                  ></Icon>
                  <Icon
                    type="ios-trash-outline"
                    @click="handleRemove()"
                  ></Icon>
                </div>
              </template>
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
              type="success"
              @click="validateCreateProject('formInline')"
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
</template>


<script>
// import { get, post, del, put } from "@/axios";

export default {
  data() {
    return {
      formInline: {
        workName: "",
        type: "Image",
        description: "",
        //tag列表
        tagList: [],
        file: "",
      },
      newProjectRule: {
        workName: [
          {
            required: true,
            message: "The name cannot be empty and no more than 20 characters",
            trigger: "blur",
            max: 60,
          },
        ],
        type: [
          {
            required: true,
            message: "Please select category",
            trigger: "change",
          },
        ],
        // tagList: [
        //   {
        //     required: true,
        //     message: "Please select tag",
        //     trigger: "change",
        //   },
        // ],
        file: [
          {
            required: true,
            message: "Please upload resource",
            trigger: "change",
          },
        ],
      },
      toUploadFiles: [],
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
        target: "/visualResourceLibrary/work/bigFile/", //上传地址
        chunkSize: 5 * 1024 * 1024,
        testChunks: false,
        headers: {
          //设置header
          Authorization: JSON.parse(localStorage.getItem("userInfo")).token,
        },
        singleFile: true,
        query: {
          //传参,没有可以不传
          // folderId: this.folderIdStack[0],
          // type: this.fileType,
        },
      },
      attrs: {
        accept: "*", //接受文件类型
      },
      uploaderRes: {},
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
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.commitProject();
          if (this.saveTagTemplate) {
            this.commitTagTemplate();
          }
        } else {
          this.$Message.error("创建失败，请检查填写的内容！");
        }
      });
    },
    changeTagTemplate(value) {
      // console.log(value);
      this.getTagTemplateByType(value);
    },
    // async commitProject() {
    //   // 将已经上传至chunk区的文件或压缩包进行保存
    //   let uploaderRes = this.uploaderRes;
    //   if (uploaderRes.code == 0) {
    //     // let uploadFiles = this.toUploadFiles[0];
    //     let formData = new FormData();
    //     formData.append("filePath", uploaderRes.data.path);
    //     // formData.append("file", uploadFiles);
    //     formData.append("type", this.formInline.type);
    //     formData.append("description", this.formInline.description);
    //     formData.append("workName", this.formInline.workName);
    //     formData.append("image", this.imageFile);
    //     formData.append("tags", this.formInline.tagList);
    //     try {
    //       let res = await post("/visualResourceLibrary/work", formData);
    //       // console.log(res);
    //       this.$Message.success("创建成功");
    //       this.$router.go(-1);
    //     } catch (e) {
    //       this.$Message.error("创建失败");
    //       console.log(e);
    //     }
    //   } else {
    //     //上传失败，请重新上传
    //     this.$Message.error("上传失败，请重新上传");
    //   }
    // },
    gatherFile(file) {
      this.toUploadFiles = [];
      let that = this;
      if (that.toUploadFiles.length >= 10) {
        if (this.fileCountTimer != null) {
          clearTimeout(this.fileCountTimer);
        }
        this.fileCountTimer = setTimeout(() => {
          this.$Message.info("最多只能上传10个文件");
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
        that.formInline.file = file.name;
        that.toUploadFiles.push(file);
        // console.log(file);
      }
      return false;
    },
    delFileList(index) {
      this.toUploadFiles.splice(index, 1);
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
      if (tag != "" && !this.formInline.tagList.contains(tag)) {
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
    onFileError(file) {
      console.log("error", file);
    },
    onFileSuccess(rootFile, file, response, chunk) {
      this.uploaderRes = JSON.parse(response);
      this.formInline.file = this.uploaderRes.data.name;
    },
  },
};
</script>
