package yangtzedeltasimulatorbackend.service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import yangtzedeltasimulatorbackend.dao.LabTaskDao;
import yangtzedeltasimulatorbackend.dao.TaskDao;
import yangtzedeltasimulatorbackend.entity.doo.JsonResult;
import yangtzedeltasimulatorbackend.entity.doo.support.TaskData;
import yangtzedeltasimulatorbackend.entity.dto.TaskCheckDTO;
import yangtzedeltasimulatorbackend.entity.dto.labTask.CreateLabTaskDTO;
import yangtzedeltasimulatorbackend.entity.po.LabTask;
import yangtzedeltasimulatorbackend.entity.po.Task;
import yangtzedeltasimulatorbackend.utils.ResultUtils;
import yangtzedeltasimulatorbackend.utils.Utils;

import javax.swing.text.rtf.RTFEditorKit;
import java.util.List;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/5/7
 **/
@Slf4j
@Service
public class LabTaskService {

    @Autowired
    LabTaskDao  labTaskDao;


    public JsonResult createLabTask(CreateLabTaskDTO createLabTaskDTO, String userId) {
        try {
            LabTask labTask=new LabTask();

            BeanUtils.copyProperties(createLabTaskDTO,labTask);
            labTask.setUserId(userId);
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
}