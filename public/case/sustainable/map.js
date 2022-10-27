import "leaflet/dist/leaflet.css"
import $L from "leaflet";

const createMap = (divId, options) => {
  let map = $L.map(divId, options);
  return map;
};

const createTileLayer = async (map, url, options) => {
  let tileLayer = await $L.tileLayer(url, options);
  tileLayer.addTo(map);
  return tileLayer;
};

/*------------------------
* 生态文明数据展示系统——地图
--------------------------*/
export class DataShowMap {
  constructor(mapContainer) {
    // const osm = $L.tileLayer(
    //   '//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    //   {
    //     attribution: '© OpenStreetMap contributors',
    //   }
    // );

    const tianDituVec = $L.tileLayer("http://t0.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=fa0125f3e4d72a075c8d2f56acf7b13d");
    const tianDituVecAnnotion = $L.tileLayer("http://t0.tianditu.gov.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=fa0125f3e4d72a075c8d2f56acf7b13d");
    this.map = createMap(mapContainer, {
      // layers: osm,
      layers: [tianDituVec, tianDituVecAnnotion],
      minZoom: 2,
      zoom: 4,
      center: [35.42, 102.05],
      // zoom: 9,
      // center: [34.71, 119.48],
      maxBounds: $L.latLngBounds($L.latLng(-90, -160), $L.latLng(90, 200)),
    });
    this.layers = [];
  }

  /*
  * 利用leaflet-GeoTiff包为地图添加栅格
  */
  toggleLayerShowLocal(url){
    let layer1
    var renderer1 = $L.LeafletGeotiff.plotty({displayMin:0,displayMax:30,clampLow:false,clampHigh:true,colorScale:'rainbow'});
    layer1=$L.leafletGeotiff(url,{band:0,renderer:renderer1});
    layer1.addTo(this.map);
  }

  /* 
   * layerUrl: 新的底图url
   * isWMS: 是不是WMS服务，不是的话为WMTS服务
   * function: 根据新的底图url切换底图
   */
  toggleLayerShow(layerId, layerService, isShow, layerType) {
    if (isShow) {
      let layer;
      if (layerType === 'wms') {
        layer = $L.tileLayer.wms(layerService.url, {
          layers: layerService.layers,
          format: layerService.format,
          transparent: true,
          crs: $L.CRS.EPSG3857,
          // zoomOffset:2,
          zIndex: 99
        });
      }
      this.layers.push({
        id: layerId,
        layer: layer
      });
      layer.addTo(this.map);
    } else {
      let index = 0;
      for (const layer of this.layers) {
        if (layer.id === layerId) {
          this.map.removeLayer(layer.layer);
          this.layers.splice(index, 1);
          break;
        }
        index++;
      }
    }
  }

  // 组件销毁时调用，否则可能导致刷新空白等错误
  destroy() {
    this.map && this.map.remove();
  }
}

export default {
  createMap,
  createTileLayer
};