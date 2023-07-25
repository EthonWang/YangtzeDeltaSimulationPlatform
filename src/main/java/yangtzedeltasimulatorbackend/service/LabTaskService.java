package yangtzedeltasimulatorbackend.service;

import cn.hutool.core.util.IdUtil;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.kafka.KafkaProperties;
import org.springframework.stereotype.Service;
import yangtzedeltasimulatorbackend.dao.LabTaskDao;
import yangtzedeltasimulatorbackend.dao.TaskDao;
import yangtzedeltasimulatorbackend.dao.UserDao;
import yangtzedeltasimulatorbackend.dao.UserDataDao;
import yangtzedeltasimulatorbackend.entity.doo.JsonResult;
import yangtzedeltasimulatorbackend.entity.doo.support.TaskData;
import yangtzedeltasimulatorbackend.entity.dto.TaskCheckDTO;
import yangtzedeltasimulatorbackend.entity.dto.labTask.CreateLabTaskDTO;
import yangtzedeltasimulatorbackend.entity.po.LabTask;
import yangtzedeltasimulatorbackend.entity.po.Task;
import yangtzedeltasimulatorbackend.entity.po.User;
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

    @Autowired
    UserDao userDao;

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
                        item.put("fileStoreName",userData.getFileStoreName());
                        item.put("fileWebAddress",userData.getFileWebAddress());
                        item.put("fileRelativePath",userData.getFileRelativePath());
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

    public JsonResult getLabTaskByCase(String userId, String caseName) {
        try {
            User adminUser=userDao.findByEmail("opengms@126.com").get();
            String adminUserId=adminUser.getId();

            Optional<LabTask> userLabTaskOptional= labTaskDao.findByNameAndUserId(caseName,userId);
            if(userLabTaskOptional.isPresent()){
                return ResultUtils.success(userLabTaskOptional.get());
            }

            Optional<LabTask> labTaskOptional= labTaskDao.findByNameAndUserId(caseName,adminUserId);
            if(!labTaskOptional.isPresent()){
                return ResultUtils.error("实验室不存在");
            }
            LabTask labTask=labTaskOptional.get();

            if(userId.equals(adminUserId)){
                return ResultUtils.success(labTask);
            }

            LabTask newLabTask=new LabTask();
            BeanUtils.copyProperties(labTask,newLabTask,"id");
            newLabTask.setUserId(userId);
            labTaskDao.save(newLabTask);
            return ResultUtils.success(newLabTask);
        }catch (Exception e){
            log.error(e.getMessage());
            return ResultUtils.error("获取实验室信息失败");
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
            List<JSONObject> dataList = labTask.getDataList();
            JSONObject dataObject = new JSONObject();
            dataObject.put("id", userData.getId());
            dataObject.put("name", txtName);
            dataObject.put("type", "txt");
            dataObject.put("visualType", "txt");
            dataObject.put("size", String.valueOf(fileSize));
            dataObject.put("fileStoreName", txtStoreName);
            dataObject.put("fileRelativePath", "/data/" + txtStoreName);
            dataObject.put("fileWebAddress", "/store/data/" + txtStoreName);
            dataObject.put("visualizationBoolean", false);
            dataObject.put("publicBoolean", false);
            dataObject.put("source", "cloud");
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