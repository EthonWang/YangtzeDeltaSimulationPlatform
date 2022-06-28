import { get, post } from "@/request/request"

import { ElMessage } from "element-plus";

const tasks = [
    {
        id: "sdsd",
        name: "城市雨洪",
        description: "本任务作为SWMM模型应用的典型案例，现在共享出来方便大家学习。",
        publicBoolean: false,
        problemTags: ["城市水问题", "洪涝水环境灾害"],
        dataList: [
            {
                name: "南京市区管网.png",
                id: "45454",
                type: "cloud",
            },
            {
                name: "南京市区下水道.txt",
                id: "45454",
                type: "cloud",
            },
            {
                name: "南京市区道路.shp",
                id: "45454",
                type: "cloud",
            },
            {
                name: "南京市区道路.shp",
                id: "45454",
                type: "local",
            },
            {
                name: "南京市区道路.shp",
                id: "45454",
                type: "themetic",
            },
        ],
    },{
        id: "sdsd7474",
        name: "城市雨洪74747",
        description: "本任务4747作为SWMM模型应用的典型案例，现在共享出来方便大家学习。",
        publicBoolean: false,
        problemTags: ["城市水问题", "洪涝水环境灾害"],
        dataList: [
            {
                name: "南京市区管网.png",
                id: "45454",
                type: "cloud",
            },
            {
                name: "南京市区下水道.txt",
                id: "45454",
                type: "cloud",
            },
            {
                name: "南京市区道路.shp",
                id: "45454",
                type: "cloud",
            },
            {
                name: "南京市区道路.shp",
                id: "45454",
                type: "local",
            },
            {
                name: "南京市区道路.shp",
                id: "45454",
                type: "themetic",
            },
        ],
    },
];

export default class {
    getTaskList(id) {
        // return new Promise((resolve, reject) => {
        //     console.log(tasks)
        //     resolve({data:tasks})
        // })
        return get("/LabTask/getLabTaskList/"+id)
    }
    deleteTask(task){
        return new Promise((resolve,reject)=>{
            ElMessage({
                type:"success",
                message:"成功删除实验"
              })
            for(let i in tasks){
                if(tasks[i].id==task.id){
                    tasks.splice(i,1)
                    break
                }
            }
            resolve("成功")
        })
    }
    createTask(task){
        // return new Promise((resolve, reject) => {
        //     tasks.unshift(task)
        //     resolve({data:"成功"})
        // })
        return post("/LabTask/createLabTask",task)
        
    }
    editTask(task){
        return post("/LabTask/updateLabTask/"+task.id,task)
    }
    addData(task,dataList){
        for(let i in dataList){
            task.dataList.push(dataList[i])
        }
        this.editTask(task)
    }
    deleteData(task,index){
        task.dataList.splice(index, 1);
        this.editTask(task)
    }
}