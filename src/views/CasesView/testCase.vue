<template>
  <div class="dataTable">
    <el-button :icon="arrowIcon" class="collapse-button" @click="handleCollapse">
      台风烟花路径信息
    </el-button>
    <el-table
        :data="tableData"
        id="dataTableId"
        style="border-radius: 6px;"
        :height=tableHeight
        stripe
    >
      <el-table-column prop="time" label="时间"  width="150"/>
      <el-table-column prop="speed" label="风速"  />
      <el-table-column prop="strong"  label="强度" width="100"/>
      <el-table-column prop="pressure"  label="压强" />
    </el-table>
  </div>
  <div id="map" style="position:absolute;width: 100%;height: 100%"></div>
</template>

<script setup>
import {ArrowDownBold,ArrowUpBold} from "@element-plus/icons-vue";
import typhoonLogo1 from "@/assets/img/typhoonLogo/1.jpg"
import typhoonLogo2 from "@/assets/img/typhoonLogo/2.jpg"
import typhoonLogo3 from "@/assets/img/typhoonLogo/3.jpg"
import typhoonLogo4 from "@/assets/img/typhoonLogo/4.jpg"
import typhoonLogo5 from "@/assets/img/typhoonLogo/5.jpg"
import typhoonLogo6 from "@/assets/img/typhoonLogo/6.jpg"
import Map from "ol/Map";
import View from "ol/View";
import * as Control from "ol/control";
import Feature from "ol/Feature";
import GeoJSON from "ol/format/GeoJSON";
import Overlay from 'ol/Overlay'
import {Tile as TileLayer, Vector as VectorLayer} from "ol/layer";
import * as olProj from 'ol/proj';
import {getLength} from "ol/sphere"
import {getBottomLeft, getTopRight, containsCoordinate} from 'ol/extent'
import olstyle from 'ol/style/Style'
import olstroke from 'ol/style/Stroke'
import olicon from 'ol/style/Icon'
import olcircle from 'ol/style/Circle'
import ofill from 'ol/style/Fill'
import oltext from 'ol/style/Text'
import olLineString from 'ol/geom/LineString'
import olPoint from 'ol/geom/Point'
import ollayervetor from 'ol/layer/Vector'
import olsourcevector from 'ol/source/Vector'
import {XYZ,TileImage} from 'ol/source';
import {onMounted, ref} from "vue";

//折叠按钮
const tableHeight = ref(450);
const arrowIcon = ref(ArrowUpBold)
const handleCollapse = () => {
  if (tableHeight.value == 450){
    tableHeight.value = 0;
    arrowIcon.value = ArrowDownBold
  }else {
    tableHeight.value = 450;
    arrowIcon.value = ArrowUpBold
  }
}

//台风路径数据表
const tableData = ref([])

let map;
const init = () => {
  let elem = document.getElementById("map")
  let url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
  map = new Map({
    target: elem,
    layers: [
      new TileLayer({source: new XYZ({url})})
    ],
    view: new View({
      center:[122, 30.13],
      zoom:6,
      projection: "EPSG:4326"}),
    controls: Control.defaults().extend([
      new Control.MousePosition()      // 实例化坐标拾取控件，并加入地图
    ])
  });
  map.on()
}
let typhoonPath = null;
let trace = null;
const loadTyphoonTrace = () => {
  if (typhoonPath == null) {
    fetch('/case/typhoon/yanhua.json')
        .then((res) => {
          return res.json();
        })
        .then((points) => {
          console.log("points",points)
          points.map(item=>{
            tableData.value.push({
              time:item.time,
              speed:item.speed+'m/s',
              strong:item.strong,
              pressure:item.pressure,
            })
          })

          typhoonPath = points;
          var lineArr = [];
          var attr = [];
          let times = [];

          if (points.length <= 0) {
            alert('数据缺失!!!');
            return;
          }

          for (var i = 0; i < points.length; i++) {
            var lat = parseFloat(points[i].lat);
            var lng = parseFloat(points[i].lng);
            var strong = points[i].strong;

            times.push(points[i].time);
            lineArr.push([lng, lat]);
            attr.push(strong);
          }

          //创建入参方法
          var p = new lu_LocusOption({
            locusData: {
              locusId: 1, // 路径点id
              nodeIcon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png", //路径点图标
              label: new Object({ // 加入label对象
                offset: [15, 0], // 修改label相对于maker的位置 偏移
                content: "台风轨迹" //显示内容，也可以为html
              }),
              lnglat: lineArr, //路径点数组
              nodetype: attr,
              times: times
            },
            locusState: {
              circlable: false// 是否循环播放，false只做一次
            }
          })


          trace = new TraceLib(map,p);
          trace.start();

        });
  }
}

/**
 * 轨迹回放
 * @constructor
 */
class lu_LocusOption {
  constructor(data) {
    this.locusData = {
      locusId: null,
      label: null,
      icon: "http://webapi.amap.com/images/car.png",
      lnglat: [],
      lineType: "solid",
      lineWidth: 3,
      nodeIcon: null,
      lineOpacity: 0.6,
      lineColor: "#0000ff",
      nodetype: '',
      times : []
    }

    this.locusState = {
      moveSpeed: 30,
      isSetView: false,
      syncEvent: null,
      circlable: false,
      overlayEvent: null
    }
    if (data) {
      if (data.locusData) {
        if(data.locusData.times) this.locusData.times = data.locusData.times;
        if (data.locusData.locusId) this.locusData.locusId = data.locusData.locusId;
        if (data.locusData.icon) this.locusData.icon = data.locusData.icon;
        if (data.locusData.label) this.locusData.label = data.locusData.label;
        if (data.locusData.lnglat) this.locusData.lnglat = data.locusData.lnglat;
        if (data.locusData.lineType) this.locusData.lineType = data.locusData.lineType;
        if (data.locusData.nodeIcon) this.locusData.nodeIcon = data.locusData.nodeIcon;
        if (data.locusData.lineWidth) this.locusData.lineWidth = data.locusData.lineWidth;
        if (data.locusData.lineColor) this.locusData.lineColor = data.locusData.locusData.lineColor;
        if (data.locusState) {
          if (data.locusState.moveSpeed) this.locusState.moveSpeed = data.locusState.moveSpeed;
          if (data.locusState.isSetView != undefined) this.locusState.isSetView = data.locusState.isSetView;
          if (data.locusState.syncEvent) this.locusState.syncEvent = data.locusState.syncEvent;
          if (data.locusState.circlable != undefined) this.locusState.circlable = data.locusState.circlable;
          if (data.locusState.overlayEvent) this.locusState.overlayEvent = data.locusState.overlayEvent;
        }
        if (data.locusData) {
          if (data.locusData.nodetype) this.locusData.nodetype = data.locusData.nodetype;
        }
      }
    }
  }
}

class TraceLib {
  constructor(map,LocusOption) {
    this._map = map;
    this._lu_locus = null;
    this.traceFeatures = [];
    this._init(LocusOption);
  }

  _init(LocusOption) {
    if (this._lu_locus) {
      this._lu_locus.stop();
    }
    try {
      var _locusState = LocusOption.locusState;
      var _locusData = LocusOption.locusData;
      if (_locusState.isClearOverlay) {
        //清空
      }
      this.lu_DrawLinesAndMarkers(_locusData, _locusState);

      //开启路书
      this._lu_locus = new lu_track(this._map, _locusData.nodetype, _locusData.lnglat, _locusData.times,{
        defaultContent: _locusData.label,
        autoView: false,//_locusState.isSetView, //是否开启自动视野调整，如果开启那么路书在运动过程中会根据视野自动调整
        speed: _locusState.moveSpeed,
        enableRotation: true, //是否设置marker随着道路的走向进行旋转
        circlable: _locusState.circlable
      });

    } catch (e) {
      console.log(e.message);
    }
  }

  start() {
    if (this._lu_locus)
      this._lu_locus.start();
  }

  stop() {
    if (this._lu_locus) {
      this._lu_locus.stop()
    }
  }

  pause() {
    if (this._lu_locus)
      this._lu_locus.pause()
  }

  lu_DrawLinesAndMarkers(locusData, _locusState) {
    if (locusData) {
      if (locusData.nodeIcon) {
        this.image = locusData.nodeIcon;
      }
      if (locusData.label) this.text = locusData.label.content;
      if (locusData.label) this.offset = locusData.label.offset;
    }

    console.log("locusData1111",locusData)
    //根据节点强度值不同设置不同的点颜色和线颜色
    var styles = {
      'route': new olstyle({
        stroke: new olstyle({
          width: 2,
          color: [237, 212, 0, 0.8]
        })
      }),
      'node': new olstyle({
        image: new olcircle({
          radius: 3,
          stroke: new olstroke({
            color: "#efeeee",
            width: 0
          }),
          fill: new ofill({
            color: "#c1c1c1"
          })
        })
      }),
      'icon1': new olstyle({
        image: new olicon({
          anchor: [0.5, 1],
          src: this.image
        }),
        text: new oltext({
          font: "13px Microsoft Yahei",
          text: "起点",
          fill: new ofill({
            color: "#aa3300"
          }),
          stroke: new olstroke({color: "#fff", width: 2}),
          textAlign: "left"
        })
      }),
      'icon2': new olstyle({
        image: new olicon({
          anchor: [0.5, 1],
          src: this.image
        }),
        text: new oltext({
          font: "13px Microsoft Yahei",
          text: "终点",
          fill: new ofill({
            color: "#aa3300"
          }),
          stroke: new olstroke({color: "#fff", width: 2}),
          textAlign: "left"
        })
      }),
      'geoMarker': new olstyle({
        image: new olicon({
          anchor: [0.5, 0.5],
          rotation: 0,
          size: [52, 26],
          src: typhoonLogo1
        }),
        text: new oltext({
          font: "13px Microsoft Yahei",
          text: this.text,
          fill: new ofill({
            color: "#aa3300"
          }),
          stroke: new olstroke({color: "#fff", width: 2}),
          offsetX: this.offset[0],
          offsetY: this.offset[1],
          textAlign: "left"
        })
      })
    };

    var locussff = [], star, stop;
    var style = new olstyle({
      stroke: new olstroke({
        width: 4,
        color: '#2977cc'
      })
    });
    var lineFeature = new Feature(new olLineString(locusData.lnglat));
    lineFeature.setId(locusData.locusId);
    lineFeature.setStyle(style);
    this.traceFeatures.push(lineFeature);
    locussff.push(lineFeature);

    //节点打印
    var arrLngLat = locusData.lnglat;
    // var t_attr = locusData.attr;
    // console.log(locusData);

    var arrX = [], arrY = [];
    for (var i in arrLngLat) {
      if (i > 0 && i < arrLngLat.length - 1) {
        var nodeMarker = new Feature({
          type: 'node',
          geometry: new olPoint(locusData.lnglat[i])
        });
        locussff.push(nodeMarker);
      } else {
        if (i == 0) {
          var starMarker = new Feature({
            type: 'node',
            geometry: new olPoint(arrLngLat[i])
          });
          locussff.push(starMarker);
        } else if (i == arrLngLat.length - 1) {
          var startMarker = new Feature({
            type: 'node',
            geometry: new olPoint(arrLngLat[i])
          });
          locussff.push(startMarker);
        }
      }
      arrX.push(arrLngLat[i][0]);
      arrY.push(arrLngLat[i][1]);
    }

    var vectorLayer = new ollayervetor({
      zIndex: 50000,
      source: new olsourcevector({
        features: locussff
      }),
      style: function (feature) {
        // hide geoMarker if animation is active
        if (feature.get('type') === 'geoMarker')
          return null;
        else
          return styles[feature.get('type')];
      }
    });

    this._map.addLayer(vectorLayer);


    //标题
    var mp2 = document.createElement("div");
    mp2.id = "mycar_title_" + (new GUID()).newGUID();
    mp2.innerText = this.text;

    var title_id = "_ty_lj_key_title_" + (new GUID()).newGUID();
    var title = new Overlay({
      id: title_id,
      //autoPan: true,
      position: [arrX[0][0], arrY[0][1]],
      stopEvent: false,
      offset: this.offset,
      positioning: "bottom-left",
      element: mp2
    });
    this._map.title_id = title_id;
    this._map.addOverlay(title);
  }
}

class lu_track {
  constructor(map, nodetype, path, times, opts) {
    if (!path || path.length < 1) {
      return;
    }
    this._times = times;
    this.ismove = false;
    this.nodetype = nodetype;
    this._cc = 0;
    this._map = map;
    //存储一条路线
    this._path = path;
    //移动到当前点的索引
    this.i = 0;
    //控制暂停后开始移动的队列的数组
    this._setTimeoutQuene = [];
    //进行坐标转换的类
    // this._projection = this._map.getMapType().getProjection();
    this._opts = {
      icon: null,
      //默认速度 米/秒
      speed: 400,
      defaultContent: '',
    };

    this._setOptions(opts);
    this._rotation = 0; //小车转动的角度

    //如果不是默认实例，则使用默认的icon  instanceof BMap.Icon
    if (!this._opts.icon) {
      this._opts.icon = typhoonLogo1;
    }

    //缓动效果
    this._tween = {
      //初始坐标，目标坐标，当前的步长，总的步长
      linear: function (initPos, targetPos, currentCount, count) {
        var b = initPos, c = targetPos - initPos, t = currentCount,
            d = count;
        return c * t / d + b;
      }
    }

  }

  //根据用户输入的opts，修改默认参数_opts
  _setOptions(opts) {
    if (!opts) {
      return;
    }
    for (var p in opts) {
      // if (opts.hasOwnProperty(p)) {
      //   this._opts[p] = opts[p];
      // }
    }
  }

  //开始运动
  start() {
    this.ismove = true;
    var me = this, len = me._path.length;

    //不是第一次点击开始,并且小车还没到达终点
    if (me.i && me.i < len - 1) {
      //没按pause再按start不做处理
      if (!me._fromPause) {
        return;
      } else if (!me._fromStop) {
        //按了pause按钮,并且再按start，直接移动到下一点
        //并且此过程中，没有按stop按钮
        //防止先stop，再pause，然后连续不停的start的异常
        me._moveNext(++me.i);
      }
    } else {
      //第一次点击开始，或者点了stop之后点开始
      let marker = me._addMarker();
      me._marker = marker;
      //等待marker动画完毕再加载infowindow
      me._timeoutFlag = setTimeout(function () {
        //弹出窗口
        //me._addInfoWin();
        if (me._opts.defaultContent == "") {
          //  me.hideInfoWindow();
        }
        me._moveNext(me.i);
      }, 400);
    }
    //重置状态
    this._fromPause = false;
    this._fromStop = false;
  }

  //结束运动
  stop() {
    this.ismove = false;
    this.i = 0;
    this._fromStop = true;
    clearInterval(this._intervalFlag);
    this._clearTimeout();

    if (this._marker) {
      //this._map.getOverlays().clear();

      this._map.removeOverlay(this._marker.TYMarker);

      var overs = this._map.getOverlayById(this._map.title_id);
      if (overs) {
        // this._map.removeOverlay(overs);
        overs.element.innerText = ''
      }
    }

  }

  //暂停运动
  pause() {

    clearInterval(this._intervalFlag);

    //标识是否是按过pause按钮
    this._fromPause = true;
    this._clearTimeout();
  }


  //添加marker到地图上
  _addMarker(callback) {
    // 如果地图上有之前的台风符号，则移除
    if (this._marker) {
      this.stop();
      //this._marker.setMap(null);
      //
      clearTimeout(this._timeoutFlag);
    }
    //移除之前的overlay
    this._overlay && this._overlay.setMap(null);
    var marker = new TYCar(this._path[0], this._opts);
    this._map.addOverlay(marker.TYMarker);
    marker.times = this._times;
    return marker;

    // var adiv = this._marker.getIcon().containerDiv;
    //adiv.innerHTML = adiv.innerHTML + "<br/>" + this._opts.defaultContent;
  }

  //求多点间距离
  _formatLength(coordinates) {
    //  var wgs84Sphere = new olsphere(6378137);
    var length = 0;

    var sourceProj = this._map.getView().getProjection();
    for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
      var c1 = olProj.transform(coordinates[i], sourceProj, 'EPSG:4326');
      var c2 = olProj.transform(coordinates[i + 1], sourceProj, 'EPSG:4326');

      var geom = new olLineString([c1, c2])
      // length += wgs84Sphere.haversineDistance(c1, c2);

      length += getLength(geom);
    }
    return length;
  };


  //计算两点间的距离
  _getDistance(pxA, pxB) {
    return this._formatLength([pxA, pxB])
  }

  //目标点的  当前的步长,position,总的步长,动画效果,回调
  /**
   * 移动小车
   * @param {Number} poi 当前的步长.
   * @param {Point} initPos 经纬度坐标初始点.
   * @param {Point} targetPos 经纬度坐标目标点.
   * @param {Function} effect 缓动效果.
   * @return 无返回值.
   */
  _move(initPos, targetPos, effect, currentCount) {
    var me = this;
    me.ismove = true;
    //当前的帧数
    if (!currentCount)
      currentCount = 0;
    //步长，米/秒
    var timer = 10,
        step = this._opts.speed / (1000 / timer),
        //初始坐标
        init_pos = this._map.getPixelFromCoordinate(initPos),
        //获取结束点的(x,y)坐标
        target_pos = this._map.getPixelFromCoordinate(targetPos),
        //总的步长
        count = Math.round(me._getDistance(init_pos, target_pos) / step);

    //如果小于1直接移动到下一点
    if (count < 1) {
      me._moveNext(++me.i);
      return;
    }
    //两点之间匀速移动 setInterval
    me._intervalFlag = setInterval(function () {
      //两点之间当前帧数大于总帧数的时候，则说明已经完成移动
      if (currentCount >= count) {
        clearInterval(me._intervalFlag);
        //移动的点已经超过总的长度
        if (me.i > me._path.length) {
          return;
        }
        // me._marker.setTitle(i+'aaa')
        // me._marker.setImageUrl('')
        //运行下一个点
        me._moveNext(++me.i);
      } else {
        currentCount++;
        me._cc = currentCount;
        var x = effect(init_pos[0], target_pos[0], currentCount, count),
            y = effect(init_pos[1], target_pos[1], currentCount, count),
            pos = me._map.getCoordinateFromPixel([x, y]);

        let ele = me._map.getOverlays().getArray()[0].element;
        ele.style.color = '#ff0000';
        ele.innerText = me.nodetype[me.i];
        //
        if (me.nodetype[me.i] === '热带低压') {
          me._marker.setImageUrl(typhoonLogo1);//

        } else if (me.nodetype[me.i] === '热带风暴') {
          me._marker.setImageUrl(typhoonLogo2);//
        } else if (me.nodetype[me.i] === '强热带风暴') {
          me._marker.setImageUrl(typhoonLogo3);//
        } else if (me.nodetype[me.i] === '台风') {
          me._marker.setImageUrl(typhoonLogo4);//
        } else if (me.nodetype[me.i] === '强台风') {
          me._marker.setImageUrl(typhoonLogo5);//
        } else if (me.nodetype[me.i] === '超强台风') {
          me._marker.setImageUrl(typhoonLogo6);//
        }
        // me._marker.setRotation(10);


        //设置marker
        if (currentCount == 1) {
          var proPos = null;
          if (me.i - 1 >= 0) {
            proPos = me._path[me.i - 1];
          }
          if (me._opts.enableRotation == true) {
            me.setRotation(proPos, initPos, targetPos);
          }
          if (me._opts.autoView) {
console.log("")
          }
        }

        var extent = me._map.getView().calculateExtent(me._map.getSize());
        var bl = getBottomLeft(extent);
        var tr = getTopRight(extent);
        var bb = containsCoordinate([bl[0], bl[1], tr[0], tr[1]], pos);

        //移动中的label
        var overs = me._map.getOverlayById(me._map.title_id);
        overs.setPosition(pos);

        me._marker.setRotation2();

        if (!bb) {
          if (me._opts.autoView) {
            clearInterval(me._intervalFlag);
            me._map.getView().setCenter(pos);
            me._move(initPos, targetPos, me._tween.linear);
          } else {
            me._marker.setPosition(pos, me.i);
          }
        } else {
          me._marker.setPosition(pos,me.i );
        }
      }
    }, timer);
  }

  //在每个点的真实步骤中设置小车转动的角度
  setRotation(prePos, curPos, targetPos) {
    var me = this;

    curPos = me._map.getPixelFromCoordinate(curPos);
    targetPos = me._map.getPixelFromCoordinate(targetPos);

    curPos = {x: curPos[0], y: curPos[1]};
    targetPos = {x: targetPos[0], y: targetPos[1]}

    var x = Math.abs(targetPos.x - curPos.x);
    var y = Math.abs(targetPos.y - curPos.y);
    var z = Math.sqrt(x * x + y * y);
    var ration = Math.round((Math.asin(y / z) / Math.PI * 180));
    var a = 0;
    if (targetPos.y < curPos.y && targetPos.x == curPos.x) {
      a = 270; // (180 - ration);
    } else if (targetPos.y > curPos.y && targetPos.x == curPos.x)
      a = 90///ration;
    else if (targetPos.y == curPos.y && targetPos.x < curPos.x)
      a = 180//(180 - ration);
    else if (targetPos.y == curPos.y && targetPos.x > curPos.x)
      a = 0//ration;
    else if (targetPos.y > curPos.y && targetPos.x > curPos.x)
      a = ration;
    else if (targetPos.y > curPos.y && targetPos.x < curPos.x)
      a = 180 - ration;
    else if (targetPos.y < curPos.y && targetPos.x < curPos.x)
      a = 180 + ration;
    else if (targetPos.y < curPos.y && targetPos.x > curPos.x)
      a = 360 - ration;
    this._marker.setRotation(a);

    return;
  }


  //移动到下一个点
  _moveNext(index) {
    this.ismove = true;
    if (this._opts.func && this._opts.func != "")
      this._opts.func(index);
    var me = this;
    if (index == me._path.length - 1 && me._opts.circlable) {
      index = 0;
      me.i = 0;
    }
    if (index < this._path.length - 1) {
      //判断是否需要屏幕暂停，移动中心
      var ifXYZ1 = me._path[index];
      var ifXYZ2 = me._path[index + 1];

      var extent = this._map.getView().calculateExtent(this._map.getSize());

      var bl = getBottomLeft(extent);
      var tr = getTopRight(extent);

      tr = [this._map.getPixelFromCoordinate(tr)[0] - 30, this._map.getPixelFromCoordinate(tr)[1] + 30];
      bl = [this._map.getPixelFromCoordinate(bl)[0] + 30, this._map.getPixelFromCoordinate(tr)[1] - 30];

      tr = this._map.getCoordinateFromPixel(tr);
      bl = this._map.getCoordinateFromPixel(bl);

      var extentA = containsCoordinate([bl[0], bl[1], tr[0], tr[1]], ifXYZ1);
      var extentB = containsCoordinate([bl[0], bl[1], tr[0], tr[1]], ifXYZ2);

      //console.log(extentA, extentB);
      if (extentA == false || extentB == false) {
        if (me._opts.autoView) {
          console.log("auto view")
          clearInterval(this._lu_locus._intervalFlag);

          var centerA = (ifXYZ2[0] - ifXYZ1[0]) / 2 + ifXYZ2[0];
          var centerB = (ifXYZ2[1] - ifXYZ1[1]) / 2 + ifXYZ2[1];

          if (extentA == false && extentB == false) {
            this._map.getView().setCenter([centerA, centerB]);
          } else if (extentA == false) {
            this._map.getView().setCenter(ifXYZ1);
          } else if (extentB == false) {
            this._map.getView().setCenter(ifXYZ2);
          } else {
            console.log("#1005853");
            return;
          }
          setTimeout(function () {
            me._move(me._path[index], me._path[index + 1], me._tween.linear);
          }, 100);
        } else {
          me._move(me._path[index], me._path[index + 1], me._tween.linear);
        }
      } else {
        me._move(me._path[index], me._path[index + 1], me._tween.linear);
      }
    }
  }

  //清除暂停后再开始运行的timeout
  _clearTimeout() {
    for (var i in this._setTimeoutQuene) {
      clearTimeout(this._setTimeoutQuene[i]);
    }
    this._setTimeoutQuene.length = 0;
  }

}


class GUID {
  constructor() {
    this.date = new Date();   /* 判断是否初始化过，如果初始化过以下代码，则以下代码将不再执行，实际中只执行一次 */
  }

  newGUID() {
    this.date = new Date();
    var guidStr = '';
    var sexadecimalDate = this.hexadecimal(this.getGUIDDate(), 16);
    var sexadecimalTime = this.hexadecimal(this.getGUIDTime(), 16);
    for (var i = 0; i < 9; i++) {
      guidStr += Math.floor(Math.random() * 16).toString(16);
    }
    guidStr += sexadecimalDate;
    guidStr += sexadecimalTime;
    while (guidStr.length < 32) {
      guidStr += Math.floor(Math.random() * 16).toString(16);
    }
    return this.formatGUID(guidStr);
  }
  /* * 功能：获取当前日期的GUID格式，即8位数的日期：19700101 * 返回值：返回GUID日期格式的字条串 */
  getGUIDDate() {
    return this.date.getFullYear() + this.addZero(this.date.getMonth() + 1) + this.addZero(this.date.getDay());
  }
  /* * 功能：获取当前时间的GUID格式，即8位数的时间，包括毫秒，毫秒为2位数：12300933 * 返回值：返回GUID日期格式的字条串 */
  getGUIDTime() {
    return this.addZero(this.date.getHours()) + this.addZero(this.date.getMinutes()) + this.addZero(this.date.getSeconds()) + this.addZero(parseInt(this.date.getMilliseconds() / 10));
  }
  /* * 功能: 为一位数的正整数前面添加0，如果是可以转成非NaN数字的字符串也可以实现 * 参数: 参数表示准备再前面添加0的数字或可以转换成数字的字符串 * 返回值: 如果符合条件，返回添加0后的字条串类型，否则返回自身的字符串 */
  addZero(num) {
    if (Number(num).toString() != 'NaN' && num >= 0 && num < 10) {
      return '0' + Math.floor(num);
    } else {
      return num.toString();
    }
  }

  /*  * 功能：将y进制的数值，转换为x进制的数值 * 参数：第1个参数表示欲转换的数值；第2个参数表示欲转换的进制；第3个参数可选，表示当前的进制数，如不写则为10 * 返回值：返回转换后的字符串 */
  hexadecimal(num, x, y) {
    if (y != undefined) {
      return parseInt(num.toString(), y).toString(x);
    } else {
      return parseInt(num.toString()).toString(x);
    }
  }

  /* * 功能：格式化32位的字符串为GUID模式的字符串 * 参数：第1个参数表示32位的字符串 * 返回值：标准GUID格式的字符串 */
  formatGUID(guidStr) {
    var str1 = guidStr.slice(0, 8) + '-', str2 = guidStr.slice(8, 12) + '-', str3 = guidStr.slice(12, 16) + '-',
        str4 = guidStr.slice(16, 20) + '-', str5 = guidStr.slice(20);
    return str1 + str2 + str3 + str4 + str5;
  }

}

class TYCar {

  constructor(lnglat, config) {
    this.mp = document.createElement("div");
    this.mp.id = ("mymovecar_" + (new GUID()).newGUID());
    this.mp.style.position = "absolute";
    this.times = null;


    this.mimg = document.createElement("img");
    if (config.icon) this.mimg.src = config.icon;
    this.mp.appendChild(this.mimg);

    var marker_id = "_ty_lj_key_car_" + (new GUID()).newGUID();
    this.TYMarker = new Overlay({
      id: marker_id,
      stopEvent: false,
      offset: [-20, -18],
      positioning: "center-center",
      element: this.mp
    });

    // window.allmarkers[this.mp.id] = this.mp;
    //  console.log(this.mp)
  }

  //    getTitle () {
  //         return mp2.innerHTML;
  //     }

  // TYMarker.setTitle = function (text) {
  //     mp2.innerHTML = text;
  // }

  setPosition(lnglat, index) {
    this.TYMarker.setPosition(lnglat);
  }

  setRotation(a) {
    if (!isNaN(a)) {
      if (a <= 360 && a >= 0) {
        var x = document.getElementById(this.mp.id);
        // var x = window.allmarkers[this.mp.id];
        if(x){
          x.style.transform = "rotate(" + a + "deg)";
        }
      }
    }
  }

  setRotation2() {
    if (!isNaN(window.a)) {
      window.a -= 2;
      if (window.a <= 360 && window.a >= 0) {
        var x = document.getElementById(this.mp.id);
        // var x = window.allmarkers[this.mp.id];
        if(x){
          x.style.transform = "rotate(" + window.a + "deg)";
        }

      } else {
        window.a += 360;
      }
    }
  }

  getImageUrl() {
    return this.mimg.src;
  }

  setImageUrl(img_url) {
    this.mimg.src = img_url;
  }

}

onMounted(()=>{
  init();
  loadTyphoonTrace()
})

</script>

<style scoped>
.dataTable{
  position: absolute;
  z-index: 99;
  right: 0px;
  top: 50px;
}
.collapse-button{

}
#dataTableId{
  transition: height 250ms;
}
</style>
