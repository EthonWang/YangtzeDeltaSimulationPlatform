<template>
  <div class="mapbox-page">
    <!-- <ModelConfig :modelId="modelId" ref="refModelConfig"> </ModelConfig> -->
    <div class="boxdraw"></div>
    <!-- 对编辑工具的描述 -->
    <div class="des_icon" style="">
      <div style="height: 29px">绘制线段</div>
      <div style="height: 29px">绘制多边形</div>
      <div style="height: 29px">删除绘制内容</div>
      <div style="height: 29px">保存绘制内容</div>
      <div style="height: 29px">图像裁剪</div>
      <div style="height: 29px">数据图表分析</div>
      <div style="height: 29px">新建txt文件</div>
      <div style="height: 29px">按矩形选择</div>
      <div style="height: 29px">更多工具</div>
    </div>

    <!-- 显示鼠标所在经纬度以及缩放层级 -->
    <el-tag class="map-zoom-lnglat" type="info">
      Zoom:{{ zoom }} &nbsp; LngLat:{{ showCenter }}
    </el-tag>
    <!-- 显示所选要素个数 -->
    <el-tag class="selectfeature_num" type="info">
      所选要素个数:{{ features_selected.length }}
    </el-tag>

    <!-- 控制编辑框开关的按钮 -->
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

    <!-- 数据与模型视图 -->
    <transition-group name="lyric">
      <div class="edit-board" v-if="editBoardShow">
        <el-collapse
          v-model="activeNames"
          @change="handleChange"
          style="position: relative; z-index: 1005"
        >
          <!-- 数据列表 -->
          <el-collapse-item title="数据列表" name="data" class="draggable">
            <!-- 数据筛选框：全部数据、可视化数据、输入数据、结果数据 -->
            <el-select
              v-model="value"
              class="m-2"
              placeholder="Select"
              size="small"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <!-- 数据表格 -->
            <el-table
              :data="showLayerTableList_filter"
              ref="shpLayerTable"
              row-key="id"
              size="small"
              style="width: 100%"
            >
              <!-- 表格中的每一列 -->
              <!-- 控制图层显示与否的按钮，如果canShow则按钮可以进行操作，否则按钮被禁止 -->
              <el-table-column width="50">
                <template #default="scope">
                  <el-switch
                    :width="30"
                    v-model="scope.row.show"
                    v-if="
                      canShow(scope.row.visualType) &&
                      scope.row.visualType != 'txt' &&
                      scope.row.visualType != 'json'
                    "
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
              <!-- 数据的类型csv、txt、geojson等-->
              <el-table-column
                label="类型"
                prop="visualType"
                min-width="50"
                show-overflow-tooltip
              >
              </el-table-column>
              <!-- 数据的名称 -->
              <el-table-column
                label="名称"
                prop="name"
                min-width="130"
                show-overflow-tooltip
              >
              </el-table-column>
              <!-- 控制对数据的操作，如果是txt文件则可以打开文本编辑框编辑文本信息，如果是geojson数据可以修改其颜色透明度等 -->
              <el-table-column label="操作" min-width="90">
                <template #default="scope">
                  <el-popover
                    placement="right"
                    title="查看信息或编辑文本"
                    width="250"
                    trigger="click"
                  >
                    <!--点图层编辑-->
                    <div
                      v-if="
                        scope.row.type == 'circle' &&
                        scope.row.data.visualType == 'shp'
                      "
                    >
                      {{ scope.row.name }}
                      <div class="flex-row-start">
                        <h3 style="width: 100px">颜色:</h3>
                        <el-input
                          v-model="
                            showLayerTableList_filter[scope.$index].paint[
                              'circle-color'
                            ]
                          "
                          @change="
                            handlePaintChange(
                              showLayerTableList_filter[scope.$index]['id'],
                              'circle-color',
                              showLayerTableList_filter[scope.$index].paint[
                                'circle-color'
                              ]
                            )
                          "
                          placeholder="something"
                          size="small"
                        ></el-input>
                        <el-color-picker
                          v-model="
                            showLayerTableList_filter[scope.$index].paint[
                              'circle-color'
                            ]
                          "
                          @change="
                            handlePaintChange(
                              showLayerTableList_filter[scope.$index]['id'],
                              'circle-color',
                              showLayerTableList_filter[scope.$index].paint[
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
                            showLayerTableList_filter[scope.$index].paint[
                              'circle-radius'
                            ]
                          "
                          @change="
                            handlePaintChange(
                              showLayerTableList_filter[scope.$index]['id'],
                              'circle-radius',
                              showLayerTableList_filter[scope.$index].paint[
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
                            showLayerTableList_filter[scope.$index].paint[
                              'circle-opacity'
                            ]
                          "
                          @change="
                            handlePaintChange(
                              showLayerTableList_filter[scope.$index]['id'],
                              'circle-opacity',
                              showLayerTableList_filter[scope.$index].paint[
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
                            showLayerTableList_filter[scope.$index].paint[
                              'circle-blur'
                            ]
                          "
                          @change="
                            handlePaintChange(
                              showLayerTableList_filter[scope.$index]['id'],
                              'circle-blur',
                              showLayerTableList_filter[scope.$index].paint[
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

                    <!--线图层编辑-->
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
                            showLayerTableList_filter[scope.$index].paint[
                              'line-color'
                            ]
                          "
                          @change="
                            handlePaintChange(
                              showLayerTableList_filter[scope.$index]['id'],
                              'line-color',
                              showLayerTableList_filter[scope.$index].paint[
                                'line-color'
                              ]
                            )
                          "
                          placeholder="something"
                          size="small"
                        ></el-input>
                        <el-color-picker
                          v-model="
                            showLayerTableList_filter[scope.$index].paint[
                              'line-color'
                            ]
                          "
                          @change="
                            handlePaintChange(
                              showLayerTableList_filter[scope.$index]['id'],
                              'line-color',
                              showLayerTableList_filter[scope.$index].paint[
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
                            showLayerTableList_filter[scope.$index].paint[
                              'line-width'
                            ]
                          "
                          @change="
                            handlePaintChange(
                              showLayerTableList_filter[scope.$index]['id'],
                              'line-width',
                              showLayerTableList_filter[scope.$index].paint[
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
                            showLayerTableList_filter[scope.$index].paint[
                              'line-opacity'
                            ]
                          "
                          @change="
                            handlePaintChange(
                              showLayerTableList_filter[scope.$index]['id'],
                              'line-opacity',
                              showLayerTableList_filter[scope.$index].paint[
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
                            showLayerTableList_filter[scope.$index].paint[
                              'line-blur'
                            ]
                          "
                          @change="
                            handlePaintChange(
                              showLayerTableList_filter[scope.$index]['id'],
                              'line-blur',
                              showLayerTableList_filter[scope.$index].paint[
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
                            showLayerTableList_filter[scope.$index].paint[
                              'line-dasharray'
                            ][0]
                          "
                          @change="
                            handlePaintChange(
                              showLayerTableList_filter[scope.$index]['id'],
                              'line-dasharray',
                              showLayerTableList_filter[scope.$index].paint[
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
                            showLayerTableList_filter[scope.$index].paint[
                              'line-dasharray'
                            ][1]
                          "
                          @change="
                            handlePaintChange(
                              showLayerTableList_filter[scope.$index]['id'],
                              'line-dasharray',
                              showLayerTableList_filter[scope.$index].paint[
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

                    <!--面图层编辑-->
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
                            showLayerTableList_filter[scope.$index].paint[
                              'fill-color'
                            ]
                          "
                          @change="
                            handlePaintChange(
                              showLayerTableList_filter[scope.$index]['id'],
                              'fill-color',
                              showLayerTableList_filter[scope.$index].paint[
                                'fill-color'
                              ]
                            )
                          "
                          placeholder="something"
                          size="small"
                        ></el-input>
                        <el-color-picker
                          v-model="
                            showLayerTableList_filter[scope.$index].paint[
                              'fill-color'
                            ]
                          "
                          @change="
                            handlePaintChange(
                              showLayerTableList_filter[scope.$index]['id'],
                              'fill-color',
                              showLayerTableList_filter[scope.$index].paint[
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
                            showLayerTableList_filter[scope.$index].paint[
                              'fill-outline-color'
                            ]
                          "
                          @change="
                            handlePaintChange(
                              showLayerTableList_filter[scope.$index]['id'],
                              'fill-outline-color',
                              showLayerTableList_filter[scope.$index].paint[
                                'fill-outline-color'
                              ]
                            )
                          "
                          placeholder="something"
                          size="small"
                        ></el-input>
                        <el-color-picker
                          v-model="
                            showLayerTableList_filter[scope.$index].paint[
                              'fill-outline-color'
                            ]
                          "
                          @change="
                            handlePaintChange(
                              showLayerTableList_filter[scope.$index]['id'],
                              'fill-outline-color',
                              showLayerTableList_filter[scope.$index].paint[
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
                            showLayerTableList_filter[scope.$index].paint[
                              'fill-opacity'
                            ]
                          "
                          @change="
                            handlePaintChange(
                              showLayerTableList_filter[scope.$index]['id'],
                              'fill-opacity',
                              showLayerTableList_filter[scope.$index].paint[
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
                          showLayerTableList_filter[scope.$index].startEditor !=
                          undefined
                        "
                      >
                        <h3 style="width: 200px">矢量编辑:</h3>
                        <el-switch
                          :width="30"
                          v-model="
                            showLayerTableList_filter[scope.$index].startEditor
                          "
                          @change="layer2JsonEditor($event, scope.row)"
                        ></el-switch>
                      </div>
                      <div
                        class="flex-row-start"
                        v-if="
                          showLayerTableList_filter[scope.$index].startEditor !=
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
                    <!--栅格层编辑-->
                    <div v-else-if="scope.row.data.visualType == 'tif'"></div>
                    <!--栅格层编辑-->
                    <div v-else-if="scope.row.data.visualType == 'dataSet'">
                      <el-scrollbar max-height="40vh">
                        <el-table
                          :data="scope.row.data.dataSetList"
                          style="width: 100%"
                        >
                          <el-table-column
                            prop="visualType"
                            label="Type"
                            width="60"
                          />
                          <el-table-column
                            prop="name"
                            label="Name"
                            width="200"
                          />
                        </el-table>
                      </el-scrollbar>
                    </div>
                    <!--文本编辑-->
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
                        v-if="
                          canShow(scope.row.visualType) &&
                          scope.row.visualType != 'tif' &&
                          scope.row.visualType != 'shp'
                        "
                      >
                        操作
                      </el-button>
                      <el-button v-else size="small" type="info" disabled>
                        操作
                      </el-button>
                    </template>
                  </el-popover>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
          <!-- 模型列表 -->
          <el-collapse-item
            title="模型列表"
            name="model"
            style="position: relative; z-index: 1005"
          >
            <ModelTree
              style="
                width: 100%;
                height: 100%;
                position: relative;
                z-index: 1005;
              "
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

  <!-- 选择裁剪输入数据的弹窗 -->
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
        <Radio
          :label="item.name"
          v-if="item.visualType == 'tif' || item.visualType == 'dataSet'"
        >
          <span v-if="item.visualType == 'tif'">{{ item.name }}</span>
          <span v-if="item.visualType == 'dataSet'"
            >{{ item.name }} (批量操作)</span
          >
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

  <!-- 数据分析的弹窗-->

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
  <Modal v-model="newTxtModal">
    <template #header>
      <Icon type="md-square" size="18" />
      <span style="margin-left: 5px; font-size: 18px">新建文本文件</span>
    </template>
    <span>名称：</span>
    <Input v-model="newTxtFileName" style="width: 90%"></Input>
    <template #footer>
      <Button @click="newTxtModal = false">取消</Button>
      <Button type="primary" @click="commitNewTxt()">确定创建</Button>
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
  <!-- 输入新创建要素的名称弹窗 -->
  <Modal v-model="FeatureNameCollect">
    <template #header>
      <Icon type="md-square" size="18" />
      <span style="margin-left: 5px; font-size: 18px">输入要素名称</span>
    </template>
    <span>名称：</span>
    <Input v-model="newFeatureName" style="width: 90%"></Input>
    <template #footer>
      <Button @click="FeatureNameCollect = false">取消</Button>
      <Button type="primary" @click="saveNewGeojson()">保存要素</Button>
    </template>
  </Modal>
  <!-- 选择要选择的要素类弹窗 -->
  <Modal
    v-model="selectedfeaturesshow"
    draggable
    sticky
    scrollable
    :mask="false"
    @on-ok="setselectfeature()"
    @on-cancel="cancel"
  >
    <template #header>
      <Icon type="md-cut" size="18" />
      <span style="margin-left: 5px; font-size: 18px">选择被选要素</span>
    </template>
    <RadioGroup v-model="featureclass_to_select" vertical>
      <div v-for="(item, index) in showLayerTableList" :key="index">
        <Radio
          :label="item.name"
          v-if="item.visualType == 'geojson' || item.visualType == 'shp'"
        >
          <span v-if="item.visualType == 'geojson'">{{ item.name }}</span>
          <span v-if="item.visualType == 'shp'">{{ item.name }}</span>
        </Radio>
      </div>
    </RadioGroup>
  </Modal>
  <!-- 更多工具弹窗 -->
  <Drawer
    :closable="true"
    v-model="showmore"
    width="50"
    style="position: relative; z-index: 1100"
  >
    <Layout>
      <Header>
        <Menu
          mode="horizontal"
          theme="dark"
          active-name="1"
          @on-select="changeview"
        >
          <div class="layout-logo"></div>
          <div class="layout-nav">
            <MenuItem name="1">
              <Icon type="ios-navigate"></Icon>
              数据处理服务
            </MenuItem>
            <MenuItem name="2">
              <Icon type="ios-keypad"></Icon>
              第三方插件
            </MenuItem>
            <MenuItem name="3">
              <Icon type="ios-analytics"></Icon>
              在线编码
            </MenuItem>
          </div>
        </Menu>
      </Header>
      <Content :style="{ padding: '0 10px' }">
        <Card style="margin-top: 20px">
          <dataprocess v-if="dataproshow == 1"></dataprocess>
          <thirdparty v-if="dataproshow == 2"></thirdparty>
          <programol v-if="dataproshow == 3"></programol>
        </Card>
      </Content>
    </Layout>
  </Drawer>
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
import dataprocess from "@/components/dataprocess/dataprocess.vue";
import programol from "@/components/dataprocess/programol";
import thirdparty from "@/components/dataprocess/thirdparty.vue";
import Sortable from "sortablejs";
import { Encrypt, Decrypt } from "@/util/codeUtil";

var map = null;

export default {
  name: "MapboxView",
  props: ["shpShowList"], //shpShowList为前端勾选的要展示在地图上的shp，格式为[{name:"",type:"",nameId:""}]
  components: {
    ModelTree,
    dataprocess,
    programol,
    thirdparty,
  },
  data() {
    return {
      value: "装载...",

      options: [
        {
          value: "all",
          label: "全部数据",
        },
        {
          value: "visual",
          label: "可视化或可操作",
        },
        {
          value: "input",
          label: "输入数据",
        },
        {
          value: "result",
          label: "结果数据",
        },
      ],
      falseShow: false,
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
      showLayerTableList_filter: [],
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
      newTxtModal: false,
      newTxtFileName: "",

      activeNames: ["data", "model"],
      resList: {
        modelList: [],
        dataList: [],
      },
      taskInfo: JSON.parse(Decrypt(localStorage.getItem("task"))),
      userInfo: JSON.parse(Decrypt(localStorage.getItem("userInfo"))),
      dataServer: useStore().getters.devIpAddress,
      FeatureNameCollect: false,
      newFeatureName: "",
      canvas: null,
      start: null,
      current: null,
      box: null,
      //控制是否在选择中的按钮
      selecton: false,
      //要选择的要素类的名称
      featureclass_to_select: null,
      //控制选择要素类弹窗是否显示的变量
      selectedfeaturesshow: false,
      //要选择的要素类的数据源
      source_to_select: null,
      //要选择的要素类的数据id
      id_to_select: null,
      //选择到的要素
      features_selected: [],
      //更多
      showmore: false,
      //展示的数据处理
      dataproshow: true,
    };
  },

  watch: {
    showLayerTableList: {
      handler(newVal, oldVal) {
        this.showLayerTableList_filter = newVal;
        // console.log(this.showLayerTableList_filter)
        let that = this;
        setTimeout(() => {
          let t = that.value;
          that.value = "装载...";
          that.value = t;
        }, 200);
      },
    },
    value: {
      handler(newval, oldval) {
        if (newval == "all") {
          this.showLayerTableList_filter = this.showLayerTableList;
        } else if (newval == "visual") {
          this.showLayerTableList_filter = this.showLayerTableList.filter(
            (item) => this.canShow(item.visualType)
          );
        } else if (newval == "input") {
          this.showLayerTableList_filter = this.showLayerTableList.filter(
            (item) => !item.name.includes("result")
          );
        } else if (newval == "result") {
          this.showLayerTableList_filter = this.showLayerTableList.filter(
            (item) => item.name.includes("result")
          );
        }
      },
    },
    showLayerTableList_filter: {
      handler(newVal, oldVal) {
        this.rowDrop();
      },
    },
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
        setTimeout(() => {
          that.value = "all";
          setTimeout(() => {
            that.rowDrop();
          }, 500);
        }, 500);
      }, 500);
    }, 500);
  },

  methods: {
    //数据部分后台未完成，暂时删掉了部分代码，不然报错
    canShow(type) {
      if (
        type == "shp" ||
        type == "tif" ||
        type == "geojson" ||
        type == "txt"
      ) {
        return true;
      } else {
        return false;
      }
    },
    initMap() {
      //令牌
      mapboxgl.accessToken =
        "pk.eyJ1Ijoid3lqcSIsImEiOiJjbDBnZDdwajUxMXRzM2htdWxubDh1MzJrIn0.2e2_rdU2nOUvtwltBIZtZg";
      //底图加载
      map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/dark-v10",
        center: [118, 32],
        zoom: 6,
      });
      //汉化
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
      map.on("load", () => {
        this.canvas = map.getCanvasContainer();
        // console.log(this.canvas);
        this.canvas.addEventListener("mousedown", this.mouseDown, true);
      });

      map.on("contextmenu", (e) => {
        console.log(e.lngLat);
      });
    },
    mouseDown(e) {
      // Continue the rest of the function if the shiftkey is pressed.
      if (!this.selecton) return;

      // Disable default drag zooming when the shift key is held down.
      map.dragPan.disable();

      // Call functions for the following events
      document.addEventListener("mousemove", this.onMouseMove);
      document.addEventListener("mouseup", this.onMouseUp);
      document.addEventListener("keydown", this.onKeyDown);
      const b = document.querySelector(".boxdraw");
      b.style.border = "2px solid #3887be";
      // Capture the first xy coordinates
      this.start = this.mousePos(e);
    },

    mousePos(e) {
      const rect = this.canvas.getBoundingClientRect();
      return new mapboxgl.Point(
        e.clientX - rect.left - this.canvas.clientLeft,
        e.clientY - rect.top - this.canvas.clientTop
      );
    },
    onMouseMove(e) {
      // Capture the ongoing xy coordinates
      this.current = this.mousePos(e);

      // Append the box element if it doesnt exist
      if (!this.box) {
        // this.box = document.createElement("div");
        // const mapboxpage = document.querySelector(".mapbox-page");
        this.box = document.querySelector(".boxdraw");
        // mapboxpage.appendChild(this.box);
        // mapboxpage.insertBefore(this.box, mapboxpage.nextElementSibling);
        // this.box.classList.add("boxdraw");
        // console.log(this.box);
        // console.log(this.canvas);
        // const canvass = document.querySelector(".mapboxgl-canvas");
        this.canvas.appendChild(this.box);
      }

      const minX = Math.min(this.start.x, this.current.x),
        maxX = Math.max(this.start.x, this.current.x),
        minY = Math.min(this.start.y, this.current.y),
        maxY = Math.max(this.start.y, this.current.y);

      // Adjust width and xy position of the box element ongoing
      const pos = `translate(${minX}px, ${minY}px)`;
      this.box.style.transform = pos;
      this.box.style.width = maxX - minX + "px";
      this.box.style.height = maxY - minY + "px";
      // this.box.style.backgroundColor = "rgba(56, 135, 190, 0.1)";
      // this.box.style.position = "absolute";
      // this.box.left = 0;
    },

    onMouseUp(e) {
      // Capture xy coordinates
      this.finish([this.start, this.mousePos(e)]);
    },

    onKeyDown(e) {
      // If the ESC key is pressed
      if (e.keyCode === 27) this.finish();
    },
    finish(bbox) {
      let that = this;
      // Remove these events now that finish has been called.
      document.removeEventListener("mousemove", this.onMouseMove);
      document.removeEventListener("keydown", this.onKeyDown);
      document.removeEventListener("mouseup", this.onMouseUp);

      if (this.box) {
        this.box.style.width = "0px";
        this.box.style.height = "0px";
        this.box.style.border = "0px";
        // this.box.parentNode.removeChild(this.box);
        // this.box = null;
      }

      // If bbox exists. use this value as the argument for `queryRenderedFeatures`
      if (bbox) {
        const features = map.queryRenderedFeatures(bbox, {
          layers: [this.id_to_select],
        });
        this.features_selected = Array.from(new Set(features));
        for (let i = 0; i < this.features_selected.length; i++) {
          for (let j = i + 1; j < this.features_selected.length; j++) {
            if (
              this.features_selected[i].properties.id ==
              this.features_selected[j].properties.id
            ) {
              this.features_selected.splice(j, 1);
              j--;
            }
          }
        }
        // for (let i = 0; i < features.length; i++) {
        //   let layerproperties = {
        //     id: i,
        //   };
        //   features[i].properties = layerproperties;
        // }

        // if (features.length >= 1000) {
        //   return window.alert("Select a smaller number of features");
        // }

        // Run through the selected features and set a filter
        // to match features with unique FIPS codes to activate
        // the `counties-highlighted` layer.
        const fips = features.map((item) => item.properties.id);
        // console.log(fips);
        map.setFilter("highlighted", ["in", "id", ...fips]);
        let temp;
        for (var i = 0; i < this.showLayerTableList_filter.length; i++) {
          if (
            this.showLayerTableList[i].visualType == "tif" ||
            this.showLayerTableList[i].visualType == "shp" ||
            this.showLayerTableList[i].visualType == "geojson"
          ) {
            break;
          }
        }
        map.moveLayer("highlighted", this.showLayerTableList[temp]);
      }

      map.dragPan.enable();
      this.selecton = false;
    },

    filterResList() {
      for (let i = 0; i < this.taskInfo.dataList.length; i++) {
        if (this.taskInfo.dataList[i].simularTrait == "task") {
          continue;
        }
        if (this.taskInfo.dataList[i].type == "model") {
          this.resList.modelList.push(this.taskInfo.dataList[i]);
        } else {
          this.resList.dataList.push(this.taskInfo.dataList[i]);
        }
      }
      // this.resList = this.data_list;
    },
    initShpShowList() {
      console.log(this.resList);
      for (let i = 0; i < this.resList.dataList.length; i++) {
        // console.log("simular :", this.resList.dataList[i]);
        if (this.resList.dataList[i].mdl != undefined) {
          continue;
        }
        if (
          this.resList.dataList[i].visualType == "shp" ||
          this.resList.dataList[i].visualType == "tif" ||
          this.resList.dataList[i].visualType == "geojson" ||
          this.resList.dataList[i].visualType == "dataSet" ||
          this.resList.dataList[i].visualType == "asc"
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
          this.showLayerTableList.unshift(newLayer);
        }
      }
    },
    //更新数据用这个
    addLayerToMap(newShpInfo) {
      // console.log(newShpInfo.visualWebAddress);
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
        this.showLayerTableList.unshift(newLayer);
        map.addLayer(newLayer);
      } else if (
        newShpInfo.visualType == "tif" ||
        newShpInfo.visualType == "dataSet" ||
        newShpInfo.visualType == "asc"
      ) {
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
        this.showLayerTableList.unshift(newLayer);
        map.addLayer(newLayer);
      } else if (newShpInfo.visualType == "geojson") {
        console.log(newShpInfo);
        map.addSource(newShpInfo.id, {
          type: "geojson",
          // data: "http://172.21.212.63:8999/model/getShpJsonData?shpJsonPath="+newShpInfo.path,
          data: this.dataServer + newShpInfo.fileWebAddress,
        });
        console.log(newShpInfo.type);
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
          startEditor: false,
        };
        this.showLayerTableList.unshift(newLayer);
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
      //保存按钮
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
      //裁剪按钮
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
      //数据分析按钮
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
      //新建文本文件
      let unionButtonObj = document.createElement("button");
      unionButtonObj.classList =
        "mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_union ivu-icon ivu-icon-md-square";
      unionButtonObj.id = "mapbox-gl-draw_union";
      unionButtonObj.title = "新建文本文件";
      unionButtonObj.style.fontSize = "16px";
      drawBox.appendChild(unionButtonObj);
      unionButtonObj.addEventListener(
        "click",
        (e) => {
          that.newTxtModalShow();
        },
        true
      );
      // 按空间位置选择要素按钮
      let selectButtonObj = document.createElement("button");
      selectButtonObj.classList =
        "mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_select ivu-icon ivu-icon-ios-crop";
      selectButtonObj.id = "mapbox-gl-draw_select";
      selectButtonObj.title = "按矩形选择";
      selectButtonObj.style.fontSize = "16px";
      drawBox.appendChild(selectButtonObj);
      selectButtonObj.addEventListener(
        "click",
        (e) => {
          that.selectedfeaturesshow = true;
          if (map.getLayer("highlighted")) {
            map.removeLayer("highlighted");
          }
        },
        true
      );
      //更多
      let moreButtonObj = document.createElement("button");
      moreButtonObj.classList =
        "mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_more ivu-icon ivu-icon-md-more";
      moreButtonObj.id = "mapbox-gl-draw_more";
      moreButtonObj.title = "更多";
      moreButtonObj.style.fontSize = "16px";
      drawBox.appendChild(moreButtonObj);
      moreButtonObj.addEventListener(
        "click",
        (e) => {
          that.showmore = true;
          that.handleEditBoardShow(0);
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
      const combineButton = document.querySelector(".mapbox-gl-draw_union");
      combineButton.setAttribute("title", "新建文本文件");
      const selectButton = document.querySelector(".mapbox-gl-draw_select");
      selectButton.setAttribute("title", "按矩形选择");
      const more = document.querySelector(".mapbox-gl-draw_more");
      more.setAttribute("title", "更多");
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
      //对新创建的进行保存
      if (
        this.geojson.features.length > 0 &&
        map.getSource(this.geojson.features[0].id) == undefined
      ) {
        this.getTempFeatureNameShow();
      }
      //对已有的数据进行保存操作
      else if (map.getSource(this.geojson.features[0].id) != undefined) {
        this.saveoldGeojson();
      }
    },
    getTempFeatureNameShow() {
      this.FeatureNameCollect = true;
    },
    saveNewGeojson() {
      for (var i = 0; i < this.geojson.features.length; i++) {
        let properties = {
          id: i,
        };
        this.geojson.features[i].properties = properties;
      }

      map.addSource(this.geojson.features[0].id, {
        type: "geojson",
        data: this.geojson,
      });
      let newLayer = {
        show: true,
        name: this.newFeatureName,
        id: this.geojson.features[0].id,
        type: "line",
        visualType: "geojson",
        layout: this.layerStyle["line"].layout,
        maxzoom: 22,
        metadata: "",
        minzoom: 0,
        paint: this.layerStyle["line"].paint,
        source: this.geojson.features[0].id,
        // startEditor: false,
        data: {
          visualType: "geojson",
          sourceData: this.geojson,
        },
        // "source-layer": "default"
      };
      // console.log(newLayer);
      if (this.geojson.features[0].geometry.type == "Polygon") {
        newLayer.type = "fill";
        newLayer.layout = this.layerStyle["fill"].layout;
        newLayer.paint = this.layerStyle["fill"].paint;
        newLayer.paint["fill-color"] =
          "#" + Math.random().toString(16).substr(2, 6);
      }
      // this.showLayerTableList_filter.unshift(newLayer);
      this.showLayerTableList.unshift(newLayer);
      this.showLayerTableList_filter = this.showLayerTableList;
      map.addLayer(newLayer);
      this.draw.deleteAll();
      this.geojson = {
        features: [],
        type: "FeatureCollection",
      };
      this.FeatureNameCollect = false;
    },

    saveoldGeojson() {
      let tempId = this.geojson.features[0].id;
      this.updateMapSource(this.geojson.features[0].id);
      this.handleLayoutChange(tempId, "visibility", "visible");
      for (let i = 0; i < this.showLayerTableList.length; i++) {
        if (this.showLayerTableList[i].id == tempId) {
          this.showLayerTableList[i].startEditor = false;
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
        console.log(data);
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
          if (this.showLayerTableList[i].visualType == "tif") {
            this.clipForm.inputRaster =
              this.showLayerTableList[i].data.fileRelativePath;
          } else if (this.showLayerTableList[i].visualType == "dataSet") {
            this.clipForm.inputRasterList =
              this.showLayerTableList[i].data.dataSetList;
          }
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
      console.log(this.clipForm);
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
      if (
        this.clipForm.inputRaster != "" &&
        this.clipForm.inputFeaturesName.indexOf("_dataSet") < 0
      ) {
        GDALClipDTO.inputRasterPath = this.clipForm.inputRaster;
      } else {
        //集操作
        GDALClipDTO.inputRasterPath = "";
        GDALClipDTO.inputRasterListPath = this.clipForm.inputRasterList;
      }
      GDALClipDTO.outputTifName = this.clipForm.outputFeaturesName;
      if (
        GDALClipDTO.outputTifName.indexOf(".tif") < 0 &&
        this.clipForm.inputFeaturesName.indexOf("_dataSet") < 0
      ) {
        GDALClipDTO.outputTifName = GDALClipDTO.outputTifName + ".tif";
      }
      GDALClipDTO.isShp = this.clipForm.isShp;
      ElMessage({
        type: "info",
        message: "裁剪中，请稍等！",
      });
      axios({
        url:
          this.dataServer +
          "/script/gdalClip/" +
          this.taskInfo.id +
          "/" +
          this.userInfo.id,
        method: "post",
        data: GDALClipDTO,
      }).then(
        (res) => {
          // console.log(res.data);
          if (res.data.code == 0) {
            localStorage.setItem(
              "task",
              Encrypt(JSON.stringify(res.data.data))
            );
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
    getCheckData(data) {
      this.$emit("getCheckData", data);
    },
    getCheckTif(data) {
      this.$emit("getCheckTif", data);
    },
    getCheckChart(data) {
      this.$emit("getCheckChart", data);
    },
    getCheckJson(data) {
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
      console.log(JSON.parse(JSON.stringify(this.analysisForm)));
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
              } else if (this.analysisForm.type == "raster") {
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
    newTxtModalShow() {
      this.newTxtModal = true;
    },
    commitNewTxt() {
      let formData = new FormData();
      formData.append("userId", this.userInfo.id);
      formData.append("name", this.newTxtFileName);
      axios({
        url: this.dataServer + "/LabTask/newLabTxtFile/" + this.taskInfo.id,
        method: "post",
        data: formData,
      }).then(
        (res) => {
          // console.log(res.data);
          if (res.data.code == 0) {
            localStorage.setItem(
              "task",
              Encrypt(JSON.stringify(res.data.data))
            );
            let newTxtData =
              res.data.data.dataList[res.data.data.dataList.length - 1];
            let newTxtLayer = {
              show: true,
              name: newTxtData.name,
              id: newTxtData.id,
              type: newTxtData.type,
              visualType: newTxtData.visualType,
              filter: ["all"],
              data: newTxtData,
              // "source-layer": "default"
            };
            this.showLayerTableList.push(newTxtLayer);
            this.newTxtFileName = "";
            this.newTxtModal = false;
            ElMessage({
              type: "success",
              message: "创建成功！",
            });
          }
        },
        (err) => {
          ElMessage({
            type: "error",
            message: "创建失败，请重试！",
          });
          console.log(err);
        }
      );
    },
    rowDrop() {
      this.$nextTick(() => {
        // 此时找到的元素是要拖拽元素的父容器
        let tbody = document.querySelector(
          ".draggable .el-table__body-wrapper tbody"
        );
        // console.log(tbody);
        let _this = this;
        Sortable.create(tbody, {
          //  指定父元素下可被拖拽的子元素
          draggable: ".draggable .el-table__row",
          onEnd(evt) {
            // console.log(typeof _this.showLayerTableList_filter);
            // console.log(_this.showLayerTableList_filter);
            _this.showLayerTableList_filter.splice(
              evt.newIndex,
              0,
              _this.showLayerTableList_filter.splice(evt.oldIndex, 1)[0]
            );
            var newArray1 = [];
            newArray1 = _this.showLayerTableList_filter.slice(0);
            // console.log(newArray1);
            _this.showLayerTableList_filter = [];
            _this.showLayerTableList_filter = newArray1;
            // console.log(_this.showLayerTableList_filter);
            console.log(evt.oldIndex, evt.newIndex);
            // 如果是从下往上移动，则oldIndex>newIndex且应该是将此图层移到index>=newIndex的所有图层上方
            if (evt.oldIndex > evt.newIndex) {
              console.log(map);
              // temp记录的是距离newIndex图层最近的可以显示的图层
              let temp = _this.showLayerTableList_filter.length;
              for (let i = evt.oldIndex; i >= evt.newIndex + 1; i--) {
                if (
                  _this.showLayerTableList_filter[i].visualType == "tif" ||
                  _this.showLayerTableList_filter[i].visualType == "shp" ||
                  _this.showLayerTableList_filter[i].visualType == "geojson"
                ) {
                  temp = i;
                  map.moveLayer(
                    _this.showLayerTableList_filter[temp].id,
                    _this.showLayerTableList_filter[evt.newIndex].id
                  );
                }
              }
              if (temp < _this.showLayerTableList_filter.length) {
                // console.log(temp);
                // console.log(
                //   _this.showLayerTableList_filter[evt.newIndex],
                //   _this.showLayerTableList_filter[temp]
                // );
              }
            }
            //否则就是从上往下移
            else {
              // console.log(map);
              let temp = -1;
              for (let i = evt.oldIndex; i <= evt.newIndex - 1; i++) {
                if (
                  _this.showLayerTableList_filter[i].visualType == "tif" ||
                  _this.showLayerTableList_filter[i].visualType == "shp" ||
                  _this.showLayerTableList_filter[i].visualType == "geojson"
                ) {
                  temp = i;
                  map.moveLayer(
                    _this.showLayerTableList_filter[evt.newIndex].id,
                    _this.showLayerTableList_filter[temp].id
                  );
                }
              }
              // if (temp > -1) {
              // }
            }

            // map.moveLayer(
            //   _this.showLayerTableList_filter[evt.oldIndex].id,
            //   _this.showLayerTableList_filter[evt.newIndex].id
            // );
            // console.log(evt.oldIndex, evt.newIndex);
            // console.log(_this.showLayerTableList_filter[evt.oldIndex].id);
            // console.log(_this.showLayerTableList_filter[evt.newIndex].id);
          },
        });
      });
    },
    setselectfeature() {
      for (var i = 0; i < this.showLayerTableList.length; i++) {
        if (this.showLayerTableList[i].name == this.featureclass_to_select) {
          break;
        }
      }
      this.source_to_select = this.showLayerTableList[i].source;
      this.id_to_select = this.showLayerTableList[i].id;
      map.addLayer(
        {
          id: "highlighted",
          type: "line",
          source: this.source_to_select,
          // "source-layer": "original",
          paint: {
            // "fill-outline-color": "#00FFFF",
            "line-color": "#00FFFF",
            "line-width": 2,
          },
          filter: ["in", "id", ""],
        },
        "settlement-label"
      );
      this.selecton = true;
    },
    changeview(name) {
      this.dataproshow = name;
    },
  },
};
</script>

<style lang="less" scoped>
.des_icon {
  position: absolute;
  top: 85px;
  right: 9px;
  background-color: #fafafa;
  width: 100px;
  height: 260px;
  z-index: 50;
  border-radius: 5px;

  padding: 5px;
}
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
  height: 100vh;
}

.map-zoom-lnglat {
  position: absolute;
  bottom: 30px;
  right: 50px;
  z-index: 99;
  /*background-color: #fafafa !important;*/
  font-size: 13px;
}
.selectfeature_num {
  position: absolute;
  bottom: 30px;
  left: 50px;
  z-index: 99;
  /*background-color: #fafafa !important;*/
  font-size: 13px;
}

.edit-board {
  position: absolute;
  top: 110px;
  left: 40px;
  z-index: 1009;
  background-color: #fafafa;
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
  margin-top: 75px;
  right: 100px;
}
/deep/.mapboxgl-ctrl-scale {
  position: absolute;
  right: 42px;
  bottom: 50px;
}

/deep/.el-collapse-item__header.is-active {
  border-bottom-color: transparent;
  font-size: 16px;
  font-weight: 900;
}
/deep/.el-collapse-item__content {
  padding-bottom: 0;
  position: relative;
  z-index: 1002;
  max-height: 40vh !important;
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
.btn {
  position: absolute;
  left: 0;
  top: 0;
}
.boxdraw {
  background: rgba(56, 135, 190, 0.1);
  border: 2px solid #3887be;
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  // z-index: 100000;
}
.layout-header {
  height: 10%;
}
.layout-content {
  height: 80%;
}
.layout-footer {
  height: 10%;
}
</style>
