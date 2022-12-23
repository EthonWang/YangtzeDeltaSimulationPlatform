<template>
    <el-card style="margin-left:2%;margin-top:1.5%;height: 94%;width:96%;background-color: hsla(0, 0%, 100%, 0.85);">
        <template #header>
            <div class="card-header">
                <span style="color: #4f4f4f;font-weight: 700;font-size: 24px;">可持续发展体系权重及数据载入</span><br/>
                <span style="color: #4f4f4f;font-weight: 700;font-size: 20px;">体系名称：{{this.TableDataOb.TableName}}</span>
                <span style="color: #4f4f4f;font-weight: 700;font-size: 20px;float: right">研究区域：{{this.TableDataOb.TableRegion}}</span>
            </div>

        </template>

        <div style="width: 99%;height: 5%;margin-left: 0.5%">
            <el-button type="primary" @click="empowerment">输入权重</el-button>    
            <el-button type="primary" style="margin-left: 1%" @click="test">打印测试</el-button>
            <el-button type="primary" style="margin-left: 1%" @click="empowerment">计算权值</el-button>    
            <el-button type="primary" style="margin-left: 1%" @click="printData">打印数据</el-button>
        </div>
        <!-- 没有正常获取数据并显示时的提醒语 -->
        <div v-if="TableDataOb.ColumnName == null || TableDataOb.ColumnName.length===0" style="width: 99%;height: 80%;margin-left: 0.5%">
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
                @cell-click="tabClick"
                border >
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            
            <!-- <el-table-column v-for="item in TableDataOb.ColumnName" :key="item" :prop="item" :label="item" >
            </el-table-column> -->

            <!-- 尝试在表格中直接添加权重，但是动一个数据就全部改动了，没办法了 -->
            <!-- 尝试在表格中直接添加权重，但是动一个数据就全部改动了，没办法了 -->
            <!-- 尝试在表格中直接添加权重，但是动一个数据就全部改动了，没办法了 -->
            <el-table-column v-for="(item) in TableDataOb.ColumnName" :key="item" :prop="item" :label="item" >
                    <template v-if="item.includes('权重')||item.includes('数据')" #default="scope">
                        <span v-for="(i,ii) of TableDataOb.Data.length" :key="i">
                            <span v-if="ii == scope.row.index" @click="test2(scope.row.index,i)">
                                <el-input v-model="this.TableDataOb.Data[ii][item]" type="number" placeholder="请输入权重"/>
                            </span>
                        </span>
                    </template>
            </el-table-column>  
            <!-- 测试列，看看能不能编辑 -->
            <!-- 测试列，看看能不能编辑 -->
            <!-- 测试列，看看能不能编辑 -->
            <!-- <el-table-column prop='change' label="权重">
                <template #default="scope">
                    <span v-if="scope.row.index === tabClickIndex && tabClickLabel === '权重'">
                        <el-input v-model="scope.row.change" type="text" clearable maxlength="20" placeholder="请输入权重" size="mini" @blur="inputBlur(scope.row)" />
                    </span>
                    <span v-else></span>
                </template>
            </el-table-column> -->
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
                TableDataOb:{
                    Id:Global.ResultJson.Id,
                    TableName:Global.ResultJson.TableName,
                    TableRegion:Global.ResultJson.TableRegion,
                    ColumnName:Global.ResultJson.ColumnName,
                    Data:Global.ResultJson.Data,
                },
                tabClickIndex:'',
                tabClickLabel:'',
            }
        },
        methods:{
            test(){
                // console.log(Global.ResultJson,'111');
                // console.log(this.TableDataOb.ColumnName,'222');
                // if(this.TableDataOb.ColumnName == null){
                //     console.log('is null');
                // }
                console.log(this.TableDataOb.Data[1]['天蓝权重'],'123');
            },
            test2(row,i){
                console.log(row,i,'0012');
            },
            // 为表格添加权重和数据列
            empowerment(){
                // console.log(Global.ResultJson.ColumnName,'column');
                for(let i = 0; i<this.TableDataOb.ColumnName.length;i++){
                    // 检查是否已经赋过权重了
                    if(this.TableDataOb.ColumnName[i].includes('权重')){
                        this.$message({
                        message: '您已经赋过权重了！',
                        });
                        return false;
                    }
                };
                // console.log(this.TableDataOb.Data.length,'123');
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

            },
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
            // tabClick row 当前行 column 当前列
            tabClick (row, column, cell, event) {
                // switch (column.label) {
                //     case '权重':
                //     this.tabClickIndex = row.index
                //     this.tabClickLabel = column.label
                //     break
                //     case '数据':
                //     this.tabClickIndex = row.index
                //     this.tabClickLabel = column.label
                //     break
                //     default: return
                // }
                if(column.label.includes('权重')){
                    this.tabClickIndex = row.index
                    this.tabClickLabel = column.label
                }else{
                    return
                }
                // console.log('tabClick', this.tabClickIndex, this.tabClickLabel)
            },
            // 失去焦点初始化
            inputBlur (row) {
                // console.log('row', row)
                this.tabClickIndex = null
                this.tabClickLabel = ''
            },
            // 合并表格的三个函数
            arraySpanMethod({ column, rowIndex }) {
            // 把需要循环的列名加入
                for (let i = 0; i < this.needMergeArr1.length; i++)
                    if (column.property === this.needMergeArr1[i])
                    return this.mergeAction(this.needMergeArr1[i], rowIndex);
            },
            mergeAction(val, rowIndex) {
                let _row = this.rowMergeArrs1[val].rowArr[rowIndex];
                let _col = _row > 0 ? 1 : 0;
                return [_row, _col];
            },
            rowMergeHandle(arr, data) {
                if (!Array.isArray(arr) && !arr.length) return false;
                if (!Array.isArray(data) && !data.length) return false;
                let needMerge = {};
                arr.forEach((i) => {
                    needMerge[i] = {
                    rowArr: [],
                    rowMergeNum: 0,
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
            // 打印数据方法，便于前期核对数据，后期删除
            printData(){
                console.log(this.TableDataOb,'data');
            },
            alert(){
                this.$message({
                        message: '您已经赋过权重了！',
                        });
            },
            // 将输入的值传递给tableDataOb，但是前台显示的又不对，方法弃用
            selectData(data,index,row){
                // @click="selectData(scope.row.item,index,scope.row)"
                console.log(data,index,row,'1111');
                // 获取列名
                // console.log(this.TableDataOb.ColumnName[index],'22');
                // 获取行标
                // console.log(row.index,'00');
                // console.log(this.TableDataOb.Data[row.index],'33')
                this.TableDataOb.Data[row.index][this.TableDataOb.ColumnName[index]]=data
                // console.log(this.TableDataOb.Data[row.index][this.TableDataOb.ColumnName[index]],'33')
            }
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