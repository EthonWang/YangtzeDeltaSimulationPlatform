<template>
    <el-card style="margin-left:1%;margin-top:0.5%;height: 98%;width:98%;background-color: hsla(0, 0%, 100%, 0.85);">
        <template #header>
            <div class="card-header">
                <span style="color: #4f4f4f;font-weight: 700;font-size: 24px;">可持续发展体系权重及数据载入</span>
                <span style="color: #4f4f4f;font-weight: 700;font-size: 20px;float: right;margin-top: 0px;">综合得分：{{this.resultScore}}<br/>研究区域：{{this.TableDataOb.TableRegion}}</span><br/>
                <span style="color: #4f4f4f;font-weight: 700;font-size: 20px;">体系名称：{{this.TableDataOb.TableName}}</span>
            </div>

        </template>

        <div style="width: 99%;height: 5%;margin-left: 0.5%">
            <el-button type="primary" @click="AddData()">输入数据</el-button>
            <el-dialog
                    v-model="DialogAddData"
                    title="可持续发展体系基础指标数据"
                    width="70%"
                    destroy-on-close
                    center
            >
                <el-form style="margin-top: 10px" ref="NewData" :model="NewData" :inline="true" label-width="100px">
                    <el-form-item>
                        <div>
                            <el-form-item v-for="index of this.TableDataOb.Data.length" :key="index" :label="this.TableDataOb.Data[index-1][this.TableDataOb.ColumnName[this.TableDataOb.ColumnName.length-1]]">
                                <el-input v-model="NewData[index]" style="width: 66px"></el-input>
                            </el-form-item>
                        </div>
                        <br>
                    </el-form-item>
                </el-form>
                <el-button type="primary" center @click="DialogAddData=false">立即创建</el-button>
            </el-dialog>
            <!-- 弹出添加权值的dialogue窗口 -->
            <el-button type="primary" style="margin-left: 1%" @click="AddColumnData()">添加权值</el-button>
            <el-dialog
                    v-model="DialogAddWeight"
                    title="可持续发展体系赋权"
                    width="80%"
                    destroy-on-close
                    center
            >
                <el-form style="margin-top: 10px" ref="NewTableRow" :model="NewTableRow" label-width="100px">
                    <el-form-item v-for="(column1,index) in this.TableDataOb.ColumnName" :key="index" >
                            <div v-for="(column2,index2) of this.TableDataOb.Data.length" :key="index2">
                            <el-form-item v-if="index2==0 || this.TableDataOb.Data[index2][column1] != this.TableDataOb.Data[index2-1][column1]" :label="this.TableDataOb.Data[index2][column1]">
                                <el-input v-model="NewTableRow[index*this.TableDataOb.Data.length+index2]" style="width: 66px"></el-input>
                            </el-form-item>
                        </div>
                        <br>
                        <br>
                    </el-form-item>
                    <el-button type="primary" center @click="DialogAddWeight=false">立即创建</el-button>
                </el-form>
            </el-dialog>

            <el-button type="primary" style="margin-left: 1%" @click="getScore">综合得分</el-button>
            <!-- <el-button type="primary" style="margin-left: 1%" @click="test">打印测试</el-button> -->
            <!-- <el-button type="primary" style="margin-left: 1%" @click="printData">打印数据</el-button> -->
        </div>
        <!-- 没有正常获取数据并显示时的提醒语 -->
        <div v-if="TableDataOb.ColumnName == null || TableDataOb.ColumnName.length===0" style="width: 99%;height: 80%;margin-left: 0.5%;margin-top:1%">
        <el-empty style="height: 100%" description="暂无数据———可以通过体系载入已有可持续发展体系或者自定义体系" />
        </div>
        <div v-else style="width: 99%;height: 80%;margin-left: 0.5%;margin-top:1%">
            <el-table
                ref="multipleTable"
                :data="TableDataOb.Data"
                max-height="600"
                style="height:99%;width: 99%;margin: 0.5%"
                :row-class-name="tableRowClassName"
                :span-method="objectSpanMethod"
                height="330"
                border >
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            
            <!-- <el-table-column v-for="item in TableDataOb.ColumnName" :key="item" :prop="item" :label="item" >
            </el-table-column> -->

            <!-- 直接在表格中添加权重列，并手动输入（对应empowerment方法） -->
            <el-table-column v-for="(item) in TableDataOb.ColumnName" :key="item" :prop="item" :label="item" >
                    <!-- <template v-if="item.includes('权重')||item.includes('数据')" #default="scope">
                        <span v-for="(i,ii) of TableDataOb.Data.length" :key="i">
                            <span v-if="ii == scope.row.index" @click="test2(scope.row.index,i)">
                                <el-input v-model="this.TableDataOb.Data[ii][item]" type="number" placeholder="请输入权重"/>
                            </span>
                        </span>
                    </template> -->
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
        name: "Sustainable_crdata",
        data(){
            return{
                // 数据对象
                TableDataOb:{
                    Id:Global.ResultJson.Id,
                    TableName:Global.ResultJson.TableName,
                    TableRegion:Global.ResultJson.TableRegion,
                    ColumnName:Global.ResultJson.ColumnName,
                    Data:Global.ResultJson.Data,
                    RegionScale:Global.ResultJson.RegionScale,
                },

                // 用来记录需要合并行的下标
                mergeObj: {}, 

                // 输入权重对话框展开
                DialogAddWeight:false,
                // 保存权重数据
                NewTableRow:[[]],
                // 输入数据对话框展开
                DialogAddData:false,
                NewData:[],
                // 综合得分
                resultScore:0,
                // 过程得分（中间层目标、指标或因子得分）
                columnScore:[[]],
            }
        },
        methods:{
            // 计算综合得分的方法
            getScore(){
                for(let i = 0; i<this.TableDataOb.ColumnName.length;i++){
                    // 检查是否已经计算过
                    if(this.TableDataOb.ColumnName[i].includes('得分')){
                        this.$message({
                        message: '您已经计算过了！',
                        });
                        return false;
                    }
                };
                console.log(this.NewTableRow,this.NewData);
                if(this.NewTableRow.length <= 1 || this.NewData.length.length <=1 ){
                    this.$message({
                        message: '请输入合适的权重和基础数据',
                        type:'warning'
                    });
                    return false;
                }
                var weighData = [];
                var weigh = [];
                var score = [];
                var fact = 0;
                var factScore = [];
                this.resultScore = 0;
                // 先处理一下权重数据
                // 拿到每一列的权重数据(含补全数据)
                for(let i =0 ; i<this.TableDataOb.ColumnName.length ; i++){
                    for(let j =0 ; j<this.TableDataOb.Data.length ; j++){
                        if(this.NewTableRow[i*this.TableDataOb.Data.length+j] != undefined){
                            weigh[j] = this.NewTableRow[i*this.TableDataOb.Data.length+j];
                        }else{
                            weigh[j] = weigh[j-1];
                        }
                    }
                    weighData[i] = weigh;
                    weigh =[];
                }
                // 先通过输入的数据获得最底层的得分(因子层)
                for(let i = 1;i<this.NewData.length;i++){
                    score[i-1] = Number(weighData[weighData.length-1][i-1])*Number(this.NewData[i]);
                    factScore[i-1]=Number(this.NewData[i]);
                }
                this.columnScore[0] = factScore;
                factScore = [];
                // 一层层计算上层得分，直到最顶层
                for(let k=weighData.length-2 ; k >= 0 ; k--){
                    // 考虑上层元素与下一行名称是否一致，如果一致，则将因子层得分累和
                    // 当发现不一致的时候，将累计得分赋予给该层元素的这几行
                    // 重新开始新一轮检查
                    for(let i = 0 ; i<this.TableDataOb.Data.length ; i++){
                        fact += score[i];
                        if(i==this.TableDataOb.Data.length-1){
                            fact = (fact/Number(weighData[k][i])).toFixed(2);
                            factScore[i]=fact;
                            fact =0;
                        }else if(this.TableDataOb.Data[i][this.TableDataOb.ColumnName[k]]==this.TableDataOb.Data[i+1][this.TableDataOb.ColumnName[k]]){
                            console.log();
                        }else{
                            fact = (fact/Number(weighData[k][i])).toFixed(2);
                            factScore[i]=fact;
                            fact =0;
                        }
                    }
                    this.columnScore[weighData.length-1-k]=factScore;
                    factScore = [];
                    // console.log(this.columnScore,'this.columnScore,得到评分');
                    // 处理拿到的评分数据，进行填充
                    for(let i = 1 ; i<this.columnScore.length ; i++){
                        for(let j =this.columnScore[i].length-2 ; j >= 0 ; j--){
                            if(this.columnScore[i][j] == undefined){
                                this.columnScore[i][j] = this.columnScore[i][j+1];
                            }
                        }
                    }
                    // console.log(this.columnScore,'this.columnScore,得到填充评分');
                    // 将得分全部赋给对应的行(按行对象的数据结构)
                    // for(let i = 0 ; i<score.length ; i++){
                    //     score[i] = score[i] * Number(weighData[k][i]);
                    // }
                }
                // 得分加起来，就是加权的综合评分
                for(let l=0 ; l<score.length ; l++){
                    this.resultScore = this.resultScore + score[l];
                }
                this.resultScore = (this.resultScore).toFixed(2);
                this.$message({
                        message: '用户您好！该体系的综合得分为'+this.resultScore,
                        type: 'success'
                });
                // 将计算的数据记录到Global.ResultJson中为可视化服务
                this.createJsonData();
                // 更新数据和表头
                this.updateData(weighData);
                // 执行一次数据保存，目的是为了保存输入的权重和计算的得分
                this.saveJsonData();
            },
            // 将输入的权重和计算的得分加入数据中，更新表头
            updateData(weighData){
                // 更新数据之前要先删除之前存入的数据
                for(let i =0 ; i<this.TableDataOb.Data.length; i++){
                    for(let key in this.TableDataOb.Data[i] ){
                        if(key.indexOf("得分")==1 || key.indexOf("权重")==1){
                            console.log(key,'quedingkey');
                            delete this.TableDataOb.Data[i].key;
                        }   
                    }
                    // console.log(this.TableDataOb.Data[i],'newdata!!');
                }
                // 在data[0]中存入综合得分
                var name = this.TableDataOb.TableName + "综合得分";
                this.TableDataOb.Data[0][name] = this.resultScore;
                // 先存入得分数据和权重数据
                for(let i =0 ; i<this.TableDataOb.ColumnName.length; i++){
                    var score = this.TableDataOb.ColumnName[i] + "得分";
                    var weight = this.TableDataOb.ColumnName[i] + "权重";
                    // this.TableDataOb.ColumnName.push(score);
                    // this.columnName.push(weight);
                    for(let j = 0 ; j<this.TableDataOb.Data.length ; j++){
                        this.TableDataOb.Data[j][score] = this.columnScore[this.TableDataOb.ColumnName.length-1-i][j];
                        this.TableDataOb.Data[j][weight] = weighData[i][j];
                    }
                }
                // console.log(this.TableDataOb.Data,'newdata');
                // 数据存储完了再添加表头
                let newColumnName = new Array();
                for(let i = 0;i<this.TableDataOb.ColumnName.length * 2;i++){
                    if(i%2==0){
                        newColumnName[i]=this.TableDataOb.ColumnName[i/2];
                    }else{
                        newColumnName[i]=`${newColumnName[i-1]}得分`;
                        // this.fillData(newColumnName[i])
                    }
                }
                this.TableDataOb.ColumnName=newColumnName;
                // console.log(this.TableDataOb.ColumnName,'newColumnName');
                // 再存入权重数据
            },
            // 提供数据条目和对应的指标得分,形成Json数据结构
            createJsonData(){
                var jsonData=[];
                var data = {};
                data.Name=this.TableDataOb.TableName + "综合得分";
                data.NameData=this.resultScore;
                jsonData.push(data);
                for(let i = 0 ; i<this.TableDataOb.ColumnName.length ; i++){
                    for(let j = 0 ; j<this.TableDataOb.Data.length ; j++){
                        data = {};
                        // 解决数组超限问题
                        if(j != this.TableDataOb.Data.length-1){
                            if(this.TableDataOb.Data[j][this.TableDataOb.ColumnName[i]] != this.TableDataOb.Data[j+1][this.TableDataOb.ColumnName[i]]){
                                // console.log(this.TableDataOb.Data[j][this.TableDataOb.ColumnName[i]],'123');
                                data.Name=this.TableDataOb.Data[j][this.TableDataOb.ColumnName[i]];
                                data.NameData=this.columnScore[this.TableDataOb.ColumnName.length-1-i][j]
                                jsonData.push(data);
                            }
                        }else if(j == this.TableDataOb.Data.length-1){
                            // 如果最后一个与倒数第二个不相等，或者最后一个与第一个相等，都添入JSON
                            if(this.TableDataOb.Data[j][this.TableDataOb.ColumnName[i]] !=this.TableDataOb.Data[j-1][this.TableDataOb.ColumnName[i]] || this.TableDataOb.Data[j][this.TableDataOb.ColumnName[i]] == this.TableDataOb.Data[0][this.TableDataOb.ColumnName[i]])
                            // console.log(this.TableDataOb.Data[j][this.TableDataOb.ColumnName[i]],'456');
                            data.Name=this.TableDataOb.Data[j][this.TableDataOb.ColumnName[i]];
                            data.NameData=this.columnScore[this.TableDataOb.ColumnName.length-1-i][j]
                            jsonData.push(data);
                        }
                    }
                }
                console.log(jsonData,'jsonData');
                Global.ResultJson=jsonData;
            },
            // 弹出窗口dialogue增加权重
            AddColumnData(newData){
                // 如果已经计算过了，本次就不再接受数据了
                for(var i = 0 ; i<this.TableDataOb.ColumnName.length ; i++){
                    if(this.TableDataOb.ColumnName[i].indexOf('得分') != -1){
                        this.$message({
                        message: '您已经完成综合计算！',
                        });
                        return false;
                    }
                }
                this.DialogAddWeight = true;
            },
            AddData(newData){
                for(var i = 0 ; i<this.TableDataOb.ColumnName.length ; i++){
                    if(this.TableDataOb.ColumnName[i].indexOf('得分') != -1){
                        this.$message({
                        message: '您已经完成综合计算！',
                        });
                        return false;
                    }
                }
                this.DialogAddData = true;
            },
            // 为表格添加权重和数据列
            empowerment(){
                for(let i = 0; i<this.TableDataOb.ColumnName.length;i++){
                    // 检查是否已经赋过权重
                    if(this.TableDataOb.ColumnName[i].includes('权重')){
                        this.$message({
                        message: '您已经赋过权重了！',
                        });
                        return false;
                    }
                };
                let newColumnName = new Array();
                for(let i = 0;i<this.TableDataOb.ColumnName.length * 2;i++){
                    if(i%2==0){
                        newColumnName[i]=this.TableDataOb.ColumnName[i/2];
                    }else if(this.TableDataOb.ColumnName.length * 2-i==1){
                        newColumnName[i]=`${newColumnName[i-1]}权重`;
                        this.fillData(newColumnName[i])
                        newColumnName[i+1]=`${newColumnName[i-1]}数据`;
                        this.fillData(newColumnName[i+1])
                        break;
                    }else{
                        newColumnName[i]=`${newColumnName[i-1]}权重`;
                        this.fillData(newColumnName[i])
                    }
                }
                this.TableDataOb.ColumnName=newColumnName;
                console.log(this.TableDataOb.ColumnName,'123');
            },
            // 新增列填充初始值
            fillData(columnName){
                for(let i= 0;i < this.TableDataOb.Data.length;i++){
                    // console.log(this.TableDataOb.Data[0][columnName]);
                    if(this.TableDataOb.Data[i][columnName] == null)
                    this.TableDataOb.Data[i][columnName]=0;
                }
            },
            // 通过 tableRowClassName 设置每一行的index
            tableRowClassName ({ row, rowIndex }) {
            // 把每一行的索引放进row
                row.index = rowIndex
            },

            // 合并表格中相同的行
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
            // 默认接受四个值 { 当前行的值, 当前列的值, 行的下标, 列的下标 }
            objectSpanMethod({ row, column, rowIndex, columnIndex }) {
                // 调用数据初始化数据的方法,便于行合并
                this.getSpanArr(this.TableDataOb.Data);
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
            },
            //保存数据
            saveJsonData(){
                let body={
                    "id":this.TableDataOb.Id,
                    "time":new Date().toLocaleString(),
                    "region":JSON.stringify(this.TableDataOb.TableRegion),
                    "name":this.TableDataOb.TableName,
                    "data":this.TableDataOb.Data,
                    "scale":this.TableDataOb.RegionScale,
                };
                console.log(body,'saveData1.2');
                api.SaveBuildTableData(body).then((Response)=>{
                    console.log(Response,'saveData2.2');
                });
            },
        },
        mounted(){
            
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