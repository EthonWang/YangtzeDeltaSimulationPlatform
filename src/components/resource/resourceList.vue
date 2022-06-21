<template>
  <el-row>
    <el-col :span="6" v-for="(item, index) in resList" :key="index">
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
        <el-button type="primary" @click="go2Model()">添加到个人中心</el-button>
        <el-button @click="mapCardDialogVisible = false">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { onMounted, ref } from "vue";
import { ElMessageBox } from "element-plus";
import MapboxCard from "../Mapbox/MapboxCard.vue";
import { ElMessage } from "element-plus";
export default {
  name: "resourceList",
  props: {
    resList: Array,
  },
  components: {
    MapboxCard,
  },
  emits: [],
  setup(props, ctx) {
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
    return {
      // showResList,
      mapCardDialogVisible,
      selectedRes,
      handleClose,
      showMapCard,
      downloadRes,
      go2Model,
      filterSizeType,
    };
  },
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