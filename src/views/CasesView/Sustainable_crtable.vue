<template>
    <el-container style="width: 100%;height: 100%;background-color: #ffffff">
        <el-row style="text-align: center" >
           <div class="heading-2" style="width:100%;height:100%;text-align: center">生态文明体系设计</div>
        </el-row>
        <el-row style="width:100%;height: 90%">
            <el-col :offset="1" class="SystemPageCol">
                <el-card shadow="hover" style="height: 100%;width: 90%;">

                    <h4 style="text-align: center; padding-top: 10px">体系构建</h4>
                    <div class="subheading" style="text-align: center">区域设定:
                        <span v-if="this.MapZone.length===0">
                        <div>区域数据为空,在上一个步骤中选择区域</div>
                         </span>
                        <span v-else>
                        {{this.MapZone}}
                        </span>
                    </div>

                    <el-row style="text-align:center;justify-content: center;align-items: center;font-size: 16px;">
                            <span >一级目标层：</span>
                            <el-select v-model="OneReturn" placeholder="请选择">
                                <el-option
                                        v-for="item in ListOne"
                                        :key="item.一级目标"
                                        :label="item.一级目标"
                                        :value="item.一级目标">
                                </el-option>
                            </el-select>
                        </el-row>
                    <el-row style="text-align:center;padding-top: 10px;padding-bottom: 10px;justify-content: center;align-items: center;font-size: 16px;">
                            <span >二级指标层：</span>
                            <el-select v-model="TwoReturn" placeholder="请选择">
                                <el-option
                                        v-for="item in ListTwo"
                                        :key="item.二级指数"
                                        :label="item.二级指数"
                                        :value="item.二级指数">
                                </el-option>
                            </el-select>
                        </el-row>
                    <el-row style="text-align:center;justify-content: center;align-items: center;font-size: 16px;">
                            <span >三级因子层：</span>
                            <el-select v-model="ThreeReturn" placeholder="请选择">
                                <el-option
                                        v-for="item in ListThree"
                                        :key="item.评价因子"
                                        :label="item.评价因子"
                                        :value="item.评价因子">
                                </el-option>
                            </el-select>
                        </el-row>
                    <el-row  style="width:100% text-align: center;padding: 10px;justify-content: center;align-items: center;">
                        <el-button @click="AddButtonClick" type="primary" style="color:#ffffff;font-size: 16px;">添加</el-button>
                        <el-button @click="DeleteButtonClick" type="danger"  style="color:#ffffff;font-size: 16px;">删除</el-button>
                    </el-row>
                    <el-row>
                        <h4 style="text-align: center;width: 100%;">指标体系</h4>
                        <el-table class="tableStyle data-show-table"
                                  :data="CustomDataTables"
                                  :span-method="arraySpanMethod2"
                                  :row-class-name="TableCell"
                                  border
                                  :max-height="tableHeight"
                                  @cell-click="cellClick">
                            <el-table-column
                                    prop="Target"
                                    label="目标层"
                            >
                                <template #default="{row}">
                                                        <span v-if="row.index === tabClickIndex && tabClickLabel === '目标层'">
                                                             <el-input v-model="row.Target" maxlength="300" placeholder="请输入目标层" size="mini" @blur="inputBlur"/>
                                                        </span>
                                    <span v-else>{{ row.Target}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="Index"
                                    label="指标层"
                            >
                                <template #default="{row}">
                                                        <span v-if="row.index === tabClickIndex && tabClickLabel === '指标层'">
                                                            <el-input v-model="row.Index" maxlength="300" placeholder="请输入指标层" size="mini" @blur="inputBlur"/>
                                                        </span>
                                    <span v-else>{{ row.Index}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="Factor"
                                    label="因子层"
                            >
                                <template #default="{row}">
                                                        <span v-if="row.index === tabClickIndex && tabClickLabel === '因子层'">
                                                            <el-input v-model="row.Factor" maxlength="300" placeholder="请输入因子层" size="mini" @blur="inputBlur"/>
                                                       </span>
                                    <span v-else>{{ row.Factor}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="FactorLayer"
                                    label="因子"
                            >
                                <template #default="{row}">
                                                        <span v-if="row.index === tabClickIndex && tabClickLabel === '因子'">
                                                            <el-input v-model="row.FactorLayer" maxlength="300" placeholder="请输入因子" size="mini" @blur="inputBlur"/>
                                                        </span>
                                    <span v-else>{{ row.FactorLayer}}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-row>
                    <el-row  style="text-align: center;padding: 10px;justify-content: center;align-items: center;">
                        <el-button @click="ConfirmButtonClick" type="primary" style="color:#ffffff;font-size: 16px;">确定</el-button>
                        <el-button @click="CancelButtonClick" type="danger"  style="color:#ffffff;font-size: 16px;">取消</el-button>
                    </el-row> 
                </el-card>
            </el-col>

            <!-- 分析计算版块 -->
            <el-col  class="SystemPageCol">
                <el-card shadow="hover" style="height: 100%;width: 90%;text-align: center">
                    <h4 style="text-align: center">分析计算</h4>
                    <div style="width: 100%;height: 100%" v-if="CalculationState===1">
                        <el-table
                                class="tableStyle data-show-table"
                                :data="ResultDataTable"
                                :span-method="arraySpanMethod"
                                :max-height="tableHeight2"
                                border
                        >
                            <el-table-column
                                    prop="Target"
                                    label="目标层">
                                <template #default="{row}">
                                    <div>{{row.Target}}</div>
                                    <div>得分：{{row.TargetData}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="Index"
                                    label="指标层">
                                <template #default="{row}">
                                    <div>{{row.Index}}</div>
                                    <div>得分：{{row.IndexData}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="Factor"
                                    label="因子层">
                                <template #default="{row}">
                                    <div>{{row.Factor}}</div>
                                    <div>得分：{{row.FactorData}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="FactorLayer"
                                    label="因子">
                                <template #default="{row}">
                                    <div>{{row.FactorLayer}}</div>
                                    <div>得分：{{row.FactorLayerData}}</div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div style="width: 100%;height: 100%" v-else>
                        <el-table   class="tableStyle data-show-table"
                                    :data="WeightDataTable"
                                    :span-method="arraySpanMethod"
                                    :max-height="tableHeight2"
                                    @cell-click="WeightCellClick"
                                    border
                        >
                            <el-table-column
                                    prop="Target"
                                    label="目标层">
                                <template #default="{row}">
                                    <div>{{ row.Target}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="Index"
                                    label="指标层">
                                <template #default="{row, $index}">
                                    <el-popover trigger="click" placement="top" :ref="`popover-${$index}`">
                                        <p>权重:{{row.IndexWeight}}<br/>
                                            <el-input v-model="WeightInput" placeholder="请输入权重"></el-input>
                                        </p>
                                        <el-button type="primary" size="mini" @click="WeightDataClick1(scope)">确定</el-button>
                                        <slot name="reference">
                                            <div>{{ row.Index}}</div>
                                        </slot>
                                    </el-popover>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="Factor"
                                    label="因子层">
                                <template #default="{row, $index}">
                                    <el-popover trigger="click" placement="top" :ref="`popover-${$index}`">
                                        <p>权重:{{row.FactorWeight}}<br/>
                                            <el-input v-model="WeightInput" placeholder="请输入权重"></el-input>
                                        </p>
                                        <el-button type="primary" size="mini" @click="WeightDataClick2(scope)" >确定</el-button>
                                        <slot name="reference">
                                            <div>{{row.Factor}}</div>
                                        </slot>
                                    </el-popover>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="FactorLayer"
                                    label="因子">
                                <template #default="{row, $index}">
                                    <el-popover trigger="click" placement="top" :ref="`popover-${$index}`">
                                        <p>权重:{{row.FactorLayerWeight}}<br/>
                                            <el-input v-model="WeightInput" placeholder="请输入权重"></el-input>
                                        </p>
                                        <p>数据:{{row.FactorLayerData}}<br/>
                                            <el-input v-model="DataInput" placeholder="请输入数据"></el-input>
                                        </p>
                                        <el-button type="primary" size="mini" @click="WeightDataClick3(scope)">确定</el-button>
                                        <slot name="reference">
                                            <div>{{row.FactorLayer}}</div>
                                        </slot>
                                    </el-popover>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <el-row  style="text-align: center;padding-top: 10px;justify-content: center;align-items: center;">
                        <el-button @click=CalculateClick() type="primary" round style="color:#ffffff;font-size: 16px;">计算</el-button>
                        <el-button @click=ReCalculateClick() type="danger" round style="color:#ffffff;font-size: 16px;">重置</el-button>
                    </el-row>
                </el-card>
            </el-col>
        </el-row>
    </el-container>
</template>

<script>
    import Global from "../../../public/case/sustainable/Global.vue";
    import {SplitJson} from "../../../public/case/sustainable/js/getData_cr";
    import {AddJsonData,DeleteJsonDate,createJsonDataOfDatatset,CalculateData} from "../../../public/case/sustainable/js/optionData";
    
    export default {
        name: "SystemTable",
        data(){
            return{
                //体系设计页面需要的数据
                needMergeArr: ['Target', 'Index','Factor'],
                rowMergeArrs: {},
                rowCustomMergeArrs:{},
                tabClickIndex: null, // 点击的单元格
                tabClickLabel: '', // 当前点击的列名

                //表格自适应浏览器高度,这里最好给个默认初始值，不然会报错
                tableHeight:"600px",
                tableHeight2:"600px",

                //获取全局变量中的数据
                MapZone:Global.MapClickName,
                //选择体系页面
                ListOne:[ ],
                OneReturn:'',
                ListTwo:[ ],
                TwoReturn:'',
                ListThree:[ ],
                ThreeReturn:'',
                //返回的JSON数据表格
                CustomDataTables:[],

                //默认体系设置
                SDGsIndex:[
                    {
                        index:0,
                        Target:'生态文明指数',
                        Index:'资源承载',
                        Factor:'土地资源承载力',
                        FactorLayer:'地形起伏度',
                    },{
                        index:1,
                        Target:'生态文明指数',
                        Index:'资源承载',
                        Factor: '土地资源承载力',
                        FactorLayer: '耕地面积占比'
                    },{
                        index:2,
                        Target:'生态文明指数',
                        Index:'资源承载',
                        Factor:'土地资源承载力',
                        FactorLayer:'土地利用程度'
                    },{
                        index:3,
                        Target:'生态文明指数',
                        Index:'资源承载',
                        Factor:'水资源丰度',
                        FactorLayer:'水资源可用量'
                    },{
                        index:4,
                        Target:'生态文明指数',
                        Index:'资源承载',
                        Factor:'自然环境危害性',
                        FactorLayer:'气象灾害'
                    },{
                        index:5,
                        Target:'生态文明指数',
                        Index:'资源承载',
                        Factor:'自然环境危害性',
                        FactorLayer:'地质灾害'
                    },{
                        index:6,
                        Target:'生态文明指数',
                        Index:'环境压力',
                        Factor:'环境污染',
                        FactorLayer:'大气环境污染'
                    },{
                        index:7,
                        Target:'生态文明指数',
                        Index:'环境压力',
                        Factor:'环境污染',
                        FactorLayer:'水环境污染'
                    },{
                        index:8,
                        Target:'生态文明指数',
                        Index:'环境压力',
                        Factor:'环境污染',
                        FactorLayer:'土壤环境污染'
                    },{
                        index:9,
                        Target:'生态文明指数',
                        Index:'环境压力',
                        Factor:'环境保护',
                        FactorLayer:'森林覆盖率'
                    },{
                        index:10,
                        Target:'生态文明指数',
                        Index:'环境压力',
                        Factor:'环境保护',
                        FactorLayer:'生物丰富度'
                    },{
                        index:11,
                        Target:'生态文明指数',
                        Index:'环境压力',
                        Factor:'环境保护',
                        FactorLayer:'自然保护区面积'
                    },{
                        index:12,
                        Target:'生态文明指数',
                        Index:'环境压力',
                        Factor:'环境保护',
                        FactorLayer:'自然保护区面积'
                    },{
                        index:13,
                        Target:'生态文明指数',
                        Index:'生态资产',
                        Factor:'自然资源价值',
                        FactorLayer:'有机质生产价值'
                    },{
                        index:14,
                        Target:'生态文明指数',
                        Index:'生态资产',
                        Factor:'自然资源价值',
                        FactorLayer:'生态经济产品价值'
                    },{
                        index:15,
                        Target:'生态文明指数',
                        Index:'生态资产',
                        Factor:'生态系统服务价值',
                        FactorLayer:'固碳释氧价值'
                    },{
                        index:16,
                        Target:'生态文明指数',
                        Index:'生态资产',
                        Factor:'生态系统服务价值',
                        FactorLayer:'涵养水源价值'
                    },{
                        index:17,
                        Target:'生态文明指数',
                        Index:'生态资产',
                        Factor:'生态系统服务价值',
                        FactorLayer:'净化空气价值'
                    },{
                        index:18,
                        Target:'生态文明指数',
                        Index:'生态资产',
                        Factor:'生态系统服务价值',
                        FactorLayer:'营养物质循环价值'
                    },{
                        index:19,
                        Target:'生态文明指数',
                        Index:'生态资产',
                        Factor:'生态系统服务价值',
                        FactorLayer:'土壤保持价值'
                    },{
                        index:20,
                        Target:'生态文明指数',
                        Index:'生态资产',
                        Factor:'生态系统服务价值',
                        FactorLayer:'生物多样性'
                    },{
                        index:21,
                        Target:'生态文明指数',
                        Index:'发展能力',
                        Factor:'经济活力',
                        FactorLayer:'净化空气价值'
                    },{
                        index:22,
                        Target:'生态文明指数',
                        Index:'发展能力',
                        Factor:'经济活力',
                        FactorLayer:'经济规模水平'
                    },{
                        index:23,
                        Target:'生态文明指数',
                        Index:'发展能力',
                        Factor:'经济活力',
                        FactorLayer:'产业结构水平'
                    },{
                        index:24,
                        Target:'生态文明指数',
                        Index:'发展能力',
                        Factor:'经济活力',
                        FactorLayer:'财政及社会保障'
                    },{
                        index:25,
                        Target:'生态文明指数',
                        Index:'发展能力',
                        Factor:'经济活力',
                        FactorLayer:'居民生活与消费'
                    },{
                        index:26,
                        Target:'生态文明指数',
                        Index:'发展能力',
                        Factor:'经济活力',
                        FactorLayer:'科技教育水平'
                    },{
                        index:27,
                        Target:'生态文明指数',
                        Index:'发展能力',
                        Factor:'基础设施',
                        FactorLayer:'关键交通节点可达性'
                    },{
                        index:28,
                        Target:'生态文明指数',
                        Index:'发展能力',
                        Factor:'社会服务',
                        FactorLayer:'公共服务设施便捷度'
                    },{
                        index:29,
                        Target:'生态文明指数',
                        Index:'零碳排放',
                        Factor:'碳排放',
                        FactorLayer:'能源消耗碳排放'
                    },{
                        index:30,
                        Target:'生态文明指数',
                        Index:'零碳排放',
                        Factor:'碳排放',
                        FactorLayer:'工业生产过程碳排放'
                    },{
                        index:31,
                        Target:'生态文明指数',
                        Index:'零碳排放',
                        Factor:'碳排放',
                        FactorLayer:'农业活动碳排放'
                    },{
                        index:32,
                        Target:'生态文明指数',
                        Index:'零碳排放',
                        Factor:'碳排放',
                        FactorLayer:'生活项目碳排放'
                    },{
                        index:33,
                        Target:'生态文明指数',
                        Index:'零碳排放',
                        Factor:'碳吸收',
                        FactorLayer:'生态系统碳吸收量'
                    }
                ],

                //设置权重页面输入框所需要的数据
                WeightDataIndex:"",
                WeightInput:"",
                DataInput:"",
                WeightDataTable:"",
                //权重计算页面
                visible: false,
                //判断页面计算状态
                CalculationState:0,
                //最后结果数据
                ResultDataTable:"",

            }
        },
        methods:{
            // 权重页面合拼单元格方法
            arraySpanMethod({column, rowIndex,}) {
                // 把需要循环的列名加入
                if (column.property === 'Target')
                    return this.mergeAction('Target', rowIndex);
                if (column.property === 'Index')
                    return this.mergeAction('Index', rowIndex);
                if (column.property === 'Factor')
                    return this.mergeAction('Factor', rowIndex);
            },

            mergeAction(val, rowIndex,) {
                let _row = this.rowMergeArrs[val].rowArr[rowIndex];
                let _col = _row > 0 ? 1 : 0;
                return [_row, _col];
            },

            //自定义界面表格合拼
            arraySpanMethod2({column, rowIndex,}) {
                // 把需要循环的列名加入
                if (column.property === 'Target')
                    return this.mergeAction2('Target', rowIndex);
                if (column.property === 'Index')
                    return this.mergeAction2('Index', rowIndex);
                if (column.property === 'Factor')
                    return this.mergeAction2('Factor', rowIndex);
            },

            mergeAction2(val, rowIndex,) {
                let _row = this.rowCustomMergeArrs[val].rowArr[rowIndex];
                let _col = _row > 0 ? 1 : 0;
                return [_row, _col];
            },

            rowMergeHandle(arr, data) {
                if (!Array.isArray(arr) && !arr.length) return false;
                if (!Array.isArray(data) && !data.length) return false;
                let needMerge = {};
                arr.forEach(i => {
                    needMerge[i] = {
                        rowArr: [],
                        rowMergeNum: 0
                    };
                    data.forEach((item, index) => {
                        if (index === 0) {
                            needMerge[i].rowArr.push(1);
                            needMerge[i].rowMergeNum = 0;
                        } else {
                            if (item[i] === data[index - 1][i]) {
                                needMerge[i].rowArr[needMerge[i].rowMergeNum] += 1;
                                needMerge[i].rowArr.push(0);
                            } else {
                                needMerge[i].rowArr.push(1);
                                needMerge[i].rowMergeNum = index;
                            }
                        }
                    });
                });
                return needMerge;
            },
            //现有体系页面单元格点击事件
            TableCell({row,rowIndex}){
                row.index=rowIndex;
            },
            cellClick(row,column){
                switch (column.label) {
                    case '目标层':
                        this.tabClickIndex = row.index
                        this.tabClickLabel = column.label
                        break
                    case '指标层':
                        this.tabClickIndex = row.index
                        this.tabClickLabel = column.label
                        break
                    case '因子层':
                        this.tabClickIndex = row.index
                        this.tabClickLabel = column.label
                        break
                    case '因子':
                        this.tabClickIndex = row.index
                        this.tabClickLabel = column.label
                        break
                    default: return
                }
            },
            //失去焦点初始化
            inputBlur() {
                this.tabClickIndex = null
                this.tabClickLabel = ''
            },

            //自定义体系页面的四个按钮
            AddButtonClick(){
                AddJsonData(this.OneReturn,this.TwoReturn,this.ThreeReturn,this.CustomDataTables);
                //挂载自定义体系表格合拼
                this.rowCustomMergeArrs=this.rowMergeHandle(this.needMergeArr,this.CustomDataTables);
            },
            DeleteButtonClick(){
                DeleteJsonDate(this.CustomDataTables);
            },
            ConfirmButtonClick(){
                this.WeightDataTable=JSON.parse(JSON.stringify(this.CustomDataTables)) ;
                this.rowMergeArrs = this.rowMergeHandle(this.needMergeArr, this.WeightDataTable);
                console.log(this.WeightDataTable);
            },
            CancelButtonClick(){
                this.WeightDataTable=JSON.parse(JSON.stringify(this.SDGsIndex));
                this.rowMergeArrs = this.rowMergeHandle(this.needMergeArr, this.WeightDataTable);
                console.log(this.WeightDataTable);
            },


            //权重设置页面单元格点击事件
            WeightCellClick(row){
                //点击自定义单元格把第几列数据传入
                this.WeightDataIndex=row.index;
            },
            //权重设置页面通过点击确定为其设置权重和数据
            WeightDataClick1(scope){
                createJsonDataOfDatatset("IndexWeight",this.WeightInput,this.WeightDataTable,this.WeightDataIndex);
                scope._self.$refs[`popover-${scope.$index}`].doClose();
            },
            WeightDataClick2(scope){
                createJsonDataOfDatatset("FactorWeight",this.WeightInput,this.WeightDataTable,this.WeightDataIndex);
                scope._self.$refs[`popover-${scope.$index}`].doClose();
            },
            WeightDataClick3(scope){
                createJsonDataOfDatatset("FactorLayerWeight",this.WeightInput,this.WeightDataTable,this.WeightDataIndex);
                createJsonDataOfDatatset("FactorLayerData",Number(this.DataInput),this.WeightDataTable,this.WeightDataIndex);
                scope._self.$refs[`popover-${scope.$index}`].doClose();

            },
            //权重设置页面计算事件
            CalculateClick(){
                CalculateData(this.WeightDataTable);
                this.ResultDataTable=this.WeightDataTable;
                Global.ResultJson=this.ResultDataTable;
                this.CalculationState=1;
                this.rowMergeArrs = this.rowMergeHandle(this.needMergeArr, this.WeightDataTable);
            },
            //权重设置页面重置事件
            ReCalculateClick(){
                this.CalculationState=0;
                this.rowMergeArrs = this.rowMergeHandle(this.needMergeArr, this.WeightDataTable);
            }
        },
        mounted() {
            this.$nextTick(() =>{
                // 根据浏览器高度设置初始高度
                this.tableHeight = (window.innerHeight-640);
                this.tableHeight2=(window.innerHeight-340);
                // 监听浏览器高度变化，改变表格高度
                window.onresize = () =>{
                    this.tableHeight = (window.innerHeight-640);
                    this.tableHeight2=(window.innerHeight-340);
                }
            })
            this.WeightDataTable=JSON.parse(JSON.stringify(this.SDGsIndex));
            this.rowMergeArrs = this.rowMergeHandle(this.needMergeArr, this.WeightDataTable);
            this.ListOne=SplitJson("维度","目标","领域","一级指标","一级目标");
            this.ListTwo=SplitJson("具体目标","具体目标","指数","二级指标","二级指数");
            this.ListThree=SplitJson("评价指标","具体指标","指标","评价因子","评价因子");
        }
    }
</script>

<style scoped src="../../../public/case/sustainable/css/designwiz.webflow.82884a821.css"></style>
<style scoped>
    .SystemPageCol{
        max-width:45%;
        min-width:45%;
        height:100%;
        padding-top:30px;
        padding-left:95px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .subheading {
        display: block;
        font-size: 0.7em;
        margin-top: 1.33em;
        margin-bottom: 1.33em;
        margin-left: 0;
        margin-right: 0;
        font-weight: bold;
    }
    .data-show-table{
        height: 95%;
        width: 95%;
        margin-top: 2.5%;
        margin-left: 2.5%;
        margin-bottom: 2.5%;
    }
</style>