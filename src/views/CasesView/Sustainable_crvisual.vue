<template>
    <el-container style="margin-left:1%;margin-top:0.5%;height: 98%;width:98%;background-color: #ffffff">
        <el-col class="data-show-map-wrapper">
            <div id="data-show-map">
                <div class="leaflet-control map-select">
                    <el-row class="leaflet-right map-select">
                        <h2 style="font-size:1.5em;margin-top: 10px;margin-bottom: 10px;font-weight: bold">指标选择</h2>
                        <el-select v-model="MapIndex" placeholder="请选择">
                            <el-option
                                    v-for="item in IndexList"
                                    :key="item.Name"
                                    :label="item.Name"
                                    :value="item.Name">
                            </el-option>
                        </el-select>
                        <br/>
                        <el-button @click="RadioClickMap" style="margin-top: 10px" type="primary" >空间可视化</el-button>
                        <el-button @click="MoranClickMap" style="margin-top: 10px" type="primary" >空间自相关</el-button>
                    </el-row>
                </div>

            </div>
        </el-col>
    </el-container>  
</template>

<script>
    import {AnalyzeMap} from "../../../public/case/sustainable/js/AnalyzeMap";
    import {GetResultJson,JudgeSelectJson} from "../../../public/case/sustainable/js/getData_cr";
    import Global from "../../../public/case/sustainable/Global.vue";
    export default {
        name: "SystemViusal",
        data(){
            return {
                VisualOption: "",
                //指标选择页面
                MapIndex: "",
                IndexList: Global.ResultJson,
            }
        },
        methods:{
            mapInit(){
                this.mapobj = new AnalyzeMap("data-show-map");
            },
            RadioClickMap(){
                this.mapobj.RemoveJson();
                this.mapobj.VisualGeoJson(Global.VisualJson,this.MapIndex);
            },
            MoranClickMap(){
                this.mapobj.RemoveJson();
                this.mapobj.MoranGeoJson(Global.VisualJson,this.MapIndex);
            },
        },
        mounted() {
            this.mapInit();
            // 反正目的是直接得到指标+数据的json数据，干脆在上一个页面完成赋值，直接调取就好了
            // this.IndexList=GetResultJson();
            this.IndexList=Global.ResultJson;
            Global.VisualJson=[];
            for(let i=0;i<Global.MapClickName.length;i++){
                // console.log(Global.MapClickName[i],i);
                // console.log(this.IndexList,'this.IndexList');
                JudgeSelectJson(Global.MapClickName[i],this.IndexList);
            }
        },
        beforeUnmount() {
            this.mapobj && this.mapobj.destroy();
        },
    }
</script>

<style>
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
        padding-top: 10px;
        padding-right: 70px;
        max-width: 330px;
    }
    .leaflet-popup-close-button {
        display: none; 
    }
</style>