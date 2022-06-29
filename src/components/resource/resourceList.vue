<template>
  <el-row>
    <el-col :span="6" v-for="(item, index) in props.resList" :key="index">
      <el-card class="resListCard">
        <div class="imageBox">
          <el-image
            :src="'http://172.21.212.63:8999/' + item.imgWebAddress"
            class="image"
            :fit="contain"
          ></el-image>
        </div>
        <div style="padding: 7px">
          <span class="cardTitle" :title="item.name">{{ item.name }}</span>
          <el-button
            class="downloadButton"
            style="margin-left: 2px"
            type="info"
            @click="showMapCard(item)"
            >查看</el-button
          >
          <el-button class="downloadButton" @click="downloadRes(item)"
            >下载</el-button
          >
          <div class="fontSet" style="margin: 5px 0">
            <span>{{ filterSizeType(item.fileSize) }}</span
            ><br />
            <span>{{ item.userEmail }}</span>
            <span style="float: right">{{
              item.createTime.split(" ")[0]
            }}</span>
          </div>
        </div>
      </el-card>

    </el-col>
  </el-row>
  <el-row class="resListPagination">
    <el-pagination background layout="prev, pager, next" :total="5">
    </el-pagination>
  </el-row>
  <el-dialog
    v-model="mapCardDialogVisible"
    :title="selectedRes.name"
    width="60%"
    custom-class="mapboxCardDialog"
  >
    <mapbox-card :jsonData="selectedRes"></mapbox-card>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="show_task = true;">添加到个人中心</el-button>
        <el-button @click="mapCardDialogVisible = false">取消</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog
      v-model="show_task"
      title="选择已有实验"
      width="30%"
      :before-close="handleClose"
    >
      <el-button
        v-for="task in task_list"
        :key="task"
        @click="addDataToTask(task)"
      >
        <el-icon><Monitor /></el-icon> &nbsp; {{ task.name }}</el-button
      >

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="show_task = false">取消</el-button>
          <el-button type="primary" @click="show_task = false">完成</el-button>
        </span>
      </template>
    </el-dialog>
</template>

<script setup>
import { onMounted, ref,defineProps } from "vue";
import { ElMessageBox } from "element-plus";
import MapboxCard from "../Mapbox/MapboxCard.vue";
import { ElMessage } from "element-plus";
import taskApi from "@/api/user/task";


const userInfo = JSON.parse(localStorage.getItem("userInfo"));
const task_api = new taskApi();
const show_task = ref(false);
const task_list = ref([]);
const choosing_files=ref([])
task_api.getTaskList(userInfo.id).then((res) => {
  for (let i in res.data.data) {
    task_list.value.push(res.data.data[i]);
  }
});

  const props=defineProps({
    resList: Array,
  })
const addDataToTask = (task) => {
  console.log(task)
  let dataList=[]
  for (let i in choosing_files.value) {
    
      let data=choosing_files.value[i]
      dataList.push(data)
 
  }
  task_api.addData(task, dataList);
  show_task.value = false;
};


    const mapCardDialogVisible = ref(false);
    const selectedRes = ref({});
    const handleClose = function (done) {
      ElMessageBox.confirm("确定关闭此窗口?")
        .then(() => {
          done();
        })
        .catch(() => {
          // catch error
        });
    };
    const showMapCard = function (info) {
      choosing_files.value=[]
      choosing_files.value.push(info)
      // if (info.visualizationBoolean) {
      selectedRes.value = info;
      mapCardDialogVisible.value = true;
      // } else {
      //   // this.$Message.warning("该资源未开放可视化权限，详情请联系网站管理员！");
      //   ElMessage({
      //     message: "该资源未开放可视化权限，详情请联系网站管理员！",
      //     type: "warning",
      //   });
      // }
    };
    const downloadRes = function (item) {
      if (item.publicBoolean) {
        window.location.href =
          "http://172.21.212.63:8999/" + item.fileWebAddress;
      } else {
        // this.$Message.warning("该资源未开放下载权限，详情请联系网站管理员！");
        ElMessage({
          message: "该资源未开放下载权限，详情请联系网站管理员！",
          type: "warning",
        });
      }
    };
    const go2Model = function () {
      location.href = "/model";
    };
    const filterSizeType = function (value) {
      if (value === 0) return "0 B";
      let k = 1024;
      let sizes = ["B", "KB", "MB", "GB"];
      let i = Math.floor(Math.log(value) / Math.log(k));
      return (value / Math.pow(k, i)).toPrecision(4) + " " + sizes[i];
    };

   
</script>

<style lang="less" scoped>
.resListCard {
  margin: 15px;
}
.imageBox {
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 70%;
}
.image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.resListPagination {
  display: flex;
  align-items: center;
  justify-content: space-around;
  // flex-direction: column;
  margin-bottom: 20px;
  padding-top: 10px;
  border-top: solid 0.1px rgb(176, 174, 174);
}
.cardTitle {
  height: 30px;
  line-height: 30px;
  width: 62%;
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.downloadButton {
  width: 15%;
  float: right;
  height: 30px;
}
.fontSet {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #606266;
  vertical-align: middle;
}
.el-card {
  --el-card-padding: 0px;
}
</style>
<style lang="less">
.mapboxCardDialog .el-dialog__body {
  padding: 10px;
}
</style>