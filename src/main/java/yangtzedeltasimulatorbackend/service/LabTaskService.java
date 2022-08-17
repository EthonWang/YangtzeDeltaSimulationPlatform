package yangtzedeltasimulatorbackend.service;

import cn.hutool.core.util.IdUtil;
import cn.hutool.json.JSONObject;
import com.alibaba.fastjson.JSONArray;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import yangtzedeltasimulatorbackend.dao.LabTaskDao;
import yangtzedeltasimulatorbackend.dao.TaskDao;
import yangtzedeltasimulatorbackend.dao.UserDataDao;
import yangtzedeltasimulatorbackend.entity.doo.JsonResult;
import yangtzedeltasimulatorbackend.entity.doo.support.TaskData;
import yangtzedeltasimulatorbackend.entity.dto.TaskCheckDTO;
import yangtzedeltasimulatorbackend.entity.dto.labTask.CreateLabTaskDTO;
import yangtzedeltasimulatorbackend.entity.po.LabTask;
import yangtzedeltasimulatorbackend.entity.po.Task;
import yangtzedeltasimulatorbackend.entity.po.UserData;
import yangtzedeltasimulatorbackend.utils.ResultUtils;
import yangtzedeltasimulatorbackend.utils.Utils;

import javax.servlet.http.HttpServletRequest;
import javax.swing.text.rtf.RTFEditorKit;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/5/7
 **/
@Slf4j
@Service
public class LabTaskService {

    @Value("${dataStoreDir}")
    private  String dataStoreDir;

    @Autowired
    LabTaskDao  labTaskDao;

    @Autowired
    UserDataDao userDataDao;


    public JsonResult createLabTask(CreateLabTaskDTO createLabTaskDTO) {
        try {
            LabTask labTask=new LabTask();

            BeanUtils.copyProperties(createLabTaskDTO,labTask);
//            labTask.setUserId(userId);
            labTaskDao.save(labTask);

            return ResultUtils.success("新建实验室任务成功");
        }catch (Exception e){
            log.error(e.getMessage());
            return ResultUtils.error("新建实验室任务失败");
        }

    }

    public JsonResult getLabTaskList(String userId) {
        try {

            List<LabTask> taskList = labTaskDao.findAllByUserId(userId);

            return ResultUtils.success(taskList);
        }catch (Exception e){
            log.error(e.getMessage());
            return ResultUtils.error("获取实验室任务列表失败");
        }

    }

    public JsonResult updateLabTask(String labTaskId, CreateLabTaskDTO createLabTaskDTO) {
        try {
            LabTask labTask=labTaskDao.findById(labTaskId).get();
            BeanUtils.copyProperties(createLabTaskDTO,labTask);
            labTaskDao.save(labTask);
            return ResultUtils.success("更新实验室任务成功");
        }catch (Exception e){
            log.error(e.getMessage());
            return ResultUtils.error("更新实验室任务失败");
        }
    }

    public JsonResult deleteLabTaskList(String labTaskId) {
        try {
            labTaskDao.deleteById(labTaskId);
            return ResultUtils.success("删除实验室任务成功");
        }catch (Exception e){
            log.error(e.getMessage());
            return ResultUtils.error("删除实验室任务失败");
        }
    }

    public JsonResult updateLabTxtFile(HttpServletRequest request) {
        String txtData = request.getParameter("txtData");
        String fileStoreName = request.getParameter("fileStoreName");
        String fileRelativePath = request.getParameter("fileRelativePath");
        String visualType = request.getParameter("visualType");
        String id = request.getParameter("id");
        String taskId = request.getParameter("taskId");
        // 修改数据库中文件信息
        Optional<UserData> byId = userDataDao.findById(id);
        if(!byId.isPresent()){
            return  ResultUtils.error("文件修改失败！");
        }
        UserData userData = byId.get();
        String fileName = userData.getName();
        String newStoreName = fileStoreName.split(".txt")[0].substring(0,fileName.length()-4) + IdUtil.objectId() + ".txt";
        userData.setFileStoreName(newStoreName);
        userData.setFileRelativePath("/data/" + newStoreName);
        userData.setFileWebAddress("/store/data/" + newStoreName);
        if("txt".equals(visualType)){
            String oldFileDir = dataStoreDir + fileRelativePath;
            String newFileDir = dataStoreDir + userData.getFileRelativePath();
            File oldFile = new File(oldFileDir);
            File newFile = new File(newFileDir);
            try {
                if (oldFile.exists()) {
                    //如果文件存在，删除文件
//                    file.createNewFile();
                    oldFile.delete();
                }
                newFile.createNewFile();
                //创建FileWriter对象
                FileOutputStream fos = new FileOutputStream(newFile);
                //向文件中写入内容
                fos.write(txtData.getBytes());
                fos.close();
                userData.setSize(String.valueOf(newFile.length()));
                Optional<LabTask> byId_task = labTaskDao.findById(taskId);
                if(!byId_task.isPresent()){
                    return  ResultUtils.error("文件修改失败！");
                }
                LabTask labTask = byId_task.get();
                List<JSONObject> dataList = labTask.getDataList();
                for(JSONObject item : dataList){
                    if(item.get("id").equals(id)){
                        item.set("fileStoreName",userData.getFileStoreName());
                        item.set("fileWebAddress",userData.getFileWebAddress());
                        item.set("fileRelativePath",userData.getFileRelativePath());
                    }
                }
                labTaskDao.save(labTask);
                userDataDao.save(userData);
                return ResultUtils.success(labTask);
            } catch (IOException e) {
                e.printStackTrace();
                return ResultUtils.error("文件修改失败！");
            }
        } else{
            return ResultUtils.error("文件修改失败！");
        }
    }

    public JsonResult newLabTxtFile(HttpServletRequest request, String labTaskId) {
        try{
            // 1.创建文本文件
            String txtName = request.getParameter("name");
            if(txtName.indexOf(".txt") < 0){
                txtName = txtName + ".txt";
            }
            String txtStoreName = txtName.split(".txt")[0] + IdUtil.objectId() + ".txt";
            String path = dataStoreDir + "/data/" + txtStoreName;
            File txtFile = new File(path);
            txtFile.createNewFile();
            // 2.添加到用户资源
            String userId = request.getParameter("userId");
            UserData userData = new UserData();
            String fileName = txtFile.getName();
            Long fileSize = txtFile.length();
            userData.setName(txtName);
            userData.setType("file");
            userData.setVisualType("txt");
            userData.setSize(fileSize.toString());
            userData.setFileStoreName(txtStoreName);
            userData.setFileWebAddress("/store/data/" + txtStoreName);
            userData.setFileRelativePath("/data/" + txtStoreName);
            userData.setPublicBoolean(false);
            userData.setVisualizationBoolean(false);
            userData.setParentId(labTaskId);
            userData.setUserId(userId);
            userDataDao.save(userData);
            // 3.添加到实验室
            Optional<LabTask> byId1 = labTaskDao.findById(labTaskId);
            if (!byId1.isPresent()) {
                return ResultUtils.error("保存失败");
            }
            LabTask labTask = byId1.get();
            List<cn.hutool.json.JSONObject> dataList = labTask.getDataList();
            cn.hutool.json.JSONObject dataObject = new cn.hutool.json.JSONObject();
            dataObject.set("id", userData.getId());
            dataObject.set("name", txtName);
            dataObject.set("type", "txt");
            dataObject.set("visualType", "txt");
            dataObject.set("size", String.valueOf(fileSize));
            dataObject.set("fileStoreName", txtStoreName);
            dataObject.set("fileRelativePath", "/data/" + txtStoreName);
            dataObject.set("fileWebAddress", "/store/data/" + txtStoreName);
            dataObject.set("visualizationBoolean", false);
            dataObject.set("publicBoolean", false);
            dataObject.set("source", "cloud");
            dataList.add(dataObject);
            labTask.setDataList(dataList);
            labTaskDao.save(labTask);

            return ResultUtils.success(labTask);
        }catch (Exception e){
            log.error(e.getMessage());
            return ResultUtils.error();
        }
    }

}