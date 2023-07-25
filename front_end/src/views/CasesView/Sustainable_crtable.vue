<template>
    <el-card style="margin-left:1%;margin-top:0.5%;height: 98%;width:98%;background-color: hsla(0, 0%, 100%, 0.85);">
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
                        <el-button type="primary" @click="ConfirmDiaLogTable">
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
            <!-- 指标添加，传入数据库 -->
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
                        <div style="color: #4f4f4f;font-weight: 700;font-size: 15px">第{{index+1}}行指标：</div>
                        <el-form-item v-for="(column,index1) in TableDataOb.ColumnName" :key="index1" :label="column">
                            <el-input class="InputClass" v-model="TableDataOb.Data[index][column]" :placeholder="TableDataOb.Data[index][column]"></el-input>
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
            <el-button type="primary" style="margin-left: 1%" @click="DeleteData">指标删除</el-button>
            <el-button type="danger" style="margin-left: 1%" @click="ClearTableData">体系清空</el-button>
            <el-button type="primary" style="float: right" @click="saveJsonData">数据保存</el-button>
        </div>
        <div v-if="TableDataOb.ColumnName.length===0" style="width: 99%;height: 80%;margin-left: 0.5%;margin-top:1%">
            <el-empty style="height: 100%" description="暂无数据———可以通过体系载入已有可持续发展体系或者自定义体系" />
        </div>
        <div v-else style="width: 99%;height: 80%;margin-left: 0.5%;margin-top:1%;">
            <el-table
                    ref="multipleTable"
                    :data="TableDataOb.Data"
                    max-height="600"
                    style="height:99%;width: 99%;margin: 0.5%"
                    :row-class-name="tableRowClassName"
                    :span-method="objectSpanMethod"
                    @selection-change="handleSelectionChange"
                    height="330"
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
                    RegionScale:Global.RegionScale,
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

                //合并表格数据
                needMergeArr1: [],
                rowMergeArrs: {},

                // 用来记录需要合并行的下标
                mergeObj: {}, 

                // 标识数据保存状态
                flag:Global.crTableFlag,
            }
        },
        methods:{
            //体系载入
            OpenDiaLogLoadTable(){
                // this.multipleSelection =[]
                // this.$refs.multipleSelection.clearSelection();
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
            ConfirmDiaLogTable(){
                this.$confirm('以该模板新建体系还是在原先体系基础上修改', '提示', {
                    confirmButtonText: '新建',
                    cancelButtonText: '修改',
                    type: 'warning'
                    }).then(() => {
                        this.ConfirmDiaLogLoadTable();
                        this.TableDataOb.Id = '';
                        this.$message({
                            type: 'success',
                            message: '新建成功！'
                        });
                    }).catch(() => {
                        this.ConfirmDiaLogLoadTable();
                        this.$message({
                            type: 'success',
                            message: '进入修改模式！'
                        });          
                });

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
                                if(keyName.indexOf("权重")===-1&&keyName.indexOf("index")===-1&&keyName.indexOf("得分")===-1) {
                                    this.TableDataOb.ColumnName.push(keyName);
                                }
                            }
                        }
                    }
                }
                // 调用数据初始化数据的方法,便于行合并
                this.getSpanArr(this.TableDataOb.Data);
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
                // 调用数据初始化数据的方法,便于行合并,加在这里是因为如果不重新初始化数据，添加的数据就不会实时更新在表格中
                this.getSpanArr(this.TableDataOb.Data);
                // this.ConfirmDiaLogLoadTable();
            },
            //指标修改
            tableRowClassName(row){
                // 给每条数据添加一个索引
                row.row.index = row.rowIndex
            },
            // 点击勾选框时执行
            handleSelectionChange(val) {
                this.multipleSelection = val;
                // console.log(this.multipleSelection,'val');
            },
            upDataJson(){
                if(this.multipleSelection.length===0){
                    this.$message({
                        message: '你好请先选择需要修改的行',
                    });
                }else{
                    console.log("进入到修改流程");
                    this.DialogAlertTableRow=true;
                    this.indexList.length=0;
                    let k=this.multipleSelection;
                    // 拿到选中行的索引数字，但是排序与点击顺序挂钩
                    k.forEach((val)=>{
                        this.TableDataOb.Data.forEach((v,i)=>{
                            if(val.index===v.index){
                                this.indexList.push(i);
                            }
                        })
                    })
                    this.indexList.sort()
                    console.log(this.indexList,'123');
                    this.$refs.multipleSelection.clearSelection();
                }
            },
            //保存数据
            saveJsonData(){
                if(this.TableDataOb.Data.length <= 1){
                    this.$message({
                        message: '你好,请导入或新建表格',
                        type: 'warning'
                    });
                    return false;
                }
                Global.ResultJson=this.TableDataOb;
                this.flag = true;
                Global.crTableFlag = this.flag;
                // let body={
                //     "id":this.TableDataOb.Id,
                //     "time":new Date().toLocaleString(),
                //     "region":JSON.stringify(this.TableDataOb.TableRegion),
                //     "name":this.TableDataOb.TableName,
                //     "data":this.TableDataOb.Data,
                //     "scale":this.TableDataOb.RegionScale,
                // };
                // console.log(body,'saveData1');
                // api.SaveBuildTableData(body).then((Response)=>{
                //     console.log(Response,'saveData');
                //     // Global.ResultJson = Response.config.data.id;
                //     console.log(Response.config.data.id,123);
                // });
                this.$message({
                    message: '保存成功',
                    type: 'success'
                });

            },
            // 删除指标
            DeleteData(){
                // console.log(this.multipleSelection[0].index,'111');
                if(this.multipleSelection.length===0){
                    this.$message({
                        message: '你好请先选择需要删除的行',
                    });
                }else{
                    let arr = new Array()
                    for(let j=0;j<this.multipleSelection.length;j++){
                        arr[j] = this.multipleSelection[j].index
                    };
                    arr.sort();
                    for(let i=0;i<arr.length;i++){
                        this.TableDataOb.Data.splice(arr[i]-i,1);
                    }
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                }
            },

            //体系清空
            ClearTableData(){
                this.TableDataOb.Id='';
                this.TableDataOb.ColumnName=[];
                this.TableDataOb.Data=[];
                this.TableDataOb.TableName='';
                this.TableDataOb.TableRegion='';
            },
            // 下面两个方法都是为了合并相同行，getSpanarr是数据处理用的
            getSpanArr(data) {
                this.TableDataOb.ColumnName.forEach((key, index1) => {
                    let count = 0; // 用来记录需要合并行的起始位置
                    this.mergeObj[key] = []; // 记录每一列的合并信息
                    data.forEach((item, index) => {
                        // index == 0表示数据为第一行，直接 push 一个 1
                        if(index === 0) {
                            this.mergeObj[key].push(1); 
                        } else {
                            // 判断当前行是否与上一行其值相等 如果相等 在 count 记录的位置其值 +1 表示当前行需要合并 并push 一个 0 作为占位
                            if(item[key] === data[index - 1][key]) { 
                                this.mergeObj[key][count] += 1;
                                this.mergeObj[key].push(0);
                            } else {
                                // 如果当前行和上一行其值不相等 
                                count = index; // 记录当前位置 
                                this.mergeObj[key].push(1); // 重新push 一个 1
                            }
                        }
                    })
                })
            },
            // 默认接受四个值 { 当前行的值, 当前列的值, 行的下标, 列的下标 }，行合并方法
            objectSpanMethod({ row, column, rowIndex, columnIndex }) {
                // 判断列的属性
                if(this.TableDataOb.ColumnName.indexOf(column.property) !== -1) { 
                    // 判断其值是不是为0 
                    if(this.mergeObj[column.property][rowIndex]) { 
                        return [this.mergeObj[column.property][rowIndex], 1]
                    } else {
                        // 如果为0则为需要合并的行
                        return [0, 0]; 
                    }
                }
            }
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
        /* height: 100%; */
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