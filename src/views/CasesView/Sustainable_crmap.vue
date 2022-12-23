<template>
    <el-container style="width: 100%;height: 100%;background-color: #ffffff">
        <el-col class="data-show-map-wrapper">
            <div id="data-show-map">
                <div class="leaflet-control">
                    <el-radio-group v-model="GeoJsonGroup"  class="leaflet-right map-select">
                        <el-radio-button  @change="CheckBoxclickMap" v-for="Select in SelectOp" :label="Select" :key="Select"></el-radio-button>
                    </el-radio-group>
                </div>
            </div>
        </el-col>
    </el-container>
</template>

<script>
import {AnalyzeMap} from "../../../public/case/sustainable/js/AnalyzeMap";
import ChinaData from "../../../public/case/sustainable/json/ChinaData.json"
import CountryData from "../../../public/case/sustainable/json/CountryData.json"
import City from "../../../public/case/sustainable/json/changsanjiao_shiyu.json"
import County from "../../../public/case/sustainable/json/changsanjiao_xianyu.json"
import Global from "../../../public/case/sustainable/Global.vue";


const SelectOption = ['世界', '省域', '市域', '县域', '清除'];
export default {
        name: "SystemMap",
        data(){
            return{
                GeoJsonGroup:['清除'],
                SelectOp:SelectOption,
            }
        },
        methods:{
            mapInit(){
                this.mapobj=new AnalyzeMap("data-show-map");
            },
            CheckBoxclickMap(){
                console.log(this.GeoJsonGroup)
                if(this.GeoJsonGroup=='世界'){
                    //切换选项重置数组
                    Global.MapClickName.length=0;
                    this.mapobj.RemoveJson();
                    this.mapobj.AddGeoJson(CountryData.world);
                }
                if(this.GeoJsonGroup=='省域'){
                    //切换选项重置数组
                    Global.MapClickName.length=0;
                    this.mapobj.RemoveJson();
                    this.mapobj.AddGeoJson(ChinaData.china);
                }
                if(this.GeoJsonGroup=='市域'){
                    //切换选项重置数组
                    Global.MapClickName.length=0;
                    this.mapobj.RemoveJson();
                    this.mapobj.AddGeoJson(City);
                }
                if(this.GeoJsonGroup=='县域'){
                    //切换选项重置数组
                    Global.MapClickName.length=0;
                    this.mapobj.RemoveJson();
                    this.mapobj.AddGeoJson(County);
                }
                if(this.GeoJsonGroup=='清除'){
                    //切换选项重置数组
                    Global.MapClickName.length=0;
                    this.mapobj.RemoveJson();
                }
            }
        },

        mounted() {
            this.mapInit();

        },
        beforeUnmount() {
            this.mapobj && this.mapobj.destroy();
        },
    }
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
        height: 95%;
        width: 97%;
        position: relative;
    }
    .map-select{
        position: fixed;
        padding-top: 40px;
        padding-right: 50px;
        width:30vw;
    }
</style>