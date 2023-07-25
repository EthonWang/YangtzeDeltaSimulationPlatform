<template>
  <el-container>
    <el-col class="data-show-map-wrapper">
      <div id="data-show-map">
        <div class="leaflet-control map-select">
          <!-- <el-row class="leaflet-right map-select"> -->
          <!-- <h2 style="font-size:1.5em;margin-top: 10px;margin-bottom: 10px;font-weight: bold">指标选择</h2>
                        <el-select v-model="MapIndex" placeholder="请选择">
                            <el-option
                                    v-for="item in IndexList"
                                    :key="item.Name"
                                    :label="item.Name"
                                    :value="item.Name">
                            </el-option>
                        </el-select>
                        <br/> -->
          <!-- <el-button @click="getExcel" style="margin-right: 10px" type="primary" >测试按钮</el-button> -->
          <!-- <el-button @click="MoranClickMap" style="margin-top: 10px" type="primary" >空间自相关</el-button> -->
          <!-- </el-row> -->
          <h2
            class="leaflet-right map-select"
            style="
              margin-top: -7px;
              margin-right: 100px;
              font-size: 1.5em;
              font-weight: bold;
            "
          >
            尺度选择：
          </h2>
          <el-radio-group
            v-model="GeoJsonGroup"
            class="leaflet-right map-select"
          >
            <!-- <el-radio-button  @change="CheckBoxclickMap" v-for="Select in SelectOp" :label="Select" :key="Select">
                        </el-radio-button> -->
            <el-select
              v-model="GeoJsonGroup"
              placeholder="请选择"
              style="width: 100px"
            >
              <el-option
                v-for="item in SelectOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                @click="checkBoxClickMap"
              >
              </el-option>
            </el-select>
          </el-radio-group>
          <!--  弹出对话框-->
          <el-dialog
            :title="excel.name"
            v-model="dialogTableVisible"
            width="60%"
          >
            <!-- <el-table :data="excel.data" max-height="400" :span-method="arraySpanMethod" border> -->
            <!-- :span-method="arraySpanMethod" 用不了，能合并，但是太卡了 -->
            <el-table :data="excel.data" max-height="400" border>
              <el-table-column
                v-for="item in ColumnName"
                :key="item"
                :prop="item"
                :label="item"
              >
              </el-table-column>
            </el-table>
            <slot name="footer" class="dialog-footer">
              <el-button type="primary" @click="controlHide">确定</el-button>
            </slot>
          </el-dialog>
        </div>
      </div>
    </el-col>
  </el-container>
</template>

<script>
import axios from "axios";
import { AnalyzeMap } from "../../../public/case/sustainable/js/AnalyzeMap";
import Global from "../../../public/case/sustainable/Global";
import { JudgeSelectJson } from "../../../public/case/sustainable/js/getData_cr";

const SelectOption = ["世界", "省域", "市域", "县域"];
export default {
  name: "SystemViusal",
  data() {
    return {
      // 数据库拿到数据
      MongoDBDataOb: [],
      // 符合尺度的数据
      MongoDBData: [],
      // 拿到地理位置数据
      placeList: [],
      regionList: [],
      // 综合得分，染色依据
      MapIndex: [],
      // VisualJson: Global.VisualJson,
      // includes Name and NameData
      IndexJson: [],
      GeoJsonGroup: "市域",
      SelectOptions: [
        {
          value: "世界",
          label: "世界",
        },
        {
          value: "省域",
          label: "省域",
        },
        {
          value: "市域",
          label: "市域",
        },
        {
          value: "县域",
          label: "县域",
        },
      ],
      dialogTableVisible: Global.inMapFlag,
      city: "",
      tableName: "",
      ColumnName: [],
      excel: {},
      // 用来记录需要合并行的下标
      mergeObj: {},
    };
  },
  watch: {
    // 每当页面中dialogTableVisible的值被设定为false时，重新将Global.inMapFlag也设置为false
    dialogTableVisible(newVal, oldVal) {
      if (!newVal) {
        Global.inMapFlag = newVal;
      }
    },
  },
  created() {
    setInterval(() => {
      if (this.dialogTableVisible != Global.inMapFlag) {
        this.dialogTableVisible = Global.inMapFlag;
        this.city = Global.inMapData.city;
        this.tableName = Global.inMapData.tableName;
        this.getExcel();
        this.controlDialog();
        console.log(this.ColumnName);
      }
    }, 800); // 每秒检查一次
    // this.$watch(() => Global.inMapFlag, (newVal, oldVal) => {
    //     console.log('侦听成功');
    //     this.handleInMapFlagChange(newVal);
    // });
  },
  methods: {
    mapInit() {
      this.mapobj = new AnalyzeMap("data-show-map");
    },
    handleInMapFlagChange(flag) {
      console.log("handleInMapFlagChange is called");
      // 在这里编写 Global.inMapFlag 变化后需要执行的逻辑
      if (flag) {
        this.dialogTableVisible = true;
      } else {
        this.dialogTableVisible = true;
      }
    },
    getExcel() {
      // console.log(this.MongoDBData,'156');
      for (let i = 0; i < this.MongoDBData.length; i++) {
        if (
          this.tableName == this.MongoDBData[i].name &&
          this.MongoDBData[i].region.includes(this.city)
        ) {
          this.excel = this.MongoDBData[i];
        }
      }
    },
    controlDialog() {
      // 展开前先清除现存数据，防止上一个dialogue的数据遗存（如果上一个dialogue没有点“确定”按钮退出而且点×或者别处，就会保留数据）
      this.ColumnName.length = 0;
      for (let keyname in this.excel.data[0]) {
        if (Object.prototype.hasOwnProperty.call(this.excel.data[0], keyname)) {
          if (
            keyname.indexOf("index") === -1 &&
            keyname.indexOf("得分") === -1 &&
            keyname.indexOf("权重") === -1
          ) {
            this.ColumnName.push(keyname);
            var score = keyname + "得分";
            var weight = keyname + "权重";
            if (score in this.excel.data[0] && weight in this.excel.data[0]) {
              this.ColumnName.push(weight);
              this.ColumnName.push(score);
            }
          }
        }
      }
    },
    // 合并表格函数
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      // 调用数据初始化数据的方法,便于行合并
      this.getSpanArr(this.excel.data);
      // 判断列的属性
      if (this.ColumnName.indexOf(column.property) !== -1) {
        // 判断其值是不是为0
        if (this.mergeObj[column.property][rowIndex]) {
          return [this.mergeObj[column.property][rowIndex], 1];
        } else {
          // 如果为0则为需要合并的行
          return [0, 0];
        }
      }
    },
    // 合并表格中相同的行
    getSpanArr(data) {
      this.ColumnName.forEach((key, index1) => {
        let count = 0; // 用来记录需要合并行的起始位置
        this.mergeObj[key] = []; // 记录每一列的合并信息
        data.forEach((item, index) => {
          // index == 0表示数据为第一行，直接 push 一个 1
          if (index === 0) {
            this.mergeObj[key].push(1);
          } else {
            // 判断当前行是否与上一行其值相等 如果相等 在 count 记录的位置其值 +1 表示当前行需要合并 并push 一个 0 作为占位
            if (item[key] === data[index - 1][key]) {
              this.mergeObj[key][count] += 1;
              this.mergeObj[key].push(0);
            } else {
              // 如果当前行和上一行其值不相等
              count = index; // 记录当前位置
              this.mergeObj[key].push(1); // 重新push 一个 1
            }
          }
        });
      });
    },
    controlHide() {
      this.dialogTableVisible = false;
      this.ColumnName.length = 0;
    },
    // 去重
    noRepeat(arr) {
      //定义一个新的临时数组
      var newArr = [];
      //遍历当前数组
      for (var i = 0; i < arr.length; i++) {
        //如果当前数组的第i已经保存进了临时数组，那么跳过，
        //否则把当前项push到临时数组里面
        if (newArr.indexOf(arr[i]) === -1) {
          //indexOf() 判断数组中有没有字符串值，如果没有则返回 -1
          newArr.push(arr[i]);
        }
      }
      return newArr;
    },
    // 获取数据，并根据综合指标上色
    visual() {
      axios.get(Global.SDGUrl + "/api/EcoData").then((response) => {
        // this.MongoDBData = response.data;
        this.MongoDBDataOb = response.data;
        this.getMongoDBData();
        // console.log(this.MongoDBData, 'TestData');
      });
    },
    // 显色
    radioClickMap() {
      // console.log(this.MongoDBData,this.MongoDBData.length,'this.MongoDBData.length');
      // 先拿到所有数据的region值
      this.placeList = [];
      for (var i = 0; i < this.MongoDBData.length; i++) {
        if (this.MongoDBData[i].region != null) {
          this.placeList.push(this.MongoDBData[i].region);
        }
      }
      // 格式化拿到的region值
      this.regionList = [];
      for (var j = 0; j < this.placeList.length; j++) {
        // 去除原格式中的[]和双引号
        this.placeList[j] = this.placeList[j].replace(/\[|]/g, "");
        this.placeList[j] = this.placeList[j].split('"').join("");
        var arr = this.placeList[j].split(",");
        this.regionList.push(arr);
      }
      this.getIndexJson();
      // 给regionList数组去重,同时要保留该地区的最高分
      // this.regionList=this.NoRepeat(this.regionList);
      // 获取VisualJson数据
      Global.VisualJson = [];
      var visualJson = [];
      for (var k = 0; k < this.regionList.length; k++) {
        for (var l = 0; l < this.regionList[k].length; l++) {
          JudgeSelectJson(this.regionList[k][l], this.IndexJson[k]);
          // console.log(Global.VisualJson,k,l);
        }
        visualJson[k] = Global.VisualJson;
        Global.VisualJson = [];
      }
      Global.VisualJson = visualJson;
      visualJson = [];
      this.mapobj.RemoveJson();
      // MapIndex是染色依据，在这里是综合得分的字符串名称
      // VisualJson是地图位置信息，通过JudgeSelectJson（）方法赋值，从Global.VisualJson中获取
      console.log(
        Global.VisualJson,
        this.MapIndex,
        "Global.VisualJson和this.MapIndex"
      );
      for (var m = 0; m < Global.VisualJson.length; m++) {
        if (this.MapIndex[m] != undefined) {
          // console.log(this.MapIndex[m],m);
          this.mapobj.VisualGeoJson2(Global.VisualJson[m], this.MapIndex[m]);
        }
      }
    },
    // 根据尺度切换数据
    checkBoxClickMap() {
      this.MongoDBData = [];
      this.getMongoDBData();
    },
    getMongoDBData() {
      console.log(this.MongoDBDataOb, "46");
      for (let i = 0; i < this.MongoDBDataOb.length; i++) {
        if (
          this.MongoDBDataOb[i].scale == this.GeoJsonGroup &&
          this.MongoDBDataOb[i].data.length > 1
        ) {
          this.MongoDBData.push(this.MongoDBDataOb[i]);
        }
      }
      // console.log(this.MongoDBData,'123');
      this.radioClickMap();
    },
    // 从数据中获取IndexJson
    getIndexJson() {
      this.IndexJson = [];
      for (var i = 0; i < this.MongoDBData.length; i++) {
        console.log(this.MongoDBData[i].data[0], "225");
        if (this.MongoDBData[i].data[0] != null) {
          console.log(this.MongoDBData[i], "226");
          var scoreName = this.MongoDBData[i].name + "综合得分";
          if (scoreName in this.MongoDBData[i].data[0]) {
            var index = {};
            index.Name = scoreName;
            index.NameData = this.MongoDBData[i].data[0][scoreName];
            // this.IndexJson.push(index);
            // this.MapIndex.push(index.Name);
            this.IndexJson[i] = index;
            this.MapIndex[i] = index.Name;
          }
        }
      }
      console.log(this.IndexJson, this.MapIndex, "123");
    },
  },
  mounted() {
    this.mapInit();
    this.visual();
  },
  beforeUnmount() {
    this.mapobj && this.mapobj.destroy();
  },
};
</script>

<style scoped>
.data-show-map-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.1);
  background-size: 100% 100%;
}
#data-show-map {
  height: 100%;
  width: 100%;
  border-radius: 10px;
  position: relative;
}

.map-select {
  position: fixed;
  padding-top: 15px;
  padding-right: 200px;
  max-width: 330px;
}
/deep/.leaflet-popup-close-button {
  display: none;
}
</style>