import "leaflet/dist/leaflet.css"
import $L from "leaflet";
import {DataShowMap} from "./map";
import Global from "../Global.vue";
import {CalculateMoran} from "./optionData";


export class AnalyzeMap extends DataShowMap {
    //向图层上添加中国Geojson

    layerGroups = new $L.FeatureGroup().addTo(this.map);



    //添加矢量数据
    AddGeoJson(JsonData) {
        let myStyle = {
            "color": "#49494b",
            "weight": 3,
            "opacity": 0.8,
        };

        var Json=$L.geoJSON(JsonData, {
            style: myStyle,
            onEachFeature:onEachFeature,

        })

        function onEachFeature(feature, layer) {
            layer.on({
                click: ClickFeature,
            });
        }
        // function resetHighlight(e) {
        //     Json.resetStyle(e.target);
        //     Global.MapClickName.length=Global.MapClickName.length-1;
        // }

        function highlightFeature(e) {
            var layer = e.target;

            layer.setStyle({
                weight: 5,
                color: '#666',
                dashArray: '',
                fillOpacity: 0.7
            });

            if (!$L.Browser.ie && !$L.Browser.opera && !$L.Browser.edge) {
                layer.bringToFront();
            }
        }
        function ClickFeature(e) {
            if(JudgeFunction(e.target.feature.properties.name)){
                Json.resetStyle(e.target);
                Global.MapClickName.length=Global.MapClickName.length-1;
            }else{
                highlightFeature(e)
                Global.MapClickName[Global.MapClickName.length]=e.target.feature.properties.name;
                for(let i=0;i<Global.MapClickName.length;i++){
                    console.log(Global.MapClickName[i]);
                }
            }
        }
        this.layerGroups.addLayer(Json);

        //判断这个Name是否在数组中
        function JudgeFunction(JsonName){
            var state=0;
            for(let i=0;i<Global.MapClickName.length;i++){
                if(Global.MapClickName[i]==JsonName){
                    state=1;
                }
            }
            return state;
        }
    }

    //清除图层
    RemoveJson(){
        this.layerGroups.clearLayers();
    }

    //可视化图层数据(cr_visual)
    VisualGeoJson(ResultJsonData,IndexName){
        let ResultJson=$L.geoJSON(ResultJsonData, {
            style: style,
            onEachFeature:onEachFeature,
        })
        this.layerGroups.addLayer(ResultJson);
        //分级色彩化
        function style(feature) {
            return {
                fillColor: getColor(ReturnAttribute(feature,IndexName)),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
            };
        }
        function ReturnAttribute(feature,indexName){
            let Data=0;
            for (let i=0;i<feature.properties.Table.length;i++){
                if(feature.properties.Table[i].Name==indexName){
                   Data=feature.properties.Table[i].NameData;
                }
            }
            return Data;
        }
        function getColor(d) {
            return     d > 75  ? '#90EE90' :
                            d > 50   ? '#FFEDA0' :
                                d > 25   ? '#FEB24C' :
                                    '#E31A1C';
        }
        //点击触发事件
        function onEachFeature(feature,layer) {
            let data=Number(ReturnAttribute(feature,IndexName)).toFixed(2);
            let popupContent=feature.properties.name+IndexName+":"+data;
            layer.bindPopup(popupContent);

        }

    }

        //可视化图层数据(in_map)
        VisualGeoJson2(ResultJsonData,IndexName){
            let ResultJson=$L.geoJSON(ResultJsonData, {
                style: style,
                onEachFeature:onEachFeature,
            })
            this.layerGroups.addLayer(ResultJson);
            //分级色彩化
            function style(feature) {
                return {
                    fillColor: getColor(ReturnAttribute(feature,IndexName)),
                    weight: 2,
                    opacity: 1,
                    color: 'white',
                    dashArray: '3',
                    fillOpacity: 0.7
                };
            }
            function ReturnAttribute(feature,indexName){
                let Data=0;
                // for (let i=0;i<feature.properties.Table.length;i++){
                //     if(feature.properties.Table[i].Name==indexName){
                //        Data=feature.properties.Table[i].NameData;
                //     }
                // }
                Data = feature.properties.Table.NameData;
                return Data;
            }
            function getColor(d) {
                return     d > 75  ? '#90EE90' :
                                d > 50   ? '#FFEDA0' :
                                    d > 25   ? '#FEB24C' :
                                        '#E31A1C';
            }
            //点击触发事件
            // counter用来给每个popup不同的id，不然点击事件只能执行一次
            function onEachFeature(feature,layer) {
                console.log(feature,'feature');
                console.log(layer,'layer');
                console.log(IndexName,'IndexName');
                let data=ReturnAttribute(feature,IndexName);
                let popupContent=feature.properties.name+IndexName+":"+data;
                // layer.bindPopup(`<div id="popup-link">${popupContent}</div>`);
                // layer.on('popupopen', () => {
                //   const link = document.getElementById('popup-link');
                //   link.addEventListener('click', () => {
                //     Global.inMapFlag = true;
                //     console.log(popupContent,Global.inMapFlag, '1238');
                //   });
                // });
                let popupLink = document.createElement('div');
                popupLink.style.cursor = "pointer";
                let popupLinkId = `popup-link-${feature.properties.name}`;
                popupLink.id = popupLinkId;
                popupLink.innerHTML = popupContent;
                layer.bindPopup(popupLink);
                layer.on('popupopen', () => {
                  const link = document.getElementById(popupLinkId);
                  link.addEventListener('click', () => {
                    Global.inMapFlag = true;
                    Global.inMapData.city = feature.properties.name;
                    Global.inMapData.tableName = IndexName.slice(0,-4);
                  });
                });
            }
        }
        
        
    //可视化图层数据(vi_visual)
    VisualGeoJson3(ResultJsonData,IndexName){
        let ResultJson=$L.geoJSON(ResultJsonData, {
            style: style,
            onEachFeature:onEachFeature,
        })
        this.layerGroups.addLayer(ResultJson);
        //分级色彩化
        function style(feature) {
            return {
                fillColor: getColor(ReturnAttribute(feature,IndexName)),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
            };
        }
        function ReturnAttribute(feature,indexName){
            let Data=0;
            Data=feature.properties.Table.NameData;
            return Data;
        }
        function getColor(d) {
            return     d > 80  ? '#99ffbb' :
                            d > 60   ? '#33ff77' :
                                d > 40   ? '#00e64d' :
                                    d > 20   ? '#009933' :
                                    '#006622';
        }
        //点击触发事件
        function onEachFeature(feature,layer) {
            let data=Number(ReturnAttribute(feature,IndexName)).toFixed(2);
            let popupContent=feature.properties.name+IndexName+":"+data;
            layer.bindPopup(popupContent);
            layer.on({
                mouseover: function (e) {
                  layer.openPopup();
                },
                mouseout: function (e) {
                  layer.closePopup();
                }
              });
        }
    }

    //Moran局部指数计算图层数据
    MoranGeoJson(ResultJsonData,IndexName){
        let MoranJson=$L.geoJSON(ResultJsonData, {
            style: style,
            onEachFeature:onEachFeature,
        })
        this.layerGroups.addLayer(MoranJson);
        //分级色彩化
        function style(feature) {
            return {
                fillColor: getColor(ReturnAttribute(feature,IndexName)),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
            };
        }
        function ReturnAttribute(feature,indexName){
            let Data=0;
            for (let i=0;i<feature.properties.Table.length;i++){
                if(feature.properties.Table[i].Name==indexName){
                    Data=feature.properties.Table[i].NameData;
                }
            }
            return Data;
        }
        function getColor(d) {
            return     d > 75  ? '#90EE90' :
                d > 50   ? '#FFEDA0' :
                    d > 25   ? '#FEB24C' :
                        '#E31A1C';
        }
        //点击触发事件
        function onEachFeature(feature,layer) {
            let data=CalculateMoran(feature,ResultJsonData,IndexName);
            let popupContent=feature.properties.name+"的"+IndexName+" "+data;
            layer.bindPopup(popupContent);

        }

    }


}


