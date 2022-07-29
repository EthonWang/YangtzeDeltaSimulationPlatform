<template>
  <div class="mapbox-page">
    <!-- <ModelConfig :modelId="modelId" ref="refModelConfig"> </ModelConfig> -->

    <el-tag class="map-zoom-lnglat" type="info">
      Zoom:{{ zoom }} &nbsp; LngLat:{{ showCenter }}
    </el-tag>
    <div style="position: absolute; top: 75px; left: 110px; z-index: 99">
      <el-button
        v-if="!editBoardShow"
        size="small"
        @click="handleEditBoardShow(1)"
        ><el-icon><ArrowDownBold /></el-icon>&nbsp;打开编辑框
      </el-button>
      <el-button
        v-if="editBoardShow"
        size="small"
        @click="handleEditBoardShow(0)"
        ><el-icon><ArrowUpBold /></el-icon>&nbsp;收起编辑框
      </el-button>
    </div>

    <transition-group name="lyric">
      <div class="edit-board" v-if="editBoardShow">
        <el-collapse v-model="activeNames" @change="handleChange" style="position: relative;z-index: 1005;">
          <el-collapse-item title="数据列表" name="data">
            <el-table
              :data="showLayerTableList"
              ref="shpLayerTable"
              row-key="nameId"
              size="small"
              @cell-click="handleLayerClick"
              style="width: 100%"
            >
              <el-table-column width="50">
                <template #default="scope">
                  <el-switch
                  
                    :width="30"
                    v-model="scope.row.show"
                    v-if="scope.row.visualType!='zip'"
                    @change="handleLayerShowSwitchChange($event, scope.row)"
                  >
                  </el-switch>
                  <el-switch
                  v-else
                  disabled
                    :width="30"
                    v-model="falseShow"
                    @change="handleLayerShowSwitchChange($event, scope.row)"
                  >
                  </el-switch>
                </template>
              </el-table-column>
              <el-table-column
                label="类型"
                prop="visualType"
                min-width="50"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                label="名称"
                prop="name"
                min-width="130"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column label="操作" min-width="90">
                <template #default="scope">
                  <el-popover
                    placement="right"
                    title="图层样式"
                    width="250"
                    trigger="click"
                  >
                    <!--              点图层编辑-->
                    <div
                      v-if="
                        scope.row.type === 'circle' &&
                        scope.row.data.visualType == 'shp'
                      "
                    >
                      {{ scope.row.name }}
                      <div class="flex-row-start">
                        <h3 style="width: 100px">颜色:</h3>
                        <el-input
                          v-model="
                            showLayerTableList[scope.$index].paint[
                              'circle-color'
                            ]
                          "
                          @change="
                            handlePaintChange(
                              showLayerTableList[scope.$index]['id'],
                              'circle-color',
                              showLayerTableList[scope.$index].paint[
                                'circle-color'
                              ]
                            )
                          "
                          placeholder="something"
                          size="small"
                        ></el-input>
                        <el-color-picker
                          v-model="
                            showLayerTableList[scope.$index].paint[
                              'circle-color'
                            ]
                          "
                          @change="
                            handlePaintChange(
                              showLayerTableList[scope.$index]['id'],
                              'circle-color',
                              showLayerTableList[scope.$index].paint[
                                'circle-color'
                              ]
                            )
                          "
                          :predefine="predefineColors"
                          size="small"
                        >
                        </el-color-picker>
                      </div>

                      <div class="flex-row-start">
                        <h3 style="width: 200px">半径（px）:</h3>
                        <el-input-number
                          v-model="
                            showLayerTableList[scope.$index].paint[
                              'circle-radius'
                            ]
                          "
                          @change="
                            handlePaintChange(
                              showLayerTableList[scope.$index]['id'],
                              'circle-radius',
                              showLayerTableList[scope.$index].paint[
                                'circle-radius'
                              ]
                            )
                          "
                          :min="0"
                          :max="99999"
                          size="small"
                          label="描述文字"
                        >
                        </el-input-number>
                      </div>

                      <div class="flex-row-start">
                        <h3 style="width: 200px">透明度:</h3>
                        <el-input-number
                          v-model="
                            showLayerTableList[scope.$index].paint[
                              'circle-opacity'
                            ]
                          "
                          @change="
                            handlePaintChange(
                              showLayerTableList[scope.$index]['id'],
                              'circle-opacity',
                              showLayerTableList[scope.$index].paint[
                                'circle-opacity'
                              ]
                            )
                          "
                          :min="0"
                          :max="1"
                          :step="0.1"
                          size="small"
                          label="描述文字"
                        >
                        </el-input-number>
                      </div>
                      <div class="flex-row-start">
                        <h3 style="width: 200px">模糊度:</h3>
                        <el-input-number
                          v-model="
                            showLayerTableList[scope.$index].paint[
                              'circle-blur'
                            ]
                          "
                          @change="
                            handlePaintChange(
                              showLayerTableList[scope.$index]['id'],
                              'circle-blur',
                              showLayerTableList[scope.$index].paint[
                                'circle-blur'
                              ]
                            )
                          "
                          :min="0"
                          :max="1"
                          :step="0.1"
                          size="small"
                          label="描述文字"
                        >
                        </el-input-number>
                      </div>
                    </div>

                    <!--              线图层编辑-->
                    <div
                      v-else-if="
                        scope.row.type === 'line' &&
                        scope.row.data.visualType == 'shp'
                      "
                    >
                      <div class="flex-row-start">
                        <h3 style="width: 200px">颜色:</h3>
                        <el-input
                          v-model="
                            showLayerTableList[scope.$index].paint['line-color']
                          "
                          @change="
                            handlePaintChange(
                              showLayerTableList[scope.$index]['id'],
                              'line-color',
                              showLayerTableList[scope.$index].paint[
                                'line-color'
                              ]
                            )
                          "
                          placeholder="something"
                          size="small"
                        ></el-input>
                        <el-color-picker
                          v-model="
                            showLayerTableList[scope.$index].paint['line-color']
                          "
                          @change="
                            handlePaintChange(
                              showLayerTableList[scope.$index]['id'],
                              'line-color',
                              showLayerTableList[scope.$index].paint[
                                'line-color'
                              ]
                            )
                          "
                          :predefine="predefineColors"
                          size="small"
                        >
                        </el-color-picker>
                      </div>

                      <div class="flex-row-start">
                        <h3 style="width: 200px">线宽（px）:</h3>
                        <el-input-number
                          v-model="
                            showLayerTableList[scope.$index].paint['line-width']
                          "
                          @change="
                            handlePaintChange(
                              showLayerTableList[scope.$index]['id'],
                              'line-width',
                              showLayerTableList[scope.$index].paint[
                                'line-width'
                              ]
                            )
                          "
                          :min="0"
                          :max="99999"
                          size="small"
                          label="描述文字"
                        >
                        </el-input-number>
                      </div>

                      <div class="flex-row-start">
                        <h3 style="width: 200px">透明度:</h3>
                        <el-input-number
                          v-model="
                            showLayerTableList[scope.$index].paint[
                              'line-opacity'
                            ]
                          "
                          @change="
                            handlePaintChange(
                              showLayerTableList[scope.$index]['id'],
                              'line-opacity',
                              showLayerTableList[scope.$index].paint[
                                'line-opacity'
                              ]
                            )
                          "
                          :min="0"
                          :max="1"
                          :step="0.1"
                          size="small"
                          label="描述文字"
                        >
                        </el-input-number>
                      </div>
                      <div class="flex-row-start">
                        <h3 style="width: 200px">模糊度:</h3>
                        <el-input-number
                          v-model="
                            showLayerTableList[scope.$index].paint['line-blur']
                          "
                          @change="
                            handlePaintChange(
                              showLayerTableList[scope.$index]['id'],
                              'line-blur',
                              showLayerTableList[scope.$index].paint[
                                'line-blur'
                              ]
                            )
                          "
                          :min="0"
                          :max="1"
                          :step="0.1"
                          size="small"
                          label="描述文字"
                        >
                        </el-input-number>
                      </div>
                      <div class="flex-row-start">
                        <h3 style="width: 80px">虚线:</h3>
                        实:&nbsp;
                        <el-input-number
                          v-model="
                            showLayerTableList[scope.$index].paint[
                              'line-dasharray'
                            ][0]
                          "
                          @change="
                            handlePaintChange(
                              showLayerTableList[scope.$index]['id'],
                              'line-dasharray',
                              showLayerTableList[scope.$index].paint[
                                'line-dasharray'
                              ]
                            )
                          "
                          :min="0"
                          size="small"
                          label="描述文字"
                        >
                        </el-input-number>
                        虚:&nbsp;
                        <el-input-number
                          v-model="
                            showLayerTableList[scope.$index].paint[
                              'line-dasharray'
                            ][1]
                          "
                          @change="
                            handlePaintChange(
                              showLayerTableList[scope.$index]['id'],
                              'line-dasharray',
                              showLayerTableList[scope.$index].paint[
                                'line-dasharray'
                              ]
                            )
                          "
                          :min="0"
                          size="small"
                          label="描述文字"
                        >
                        </el-input-number>
                      </div>
                    </div>

                    <!--              面图层编辑-->
                    <div
                      v-else-if="
                        scope.row.type === 'fill' &&
                        scope.row.data.visualType == 'geojson'
                      "
                    >
                      <div class="flex-row-start">
                        <h3 style="width: 200px">颜色:</h3>
                        <el-input
                          v-model="
                            showLayerTableList[scope.$index].paint['fill-color']
                          "
                          @change="
                            handlePaintChange(
                              showLayerTableList[scope.$index]['id'],
                              'fill-color',
                              showLayerTableList[scope.$index].paint[
                                'fill-color'
                              ]
                            )
                          "
                          placeholder="something"
                          size="small"
                        ></el-input>
                        <el-color-picker
                          v-model="
                            showLayerTableList[scope.$index].paint['fill-color']
                          "
                          @change="
                            handlePaintChange(
                              showLayerTableList[scope.$index]['id'],
                              'fill-color',
                              showLayerTableList[scope.$index].paint[
                                'fill-color'
                              ]
                            )
                          "
                          :predefine="predefineColors"
                          size="small"
                        >
                        </el-color-picker>
                      </div>
                      <div class="flex-row-start">
                        <h3 style="width: 200px">边线颜色:</h3>
                        <el-input
                          v-model="
                            showLayerTableList[scope.$index].paint[
                              'fill-outline-color'
                            ]
                          "
                          @change="
                            handlePaintChange(
                              showLayerTableList[scope.$index]['id'],
                              'fill-outline-color',
                              showLayerTableList[scope.$index].paint[
                                'fill-outline-color'
                              ]
                            )
                          "
                          placeholder="something"
                          size="small"
                        ></el-input>
                        <el-color-picker
                          v-model="
                            showLayerTableList[scope.$index].paint[
                              'fill-outline-color'
                            ]
                          "
                          @change="
                            handlePaintChange(
                              showLayerTableList[scope.$index]['id'],
                              'fill-outline-color',
                              showLayerTableList[scope.$index].paint[
                                'fill-outline-color'
                              ]
                            )
                          "
                          :predefine="predefineColors"
                          size="small"
                        >
                        </el-color-picker>
                      </div>
                      <div class="flex-row-start">
                        <h3 style="width: 200px">透明度:</h3>
                        <el-input-number
                          v-model="
                            showLayerTableList[scope.$index].paint[
                              'fill-opacity'
                            ]
                          "
                          @change="
                            handlePaintChange(
                              showLayerTableList[scope.$index]['id'],
                              'fill-opacity',
                              showLayerTableList[scope.$index].paint[
                                'fill-opacity'
                              ]
                            )
                          "
                          :min="0"
                          :max="1"
                          :step="0.1"
                          size="small"
                          label="描述文字"
                        >
                        </el-input-number>
                      </div>
                      <div
                        class="flex-row-start"
                        v-if="
                          showLayerTableList[scope.$index].startEditor !=
                          undefined
                        "
                      >
                        <h3 style="width: 200px">矢量编辑:</h3>
                        <el-switch
                          :width="30"
                          v-model="showLayerTableList[scope.$index].startEditor"
                          @change="layer2JsonEditor($event, scope.row)"
                        ></el-switch>
                      </div>
                      <div
                        class="flex-row-start"
                        v-if="
                          showLayerTableList[scope.$index].startEditor !=
                          undefined
                        "
                      >
                        <h3 style="width: 200px">保存文件:</h3>
                        <el-button
                          :width="30"
                          @click="saveGeoJson2UserSpace(scope.row)"
                          >保存</el-button
                        >
                      </div>
                    </div>
                    <!--              栅格层编辑-->
                    <div v-else-if="scope.row.data.visualType == 'tif'"></div>
                    <!--              文本编辑-->
                    <div v-else-if="scope.row.data.visualType == 'txt'">
                      <div class="flex-row-start">
                        <el-button :width="30" @click="openTxtEditor(scope.row)"
                          >打开文本编辑器</el-button
                        >
                      </div>
                    </div>
                    <template #reference>
                      <el-button
                        size="small"
                        type="success"
                        @click="handleLayerEdit(scope.$index, scope.row)"
                      >
                        编辑
                      </el-button>
                    </template>
                  </el-popover>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
          <el-collapse-item title="模型列表" name="model" style="position: relative;z-index: 1005;">
           
            <ModelTree
              style="width: 100%;height: 100%;position: relative;z-index: 1005;"
              @getCheckData="getCheckData"
              @getCheckChart="getCheckChart"
              @getCheckTif="getCheckTif"
              @getCheckJson="getCheckJson"
            ></ModelTree>
           
            
            <!-- <el-table
              :data="
                showLayerTableList.filter((item) => item.simularTrait == 'model')
              "
              ref="shpLayerTable"
              row-key="nameId"
              size="small"
              @cell-click="handleLayerClick"
              style="width: 100%"
            >
              <el-table-column width="50">
                <template #default="scope">
                  <el-switch
                    :width="30"
                    v-model="scope.row.show"
                    @change="handleLayerShowSwitchChange($event, scope.row)"
                  >
                  </el-switch>
                </template>
              </el-table-column>
              <el-table-column
                label="类型"
                prop="visualType"
                min-width="50"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                label="名称"
                prop="name"
                min-width="130"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column label="操作" min-width="90">
                <template>
                  <el-button>使用</el-button>
                </template>
              </el-table-column>
            </el-table> -->
          </el-collapse-item>
        </el-collapse>
      </div>
    </transition-group>

    <!--    <el-button type="primary">Primary</el-button>-->
    <div id="map"></div>
  </div>
  <Modal
    v-model="clipModal"
    draggable
    sticky
    scrollable
    :mask="false"
    @on-ok="commitClip()"
    @on-cancel="cancel"
  >
    <template #header>
      <Icon type="md-cut" size="18" />
      <span style="margin-left: 5px; font-size: 18px">裁剪</span>
    </template>
    <Form :model="clipForm" label-position="top">
      <FormItem label="输入要素">
        <Input
          v-model="clipForm.inputFeaturesName"
          style="width: 90%"
          readonly
        ></Input>
        <Button
          :size="buttonSize"
          icon="ios-folder-open"
          style="margin-left: 15px"
          @click="selectClipFeatures('inputRaster')"
        ></Button>
      </FormItem>
      <FormItem label="裁剪要素">
        <Input
          v-model="clipForm.clipFeaturesName"
          style="width: 90%"
          readonly
        ></Input>
        <Button
          :size="buttonSize"
          icon="ios-folder-open"
          style="margin-left: 15px"
          @click="selectClipFeatures('inputShp')"
        ></Button>
      </FormItem>
      <FormItem label="输出要素">
        <Input v-model="clipForm.outputFeaturesName" style="width: 90%"></Input>
      </FormItem>
    </Form>
  </Modal>
  <Modal
    v-model="clipSelectFeaturesModal"
    draggable
    sticky
    scrollable
    :mask="false"
    @on-ok="ok"
    @on-cancel="cancel"
  >
    <template #header>
      <Icon type="md-cut" size="18" />
      <span style="margin-left: 5px; font-size: 18px"
        >选择{{ clipForm.title }}</span
      >
    </template>
    <RadioGroup
      v-model="clipForm.inputFeaturesName"
      vertical
      v-if="clipForm.title == '输入要素'"
      :on-change="clipFormChange(clipForm.inputFeaturesName, 'raster')"
    >
      <div v-for="(item, index) in showLayerTableList" :key="index">
        <Radio :label="item.name" v-if="item.visualType == 'tif'">
          <span>{{ item.name }}</span>
        </Radio>
      </div>
    </RadioGroup>
    <RadioGroup
      v-model="clipForm.clipFeaturesName"
      vertical
      v-if="clipForm.title == '裁剪要素'"
      :on-change="clipFormChange(clipForm.clipFeaturesName, 'shp')"
    >
      <div v-for="(item, index) in showLayerTableList" :key="index">
        <Radio
          :label="item.name"
          v-if="item.visualType == 'shp' || item.visualType == 'geojson'"
        >
          <span>{{ item.name }}</span>
        </Radio>
      </div>
    </RadioGroup>
  </Modal>
  <Modal v-model="analysisModal" draggable sticky scrollable :mask="false">
    <template #header>
      <Icon type="logo-buffer" size="18" />
      <span style="margin-left: 5px; font-size: 18px">数据分析</span>
    </template>
    <Form :model="analysisForm" label-position="top">
      <FormItem label="分析方法">
        <RadioGroup v-model="analysisForm.type">
          <Radio label="charts">趋势分析</Radio>
          <Radio label="raster">统计分析</Radio>
          <Radio label="other">其他</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="输入要素">
        <Input
          v-model="analysisForm.inputFeaturesName"
          style="width: 90%"
          readonly
        ></Input>
        <Button
          :size="buttonSize"
          icon="ios-folder-open"
          style="margin-left: 15px"
          @click="selectAnalysisFeatures(analysisForm.type)"
        ></Button>
      </FormItem>
      <FormItem label="输出形式" v-if="analysisForm.type == 'charts'">
        <RadioGroup v-model="analysisForm.chartsType">
          <Radio label="line">折线图</Radio>
          <Radio label="bar">柱状图</Radio>
          <Radio label="pie">饼图</Radio>
          <Radio label="scatter">散点图</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="统计时间" v-if="analysisForm.type == 'raster'">
        <Input v-model="analysisForm.dateNum" style="width: 90%"></Input>
      </FormItem>
    </Form>
    <template #footer>
      <Button @click="analysisModal = false">取消</Button>
      <Button type="primary" @click="commitAnalysis()">开始分析</Button>
    </template>
  </Modal>
  <Modal
    v-model="analysisSelectFeaturesModal"
    draggable
    sticky
    scrollable
    :mask="false"
    :closable="false"
  >
    <template #header>
      <Icon type="logo-buffer" size="18" />
      <span style="margin-left: 5px; font-size: 18px">数据分析 - 选择数据</span>
    </template>
    <Alert
      type="warning"
      show-icon
      closable
      v-if="analysisForm.type == 'charts'"
    >
      A success prompt
      <template #desc
        >Content of prompt. Content of prompt. Content of prompt. Content of
        prompt.
      </template>
    </Alert>
    <RadioGroup
      v-model="analysisForm.inputFeaturesName"
      vertical
      v-if="analysisForm.type == 'charts'"
      :on-change="analysisFormChange(analysisForm.inputFeaturesName, 'charts')"
    >
      <div v-for="(item, index) in showLayerTableList" :key="index">
        <Radio :label="item.name" v-if="item.visualType == 'txt'">
          <span>{{ item.name }}</span>
        </Radio>
      </div>
    </RadioGroup>
    <Alert
      type="warning"
      show-icon
      closable
      v-if="analysisForm.type == 'raster'"
    >
      A success prompt
      <template #desc
        >Content of prompt. Content of prompt. Content of prompt. Content of
        prompt.
      </template>
    </Alert>
    <RadioGroup
      v-model="analysisForm.inputFeaturesName"
      vertical
      v-if="analysisForm.type == 'raster'"
      :on-change="analysisFormChange(analysisForm.inputFeaturesName, 'raster')"
    >
      <div v-for="(item, index) in showLayerTableList" :key="index">
        <Radio :label="item.name" v-if="item.visualType == 'nc'">
          <span>{{ item.name }}</span>
        </Radio>
      </div>
    </RadioGroup>
    <template #footer>
      <Button @click="analysisSelectFeaturesModal = false">取消</Button>
      <Button type="primary" @click="analysisSelectFeaturesModal = false"
        >确定</Button
      >
    </template>
  </Modal>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import mapboxgl from "mapbox-gl";
import { ElNotification, ElMessage } from "element-plus";
import { get, post } from "@/request/request";
import axios from "axios";
import MapboxLanguage from "@mapbox/mapbox-gl-language";
mapboxgl.setRTLTextPlugin(
  "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.1.0/mapbox-gl-rtl-text.js"
);
import "mapbox-gl/dist/mapbox-gl.css";
import { toRaw } from "@vue/reactivity";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import ModelConfig from "../App/ModelConfig.vue";
import ModelTree from "../App/ModelTree.vue";

var map = null;

export default {
  name: "MapboxView",
  props: ["shpShowList"], //shpShowList为前端勾选的要展示在地图上的shp，格式为[{name:"",type:"",nameId:""}]
  components: {
    ModelTree,
  },
  data() {
    return {
      falseShow:false,
      modelId: ref("7887988"),
      refModelConfig: ref(),
      showCenter: "-90,17",
      zoom: 6,
      editBoardShow: true,
      layerStyle: {
        line: {
          layout: {
            visibility: "visible",
            // "line-sort-key":999
          },
          paint: {
            "line-color": "#" + Math.random().toString(16).substr(2, 6),
            "line-blur": 0,
            "line-dasharray": [1, 0],
            // "line-gradient":"",  //ignore  Requires source to be "geojson".
            "line-opacity": 1,
            // "line-pattern": "",  //ignore  Optional resolvedImage.
            "line-width": 1,
          },
        },
        circle: {
          layout: {
            visibility: "visible", //One of "visible", "none"
            // "circle-sort-key":999,
          },
          paint: {
            "circle-blur": 0,
            "circle-color": "#000000",
            "circle-opacity": 1,
            "circle-pitch-alignment": "viewport", //One of "map", "viewport"
            "circle-pitch-scale": "map", //One of "map", "viewport"
            "circle-radius": 5,
            "circle-stroke-color": "#000000",
            "circle-stroke-opacity": 1,
            "circle-stroke-width": 0,
            "circle-translate": [0, 0],
            "circle-translate-anchor": "map", // One of "map", "viewport"
          },
        },
        fill: {
          layout: {
            visibility: "visible", //One of "visible", "none"
            // "fill-sort-key":999
          },
          paint: {
            "fill-antialias": true,
            "fill-color": "#" + Math.random().toString(16).substr(2, 6),
            "fill-outline-color": "#000000",
            "fill-opacity": 1,
          },
        },
      },

      showLayerTableList: [],

      predefineColors: [
        "#ff4500",
        "#ff8c00",
        "#ffd700",
        "#90ee90",
        "#00ced1",
        "#1e90ff",
        "#c71585",
      ],

      draw: null,
      geojson: {
        features: [],
        type: "FeatureCollection",
      },
      clipModal: false,
      clipSelectFeaturesModal: false,
      clipForm: {
        title: "输入要素",
        inputFeaturesName: "",
        clipFeaturesName: "",
        inputRaster: "",
        inputShp: "",
        outputFeaturesName: "",
      },
      analysisModal: false,
      analysisSelectFeaturesModal: false,
      analysisForm: {
        inputFeaturesName: "",
        inputTxtPath: "",
        type: "charts",
        chartsType: "line",
        dateNum: "",
      },

      activeNames: ["data","model"],
      resList: {
        modelList: [],
        dataList: [],
      },
      taskInfo: JSON.parse(localStorage.getItem("task")),
      userInfo: JSON.parse(localStorage.getItem("userInfo")),
      dataServer: useStore().getters.devIpAddress,
    };
  },

  watch: {
    shpShowListCopy: {
      handler(newVal, oldVal) {
        // console.log("watch shpShowListCopy: ", newVal, oldVal)

        //添加shp
        if (newVal.length > oldVal.length) {
          for (let i = 0; i < newVal.length; i++) {
            if (this.indexOfObject(oldVal, newVal[i].dataSourceId) === -1) {
              this.addLayerToMap(newVal[i]);
              break;
            }
          }
        } else {
          //删除shp
          for (let i = 0; i < oldVal.length; i++) {
            if (this.indexOfObject(newVal, oldVal[i].dataSourceId) === -1) {
              this.handleRemoveLayer(oldVal[i].dataSourceId);
              break;
            }
          }
        }
      },
      // immediate: true,
      // deep: true
    },
  },

  computed: {
    shpShowListCopy() {
      return toRaw(this.shpShowList).slice();
    },
  },

  mounted() {
    this.initMap();

    let that = this;
    setTimeout(function () {
      that.filterResList();
      setTimeout(() => {
        that.initShpShowList();
      }, 500);
    }, 500);
  },

  methods: {
    //数据部分后台未完成，暂时删掉了部分代码，不然报错
    initMap() {
      mapboxgl.accessToken =
        "pk.eyJ1Ijoid3lqcSIsImEiOiJjbDBnZDdwajUxMXRzM2htdWxubDh1MzJrIn0.2e2_rdU2nOUvtwltBIZtZg";

      map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/dark-v10",
        center: [120, 32],
        zoom: 7,
      });
      map.addControl(new MapboxLanguage({ defaultLanguage: "zh-Hans" }));

      var Draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          line_string: true,
          polygon: true,
          trash: true,
          combine_features: false,
          uncombine_features: false,
        },
        // modes: modes,
      });
      this.draw = Draw;
      map.addControl(Draw, "top-right");
      map.on("draw.create", this.updateArea);
      map.on("draw.delete", this.updateArea);
      map.on("draw.update", this.updateArea);
      this.setDrawControlStyle();

      var scale = new mapboxgl.ScaleControl({
        maxWidth: 120,
        unit: "imperial",
      });
      map.addControl(scale, "bottom-right");
      scale.setUnit("metric");

      // 添加控件缩放按钮和一个指南针.
      var nav = new mapboxgl.NavigationControl();
      map.addControl(nav, "bottom-right");
      // 全局缩放
      map.addControl(new mapboxgl.FullscreenControl(), "bottom-right");

      //添加定位控件
      map.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
        }),
        "bottom-right"
      );

      //zoom
      map.on("zoom", () => {
        this.zoom = map.getZoom().toFixed(2);
      });

      //center
      map.on("mousemove", (e) => {
        // this.center =
        //     String(e.lngLat.lng.toFixed(8)) +
        //     "," +
        //     String(e.lngLat.lat.toFixed(8));
        this.center = String(e.lngLat.lng) + "," + String(e.lngLat.lat);
        this.showCenter =
          String(e.lngLat.lng.toFixed(5)) +
          "," +
          String(e.lngLat.lat.toFixed(5));
      });
    },
    filterResList() {
      for (let i = 0; i < this.taskInfo.dataList.length; i++) {
        if (this.taskInfo.dataList[i].simularTrait=='task'){continue}
        if (this.taskInfo.dataList[i].type == "model") {
          this.resList.modelList.push(this.taskInfo.dataList[i]);
        } else {
          this.resList.dataList.push(this.taskInfo.dataList[i]);
        }
      }
      // this.resList = this.data_list;
    },
    initShpShowList() {
      // console.log(this.resList);
      for (let i = 0; i < this.resList.dataList.length; i++) {
        console.log("simular :", this.resList.dataList[i]);
        if (this.resList.dataList[i].mdl != undefined) {
          continue;
        }
        if (
          this.resList.dataList[i].visualType == "shp" ||
          this.resList.dataList[i].visualType == "tif" ||
          this.resList.dataList[i].visualType == "geojson"
        ) {
          this.addLayerToMap(
            JSON.parse(JSON.stringify(this.resList.dataList[i]))
          );
        } else {
          //添加layer
          let newLayer = {
            show: true,
            name: this.resList.dataList[i].name,
            id: this.resList.dataList[i].id,
            type: this.resList.dataList[i].geoType,
            visualType: this.resList.dataList[i].visualType,
            filter: ["all"],
            data: this.resList.dataList[i],
            // "source-layer": "default"
          };
          this.showLayerTableList.push(newLayer);
        }
      }
    },
    addLayerToMap(newShpInfo) {
      //添加数据源
      if (newShpInfo.visualType == "shp") {
        map.addSource(newShpInfo.name + "_" + newShpInfo.id, {
          type: "raster",
          tiles: [newShpInfo.visualWebAddress],
          tileSize: 256, // 切片的最小展示尺寸（可选，单位：像素，默认值为 512，即 1024/2）
        });
        let newLayer = {
          show: true,
          name: newShpInfo.name,
          id: newShpInfo.id,
          source: newShpInfo.name + "_" + newShpInfo.id,
          type: "raster",
          visualType: newShpInfo.visualType,
          data: newShpInfo,
        };
        this.showLayerTableList.push(newLayer);
        map.addLayer(newLayer);
      } else if (newShpInfo.visualType == "tif") {
        map.addSource(newShpInfo.name + "_" + newShpInfo.id, {
          type: "raster",
          tiles: [newShpInfo.visualWebAddress],
          tileSize: 256, // 切片的最小展示尺寸（可选，单位：像素，默认值为 512，即 1024/2）
        });
        let newLayer = {
          show: true,
          name: newShpInfo.name,
          id: newShpInfo.id,
          source: newShpInfo.name + "_" + newShpInfo.id,
          type: "raster",
          visualType: newShpInfo.visualType,
          data: newShpInfo,
        };
        this.showLayerTableList.push(newLayer);
        map.addLayer(newLayer);
      } else if (newShpInfo.visualType == "geojson") {
        map.addSource(newShpInfo.id, {
          type: "geojson",
          // data: "http://172.21.212.63:8999/model/getShpJsonData?shpJsonPath="+newShpInfo.path,
          data: this.dataServer + newShpInfo.fileWebAddress,
        });
        //添加layer
        let newLayer = {
          show: true,
          name: newShpInfo.name,
          id: newShpInfo.id,
          source: newShpInfo.id,
          type: newShpInfo.type,
          paint: this.layerStyle[newShpInfo.type].paint,
          visualType: newShpInfo.visualType,
          data: newShpInfo,
        };
        this.showLayerTableList.push(newLayer);
        map.addLayer(newLayer);
      }
    },

    handleRemoveLayer(aimDataSourceId) {
      for (let i = 0; i < this.showLayerTableList.length; i++) {
        if (this.showLayerTableList[i].id === aimDataSourceId) {
          this.showLayerTableList.splice(i, 1);
          break;
        }
      }
      map.removeLayer(aimDataSourceId);
      map.removeSource(aimDataSourceId);
    },

    handleLayerClick() {},

    handleLayerEdit(index, row) {
      console.log("current edit row:", index, row);
    },

    handleLayerShowSwitchChange(val, row) {
      if (val) {
        this.handleLayoutChange(row.id, "visibility", "visible");
      } else {
        this.handleLayoutChange(row.id, "visibility", "none");
      }
    },

    handleEditBoardShow(val) {
      if (val) {
        this.editBoardShow = true;
        document.getElementsByClassName("model-tree")[0].style.opacity = "1";
        document.getElementsByClassName("model-tree")[0].style.transform = "";
      } else {
        this.editBoardShow = false;
        document.getElementsByClassName("model-tree")[0].style.opacity = "0";
        document.getElementsByClassName("model-tree")[0].style.transform =
          "scaleY(0.1)";
      }
    },

    handleLayoutChange(layerName, key, value) {
      console.log("layout:", layerName, key, value);
      map.setLayoutProperty(layerName, key, value);
    },

    handlePaintChange(layerName, key, value) {
      console.log("paint:", layerName, key, value);
      map.setPaintProperty(layerName, key, value);
    },

    //用dataSourceId判断，对象在数组中的位置，没有返回-1
    indexOfObject(dataList, aimDataSourceId) {
      for (let i = 0; i < dataList.length; i++) {
        if (dataList[i].dataSourceId === aimDataSourceId) {
          return i;
        }
      }
      return -1;
    },
    setDrawControlStyle() {
      // 添加自定义按钮
      let that = this;
      const drawBox = document.querySelector(".mapboxgl-ctrl-group");
      let saveButtonObj = document.createElement("button");
      // console.log(saveButtonObj);
      saveButtonObj.classList =
        "mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_save ivu-icon ivu-icon-md-filing";
      saveButtonObj.id = "mapbox-gl-draw_save";
      saveButtonObj.title = "保存";
      saveButtonObj.style.fontSize = "16px";
      drawBox.appendChild(saveButtonObj);
      saveButtonObj.addEventListener(
        "click",
        (e) => {
          that.saveTempGeojson();
        },
        true
      );
      let clipButtonObj = document.createElement("button");
      clipButtonObj.classList =
        "mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_clip ivu-icon ivu-icon-md-cut";
      clipButtonObj.id = "mapbox-gl-draw_clip";
      clipButtonObj.title = "裁剪";
      clipButtonObj.style.fontSize = "16px";
      drawBox.appendChild(clipButtonObj);
      clipButtonObj.addEventListener(
        "click",
        (e) => {
          that.clipModalShow();
        },
        true
      );
      let analysisButtonObj = document.createElement("button");
      analysisButtonObj.classList =
        "mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_analysis ivu-icon ivu-icon-logo-buffer";
      analysisButtonObj.id = "mapbox-gl-draw_analysis";
      analysisButtonObj.title = "数据分析";
      analysisButtonObj.style.fontSize = "16px";
      drawBox.appendChild(analysisButtonObj);
      analysisButtonObj.addEventListener(
        "click",
        (e) => {
          that.analysisModalShow();
        },
        true
      );
      let unionButtonObj = document.createElement("button");
      unionButtonObj.classList =
        "mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_union ivu-icon ivu-icon-md-square";
      unionButtonObj.id = "mapbox-gl-draw_union";
      unionButtonObj.title = "联合";
      unionButtonObj.style.fontSize = "16px";
      drawBox.appendChild(unionButtonObj);
      unionButtonObj.addEventListener(
        "click",
        (e) => {
          that.clipModalShow();
        },
        true
      );
      // 修改title
      const lineButton = document.querySelector(".mapbox-gl-draw_line");
      lineButton.setAttribute("title", "绘制线段");
      const polygonButton = document.querySelector(".mapbox-gl-draw_polygon");
      polygonButton.setAttribute("title", "绘制多边形");
      const trashButton = document.querySelector(".mapbox-gl-draw_trash");
      trashButton.setAttribute("title", "删除图形");
      // const combineButton = document.querySelector(".mapbox-gl-draw_combine");
      // combineButton.setAttribute("title", "合并");
      // const uncombineButton = document.querySelector(
      //   ".mapbox-gl-draw_uncombine"
      // );
      // uncombineButton.setAttribute("title", "取消合并");
    },
    updateArea() {
      this.geojson = this.draw.getAll();
      console.log(this.geojson);
    },
    saveTempGeojson() {
      if (
        this.geojson.features.length > 0 &&
        map.getSource(this.geojson.features[0].id) == undefined
      ) {
        map.addSource(this.geojson.features[0].id, {
          type: "geojson",
          data: this.geojson,
        });

        //添加layer
        let newLayer = {
          show: true,
          name: this.geojson.features[0].id,
          id: this.geojson.features[0].id,
          type: "fill",
          visualType: "geojson",
          filter: ["all"],
          layout: this.layerStyle["fill"].layout,
          maxzoom: 22,
          metadata: "",
          minzoom: 0,
          paint: this.layerStyle["fill"].paint,
          source: this.geojson.features[0].id,
          startEditor: false,
          data: {
            visualType: "geojson",
            sourceData: this.geojson,
          },
          // "source-layer": "default"
        };

        newLayer.paint["fill-color"] =
          "#" + Math.random().toString(16).substr(2, 6);
        this.showLayerTableList.push(newLayer);
        map.addLayer(newLayer);
        this.draw.deleteAll();
        this.geojson = {
          features: [],
          type: "FeatureCollection",
        };
      } else if (map.getSource(this.geojson.features[0].id) != undefined) {
        let tempId = this.geojson.features[0].id;
        this.updateMapSource(this.geojson.features[0].id);
        this.handleLayoutChange(tempId, "visibility", "visible");
        for (let i = 0; i < this.showLayerTableList.length; i++) {
          if (this.showLayerTableList[i].id == tempId) {
            this.showLayerTableList[i].startEditor = false;
          }
        }
      }
    },
    layer2JsonEditor(val, row) {
      // let layer = this.showLayerTableList[index];
      // console.log(val);
      if (val) {
        this.closeAllEditorStatus(row.id);
        this.handleLayoutChange(row.id, "visibility", "none");
        let data = map.getSource(row.id);
        this.draw.add(data._data);
        this.geojson = data._data;
      } else {
        this.updateMapSource(row.id);
        this.handleLayoutChange(row.id, "visibility", "visible");
      }
    },
    saveGeoJson2UserSpace(row) {
      if (row.startEditor != undefined) {
        let formData = new FormData();
        formData.append("sourceData", JSON.stringify(row.data.sourceData));
        formData.append("name", row.name);
        formData.append("labTaskId", this.taskInfo.id);
        formData.append("labTaskName", this.taskInfo.name);
        formData.append("userId", this.userInfo.id);
        axios({
          url: this.dataServer + "/saveLabGeoJsonFile",
          method: "post",
          data: formData,
        }).then(
          (res) => {
            console.log(res.data.data);
          },
          (err) => {
            console.log(err);
          }
        );
      } else {
        ElNotification({
          title: row.name,
          message: "该资源已保存！",
          type: "warning",
          duration: 500,
        });
      }
    },
    closeAllEditorStatus(id) {
      let list = this.showLayerTableList;
      for (let i = 0; i < list.length; i++) {
        if (list[i].startEditor && list[i].id != id) {
          this.updateMapSource(list[i].id);
          this.handleLayoutChange(list[i].id, "visibility", "visible");
          list[i].startEditor = false;
        }
      }
    },
    updateMapSource(id) {
      if (map.getSource(id) != undefined && this.geojson.features.length > 0) {
        let style = {};
        for (let i = 0; i < this.showLayerTableList.length; i++) {
          if (this.showLayerTableList[i].id == id) {
            style.layout = this.showLayerTableList[i].layout;
            style.paint = this.showLayerTableList[i].paint;
          }
        }
        map.removeLayer(id);
        map.removeSource(id);
        map.addSource(id, {
          type: "geojson",
          data: this.geojson,
        });
        //添加layer
        let newLayer = {
          show: true,
          name: id,
          id: id,
          type: "fill",
          visualType: "shp",
          filter: ["all"],
          layout: style.layout,
          maxzoom: 22,
          metadata: "",
          minzoom: 0,
          paint: style.paint,
          source: id,
          startEditor: false,
          data: {
            visualType: "shp",
            sourceData: this.geojson,
          },
          // "source-layer": "default"
        };

        // newLayer.paint["fill-color"] =
        //   "#" + Math.random().toString(16).substr(2, 6);
        // this.showLayerTableList.push(newLayer);
        map.addLayer(newLayer);
        this.draw.deleteAll();
        this.geojson = {
          features: [],
          type: "FeatureCollection",
        };
      }
    },
    clipModalShow() {
      this.clipModal = true;
      this.clipForm = {
        title: "输入要素",
        inputFeaturesName: "",
        clipFeaturesName: "",
        inputRaster: "",
        inputShp: "",
        outputFeaturesName: "",
      };
    },
    selectClipFeatures(type) {
      if (type == "inputRaster") {
        this.clipForm.title = "输入要素";
      } else if (type == "inputShp") {
        this.clipForm.title = "裁剪要素";
      }
      this.clipSelectFeaturesModal = true;
    },
    clipFormChange(name, type) {
      for (let i = 0; i < this.showLayerTableList.length; i++) {
        if (this.showLayerTableList[i].name == name && type == "raster") {
          this.clipForm.inputRaster =
            this.showLayerTableList[i].data.fileRelativePath;
        } else if (this.showLayerTableList[i].name == name && type == "shp") {
          if (
            this.showLayerTableList[i].data.fileRelativePath != undefined &&
            this.showLayerTableList[i].data.fileRelativePath != null &&
            this.showLayerTableList[i].data.fileRelativePath != "" &&
            this.showLayerTableList[i].data.visualType == "shp"
          ) {
            this.clipForm.inputShp =
              this.showLayerTableList[i].data.fileRelativePath;
            this.clipForm.isShp = true;
          } else {
            this.clipForm.jsonInfo = this.showLayerTableList[i];
            this.clipForm.isShp = false;
          }
        }
      }
      // console.log(this.clipForm);
    },
    commitClip() {
      let res = {};
      if (
        !this.clipForm.isShp &&
        this.clipForm.jsonInfo.startEditor != undefined
      ) {
        //需要保存
        this.saveGeoJson2UserSpace(this.clipForm.jsonInfo);
        res.fileRelativePath = "/data/" + this.clipForm.jsonInfo.name + ".json";
      } else if (!this.clipForm.isShp) {
        res = this.clipForm.jsonInfo.data;
      }
      let GDALClipDTO = {};
      if (this.clipForm.isShp) {
        GDALClipDTO.inputShpPath = this.clipForm.inputShp;
      } else {
        GDALClipDTO.inputGeoJson = res.fileRelativePath;
      }
      GDALClipDTO.inputRasterPath = this.clipForm.inputRaster;
      GDALClipDTO.outputTifName = this.clipForm.outputFeaturesName;
      if (GDALClipDTO.outputTifName.indexOf(".tif") < 0) {
        GDALClipDTO.outputTifName = GDALClipDTO.outputTifName + ".tif";
      }
      GDALClipDTO.isShp = this.clipForm.isShp;
      ElMessage({
        type: "info",
        message: "裁剪中，请稍等！",
      });
      axios({
        url: this.dataServer + "/script/gdalClip/" + this.taskInfo.id,
        method: "post",
        data: GDALClipDTO,
      }).then(
        (res) => {
          // console.log(res.data);
          if (res.data.code == 0) {
            localStorage.setItem("task", JSON.stringify(res.data.data));
            ElMessage({
              type: "success",
              message: "裁剪成功，正在加载数据...",
            });
            location.reload();
          }
        },
        (err) => {
          ElMessage({
            type: "error",
            message: "裁剪失败，请重试！",
          });
          console.log(err);
        }
      );
    },
    openTxtEditor(info) {
      this.$emit("openTxtEditor", info);
    },
    getCheckData(data){
      this.$emit("getCheckData", data);
    },
    getCheckTif(data){
      this.$emit("getCheckTif", data);
    },
    getCheckChart(data){
      this.$emit("getCheckChart", data);
    },
    getCheckJson(data){
      this.$emit("getCheckJson", data);
    },
    updateTxtInfo(res) {
      for (let i = 0; i < res.dataList.length; i++) {
        if (
          res.dataList[i].visualType == "txt" &&
          res.dataList[i].id == this.showLayerTableList[i].id
        ) {
          let newTxtLayer = {
            show: true,
            name: res.dataList[i].name,
            id: res.dataList[i].id,
            type: res.dataList[i].type,
            visualType: res.dataList[i].visualType,
            filter: ["all"],
            data: res.dataList[i],
            // "source-layer": "default"
          };
          this.showLayerTableList.splice(i, 1, newTxtLayer);
        }
      }
    },
    analysisModalShow() {
      this.analysisModal = true;
    },
    selectAnalysisFeatures(type) {
      this.analysisSelectFeaturesModal = true;
    },
    analysisFormChange(name, type) {
      for (let i = 0; i < this.showLayerTableList.length; i++) {
        if (this.showLayerTableList[i].name == name && type == "charts") {
          this.analysisForm.inputTxtPath =
            this.showLayerTableList[i].data.fileRelativePath;
        } else if (
          this.showLayerTableList[i].name == name &&
          type == "raster"
        ) {
          this.analysisForm.inputTxtPath =
            this.showLayerTableList[i].data.fileRelativePath;
        }
      }
      console.log(this.analysisForm);
    },
    commitAnalysis() {
      if (this.analysisForm.inputTxtPath != "") {
        ElMessage({
          type: "info",
          message: "正在统计分析中，请稍等！",
        });
        axios({
          url: this.dataServer + "/script/txtAnalysis/" + this.taskInfo.id,
          method: "post",
          data: this.analysisForm,
        }).then(
          (res) => {
            if (res.data.code == 0) {
              // localStorage.setItem("task", JSON.stringify(res.data.data));
              // location.reload();
              if (this.analysisForm.type == "charts") {
                let chartInfo = {};
                chartInfo.options = res.data.data;
                chartInfo.name = this.analysisForm.inputFeaturesName;
                chartInfo.id = this.analysisForm.inputTxtPath.substring(
                  this.analysisForm.inputTxtPath.length - 28,
                  this.analysisForm.inputTxtPath.length - 4
                );
                chartInfo.mapDataType = "chart";
                chartInfo.chartsType = this.analysisForm.chartsType;
                this.$emit("getCheckChart", chartInfo);
                this.analysisModal = false;
              } else if(this.analysisForm.type == "raster"){
                let chartInfo = {};
                chartInfo.options = res.data.data;
                chartInfo.name = this.analysisForm.inputFeaturesName;
                chartInfo.id = this.analysisForm.inputTxtPath.substring(
                  this.analysisForm.inputTxtPath.length - 28,
                  this.analysisForm.inputTxtPath.length - 4
                );
                chartInfo.mapDataType = "raster";
                chartInfo.dateNum = this.analysisForm.dateNum;
                this.$emit("getCheckChart", chartInfo);
                this.analysisModal = false;
              }
            }
          },
          (err) => {
            ElMessage({
              type: "error",
              message: "分析失败，请重试！",
            });
            console.log(err);
          }
        );
      } else {
        ElMessage({
          type: "error",
          message: "提交失败，请检查数据并重试！",
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.mapbox-page {
  position: absolute;
  width: 100%;
  height: 100vh;
  top: 0px;
  bottom: 0px;
}

#map {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}

.map-zoom-lnglat {
  position: absolute;
  bottom: 60px;
  right: 50px;
  z-index: 99;
  /*background-color: #ffffff !important;*/
  font-size: 13px;
}

.edit-board {
  position: absolute;
  top: 110px;
  left: 40px;
  z-index: 1009;
  background-color: white;
  width: 350px;
  height: auto;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  box-shadow: 0 3.2px 7.2px 0 rgb(0 0 0 / 13%), 0 0.6px 1.8px 0 rgb(0 0 0 / 11%);
  padding: 10px;
}

.flex-row-start {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}
/deep/.mapboxgl-ctrl-top-right {
  margin-top: 3.5%;
}

/deep/.el-collapse-item__header.is-active {
  border-bottom-color: transparent;
  font-size: 16px;
  font-weight: 900;
}
/deep/.el-collapse-item__content{
  padding-bottom:0;
  position: relative;
  z-index: 1002;
  max-height:40vh !important;
  overflow: scroll !important;
}
.lyric-enter-from,
.lyric-leave-to {
  opacity: 0.1;
  transform-origin: 100% 0;
  transform: scaleY(0.1);

  // height: 10px;
  // width: 84px;
}
.lyric-enter-to,
.lyric-leave-from {
  opacity: 1;
}
.lyric-enter-active,
.lyric-leave-active {
  transition: all 0.5s;
}
</style>
