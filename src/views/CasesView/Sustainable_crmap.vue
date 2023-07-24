<template>
    <el-container style="margin-left:1%;margin-top:0.5%;height: 98%;width:98%;background-color: #ffffff">
        <el-col class="data-show-map-wrapper">
            <div id="data-show-map">
                <div class="leaflet-control">
                    <h2 class="leaflet-right map-select" style="margin-top:-7px;margin-right: 130px;font-size:1.5em;font-weight: bold">尺度选择：</h2>
                    <el-radio-group v-model="GeoJsonGroup"  class="leaflet-right map-select">
                        <!-- <el-radio-button  @change="CheckBoxclickMap" v-for="Select in SelectOp" :label="Select" :key="Select">
                        </el-radio-button> -->
                        <el-select v-model="GeoJsonGroup" placeholder="请选择" style="width:100px">
                            <el-option
                                    v-for="item in SelectOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                    @click="CheckBoxclickMap"
                                    >
                            </el-option>
                        </el-select>
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
                SelectOptions: [{
                    value: '世界',
                    label: '世界'
                    }, {
                    value: '省域',
                    label: '省域'
                    }, {
                    value: '市域',
                    label: '市域'
                    }, {
                    value: '县域',
                    label: '县域'
                    },{
                    value: '清除',
                    label: '清除'
                    }
                ]
            }
        },
        methods:{
            mapInit(){
                this.mapobj=new AnalyzeMap("data-show-map");
            },
            CheckBoxclickMap(){
                console.log(this.GeoJsonGroup);
                Global.RegionScale = this.GeoJsonGroup;
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
        height: 100%;
        width: 100%;
        border-radius: 10px;
        position: relative;
    }
    .map-select{
        position: fixed;
        padding-top: 20px;
        margin-right: 20px;
        width:12vw;
    }

</style>