<template>
    <el-card style="margin-left:2%;margin-top:1.5%;height: 94%;width:96%;background-color: hsla(0, 0%, 100%, 0.85);">
        <template #header>
            <div class="card-header">
                <span style="color: #4f4f4f;font-weight: 700;font-size: 24px;">可持续发展体系框架设置</span><br/>
                <span style="color: #4f4f4f;font-weight: 700;font-size: 20px;">体系名称：{{this.TableDataOb.TableName}}</span>
                <span style="color: #4f4f4f;font-weight: 700;font-size: 20px;float: right">研究区域：{{this.TableDataOb.TableRegion}}</span>
            </div>

        </template>
        <div style="width: 99%;height: 5%;margin-left: 0.5%">
            <el-button type="primary" @click="OpenDiaLogLoadTable()">体系载入</el-button>
            <el-dialog
                    v-model="DialogLoadTableData"
                    title="可持续发展体系载入"
                    width="30%"
                    destroy-on-close
                    center
            >
                <span style="color: #4f4f4f;font-weight: 700;font-size: 18px">请选择可持续发展体系：</span>
                <el-select style="width: 300px;" v-model="TableDataOb.Id" class="m-2" placeholder="Select" size="large">
                    <el-option
                            v-for="item in MongoDBData"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                    />
                </el-select>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button type="primary" @click="ConfirmDiaLogLoadTable">
                             确认
                        </el-button>
                    </span>
                </template>
            </el-dialog>
            <el-button type="primary" style="margin-left: 1%" @click="DialogSetTableName=true">表名设置</el-button>
            <el-dialog
                    v-model="DialogSetTableName"
                    title="可持续发展体系名称设置"
                    width="30%"
                    destroy-on-close
                    center
            >
                <el-input v-model="TableNameTemp" :placeholder="TableNameTemp"></el-input>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button type="primary" @click="ConfirmSetTableName">
                             确认
                        </el-button>
                    </span>
                </template>
            </el-dialog>
            <el-button type="primary" style="margin-left: 1%" @click="DialogSetTableRow=true">列名设置</el-button>
            <el-dialog
                    v-model="DialogSetTableRow"
                    title="可持续发展体系列名设置"
                    width="30%"
                    destroy-on-close
                    center
            >
                <el-tag
                        :key="tag"
                        v-for="tag in TableDataOb.ColumnName"
                        closable
                        :disable-transitions="false"
                        @close="TableHandleClose(tag)">
                    {{tag}}
                </el-tag>
                <el-input
                        class="input-new-tag"
                        v-if="RowInputVisible"
                        v-model="RowInputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter="TableHandleInputConfirm"
                        @blur="TableHandleInputConfirm"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="TableShowInput">+ 添加新列</el-button>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button type="primary" @click="DialogSetTableRow=false">
                             确认
                        </el-button>
                    </span>
                </template>
            </el-dialog>
            <el-button type="primary" style="margin-left: 1%" @click="DialogIncreaseTableRow=true">指标添加</el-button>
            <el-dialog
                    v-model="DialogIncreaseTableRow"
                    title="可持续发展体系新增指标列"
                    width="30%"
                    destroy-on-close
                    center
            >
                <el-switch v-if="this.TableDataOb.ColumnName.length!==0"
                        v-model="TableSelectMethod"
                        active-text="创建所需指标名称"
                        inactive-text="从数据库中选择"
                        active-color="#13ce66"
                        inactive-color="#E6A23C"
                >
                </el-switch>
                <el-form v-if="TableSelectMethod===true" style="margin-top: 10px" ref="NewTableRow" :model="NewTableRow" label-width="80px">
                    <el-form-item v-for="(column,index) in this.TableDataOb.ColumnName" :key="index" :label="column">
                        <el-input  v-model="NewTableRow[index]"></el-input>
                    </el-form-item>
                    <el-button type="primary" @click="AddJsonData(NewTableRow)">立即创建</el-button>
                </el-form>
                <el-form v-else style="margin-top: 10px" ref="NewTableRow" :model="NewTableRow" label-width="80px">
                    <div>
                        <span style="color: #4f4f4f;font-weight: 700;font-size: 15px">可选数据库：</span>
                        <el-radio-group v-model="SelectFromDB" @change="DataBaseChange">
                            <el-radio label="1" border>目标数据库</el-radio>
                            <el-radio label="2" border>指标数据库</el-radio>
                            <el-radio label="3" border>因子数据库</el-radio>
                        </el-radio-group>
                    </div>
                    <el-form-item style="margin-top: 10px" v-for="(column,index) in this.TableDataOb.ColumnName" :key="index" :label="column">
<!--                        <el-input  v-model="NewTableRow[index]"></el-input>-->
                        <el-select v-model="NewTableRow[index]" placeholder="请选择">
                            <el-option
                                    v-for="item in ListSelect"
                                    :key="item.Name"
                                    :label="item.Name"
                                    :value="item.Name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-button type="primary" @click="AddJsonData(NewTableRow)">立即创建</el-button>
                </el-form>
            </el-dialog>
            <el-button type="primary" style="margin-left: 1%" @click="upDataJson">指标修改</el-button>
            <el-dialog
                    v-model="DialogAlertTableRow"
                    title="可持续发展体系指标修改"
                    width="30%"
                    destroy-on-close
                    center
            >
                <el-switch v-if="this.TableDataOb.ColumnName.length!==0"
                           v-model="TableSelectMethod"
                           active-text="创建所需指标名称"
                           inactive-text="从数据库中选择"
                           active-color="#13ce66"
                           inactive-color="#E6A23C"
                >
                </el-switch>
                <el-form v-if="TableSelectMethod===true" label-width="80px">
                    <div style="margin-top: 10px" v-for="index in indexList" :key="index" >
                        <div style="color: #4f4f4f;font-weight: 700;font-size: 15px">第{{indexList[index]}}条记录：</div>
                        <el-form-item v-for="(column,index1) in TableDataOb.ColumnName" :key="index1" :label="column">
                            <el-input class="InputClass" v-model="TableDataOb.Data[indexList[index]][column]" :placeholder="TableDataOb.Data[indexList[index]][column]"></el-input>
                        </el-form-item>
                    </div>
                    <el-button type="primary" @click="DialogAlertTableRow=false">立即修改</el-button>
                </el-form>
                <el-form v-else style="margin-top: 10px" ref="NewTableRow" :model="NewTableRow" label-width="80px">
                    <div>
                        <span style="color: #4f4f4f;font-weight: 700;font-size: 15px">可选数据库：</span>
                        <el-radio-group v-model="SelectFromDB" @change="DataBaseChange">
                            <el-radio label="1" border>目标数据库</el-radio>
                            <el-radio label="2" border>指标数据库</el-radio>
                            <el-radio label="3" border>因子数据库</el-radio>
                        </el-radio-group>
                    </div>
                    <div style="margin-top: 10px" v-for="index in indexList" :key="index" >
                        <div style="color: #4f4f4f;font-weight: 700;font-size: 15px">第{{indexList[index]}}条记录：</div>
                        <el-form-item v-for="(column,index1) in TableDataOb.ColumnName" :key="index1" :label="column">
                            <el-select v-model="TableDataOb.Data[indexList[index]][column]" :placeholder="TableDataOb.Data[indexList[index]][column]">
                                <el-option
                                        v-for="item in ListSelect"
                                        :key="item.Name"
                                        :label="item.Name"
                                        :value="item.Name">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <el-button type="primary"  @click="DialogAlertTableRow=false">立即修改</el-button>
                </el-form>
            </el-dialog>

            <el-button type="danger" style="margin-left: 1%" @click="ClearTableData">体系清空</el-button>
            <el-button type="primary" style="float: right" @click="saveJsonData">数据保存</el-button>
        </div>
        <div v-if="TableDataOb.ColumnName.length===0" style="width: 99%;height: 80%;margin-left: 0.5%">
            <el-empty style="height: 100%" description="暂无数据———可以通过体系载入已有可持续发展体系或者自定义体系" />
        </div>
        <div v-else style="width: 99%;height: 80%;margin-left: 0.5%">
            <el-table
                    ref="multipleTable"
                    :data="TableDataOb.Data"
                    max-height="600"
                    style="height:99%;width: 99%;margin: 0.5%"
                    :row-class-name="tableRowClassName"
                    @selection-change="handleSelectionChange"
                    border >
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column v-for="item in TableDataOb.ColumnName" :key="item" :prop="item" :label="item" >


                </el-table-column>
            </el-table>
        </div>
    </el-card>
</template>

<script>
    import axios from "axios";
    import api from "../../../public/case/sustainable/js/axio"
    import Global from "../../../public/case/sustainable/Global";
    import{SplitJson} from "../../../public/case/sustainable/js/getData_cr";
    import{createJsonData} from "../../../public/case/sustainable/js/optionData";
    export default {
        name: "SystemTable",
        data(){
            return{



                //设置自定义表格数据体
                TableDataOb:{
                    Id:'',
                    TableName:'请设置',
                    TableRegion:Global.MapClickName,
                    ColumnName:[],
                    Data:[],
                },
                //体系载入对话框展开
                DialogLoadTableData:false,
                MongoDBData:[],

                //表名设置对话框展开
                DialogSetTableName:false,
                TableNameTemp:'请输入新的表名',

                //列名设置对话框展开
                DialogSetTableRow:false,
                RowInputVisible: false,
                RowInputValue: '',


                //指标新增对话框展开
                DialogIncreaseTableRow:false,
                NewTableRow:[],
                TableSelectMethod:true,
                SelectFromDB:'1',
                ListSelect:[],
                ListOne:[],//公共目标库
                ListTwo:[],//公共字目标库
                ListThree:[],//公共指标库

                //指标修改对话框展开
                DialogAlertTableRow:false,
                multipleSelection:[],//多选表格存贮数组,记录勾选了哪些列
                indexList:[],//修改界面需要的index列表，记录了哪些行

                //保存数据按钮展开

            }
        },
        methods:{
            //体系载入
            OpenDiaLogLoadTable(){
                this.DialogLoadTableData=true;
                //获取数据库中的数据
                axios.get(Global.SDGUrl+'/api/EcoData').then((response) => {
                    this.MongoDBData = response.data;
                    console.log(this.MongoDBData, 'TestData');
                });
            },
            //表名设置
            ConfirmSetTableName(){
                this.DialogSetTableName = false;
                this.TableDataOb.TableName=this.TableNameTemp;
            },
            ConfirmDiaLogLoadTable(){
                this.DialogLoadTableData=false;
                for(let i=0; i<this.MongoDBData.length;i++){
                    if(this.MongoDBData[i].id===this.TableDataOb.Id){
                         this.TableDataOb.TableName=this.MongoDBData[i].name;
                         this.TableDataOb.Data=this.MongoDBData[i].data;
                         this.TableDataOb.ColumnName=[];
                         for(let keyName in this.MongoDBData[i].data[0]){
                              if(Object.prototype.hasOwnProperty.call(this.MongoDBData[i].data[0],keyName)){
                                  if(keyName.indexOf("权重")===-1&&keyName.indexOf("index")===-1) {
                                      this.TableDataOb.ColumnName.push(keyName);
                                  }
                              }
                          }
                        }
                    }
            },
            //列名设置
            TableHandleClose(tag) {
                this.TableDataOb.ColumnName.splice(this.TableDataOb.ColumnName.indexOf(tag), 1);
            },
            TableShowInput() {
                this.RowInputVisible = true;
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            TableHandleInputConfirm() {
                let inputValue = this.RowInputValue;
                if (inputValue) {
                    this.TableDataOb.ColumnName.push(inputValue);
                }
                this.RowInputVisible = false;
                this.RowInputValue = '';
            },
            DataBaseChange(){
                console.log(this.SelectFromDB);
                if(this.SelectFromDB==="1"){
                    this.ListSelect=JSON.stringify(this.ListOne).replace(new RegExp("一级目标",'g'),"Name");
                    this.ListSelect=JSON.parse(this.ListSelect);
                }else if(this.SelectFromDB==="2"){
                    this.ListSelect=JSON.stringify(this.ListTwo).replace(new RegExp("二级指数",'g'),"Name");
                    this.ListSelect=JSON.parse(this.ListSelect);
                }else {
                    this.ListSelect=JSON.stringify(this.ListThree).replace(new RegExp("评价因子",'g'),"Name");
                    this.ListSelect=JSON.parse(this.ListSelect);
                }
                console.log(this.ListSelect);
            },
            //指标设置
            AddJsonData(newData){
                console.log(newData);
                if(this.TableDataOb.TableName===''){
                    this.$message({
                        message: '你好！请先设置体系名。',
                        type: 'warning'
                    });
                }
                //如果没有列名就提醒用户要新建列名
                else if(this.TableDataOb.ColumnName.length===0){
                    this.$message({
                        message: '你好！请先设置列名。',
                        type: 'warning'
                    });
                }else{
                    let OneJsonData={};
                    for(let i=0;i<this.TableDataOb.ColumnName.length;i++){
                        createJsonData(this.TableDataOb.ColumnName[i],newData[i],OneJsonData);
                    }
                    this.TableDataOb.Data.push(OneJsonData);
                    this.$message({
                        message: '成功添加一行',
                        type: 'success'
                    });
                    this.DialogIncreaseTableRow=false;
                }
                this.NewTableRow.length=0;
                // this.rowMergeArrs1=this.rowMergeHandle(this.EcologicalSystemColumn,this.EcologicalSystem.data);
            },
            //指标修改
            tableRowClassName(row){
                // 给每条数据添加一个索引
                row.row.index = row.rowIndex
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            upDataJson(){
                if(this.multipleSelection.length===0){
                    this.$message({
                        message: '你好请先选择需要修改的行',
                    });
                }else{
                    this.DialogAlertTableRow=true;
                    this.indexList.length=0;
                    let k=this.multipleSelection;
                    k.forEach((val)=>{
                        this.TableDataOb.Data.forEach((v,i)=>{
                            if(val.index===v.index){
                                this.indexList.push(i);
                            }
                        })
                    })
                    this.$refs.multipleSelection.clearSelection();

                }
                //this.rowMergeArrs1=this.rowMergeHandle(this.EcologicalSystemColumn,this.EcologicalSystem.data);
            },
            //保存数据
            saveJsonData(){
                Global.ResultJson=this.TableDataOb;
                let body={
                    "id":this.TableDataOb.Id,
                    "time":new Date().toLocaleString(),
                    "region":JSON.stringify(this.TableDataOb.TableRegion),
                    "name":this.TableDataOb.TableName,
                    "data":this.TableDataOb.Data,
                };
                api.SaveBuildTableData(body).then((Response)=>{
                    console.log(Response);
                });
                this.$message({
                    message: '保存成功',
                    type: 'success'
                });

            },
            //体系清空
            ClearTableData(){
                this.TableDataOb.Id='';
                this.TableDataOb.ColumnName=[];
                this.TableDataOb.Data=[];
                this.TableDataOb.TableName='';
                this.TableDataOb.TableRegion='';
            },
        },
        mounted(){
            //从指标库获取指标
            this.ListOne=SplitJson("维度","目标","领域","一级指标","一级目标");
            this.ListTwo=SplitJson("具体目标","具体目标","指数","二级指标","二级指数");
            this.ListThree=SplitJson("评价指标","具体指标","指标","评价因子","评价因子");
            this.ListSelect=JSON.stringify(this.ListOne).replace(new RegExp("一级目标",'g'),"Name");
            this.ListSelect=JSON.parse(this.ListSelect);
        }
    }

</script>

<style scoped>
    /deep/.el-card__body{
        padding:10px;
        height: 100%;
    }
    .el-tag + .el-tag {
        margin-left: 10px;
    }
    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }
    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
    }
</style>