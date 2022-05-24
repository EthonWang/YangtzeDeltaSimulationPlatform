package yangtzedeltasimulatorbackend.service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import yangtzedeltasimulatorbackend.dao.TaskDao;
import yangtzedeltasimulatorbackend.entity.doo.JsonResult;
import yangtzedeltasimulatorbackend.entity.po.Task;
import yangtzedeltasimulatorbackend.entity.dto.TaskCheckDTO;
import yangtzedeltasimulatorbackend.entity.doo.support.TaskData;
import yangtzedeltasimulatorbackend.utils.ResultUtils;
import yangtzedeltasimulatorbackend.utils.Utils;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/5/7
 **/
@Slf4j
@Service
public class TaskService {

    @Autowired
    TaskDao taskDao;

    @Value("${managerServerIpAndPort}")
    String managerServerIpAndPort;


    public JsonResult getTaskResult(TaskCheckDTO data) {
        JSONObject out = new JSONObject();

        JSONObject result = Utils.postJSON("http://" + managerServerIpAndPort + "/GeoModeling/computableModel/refreshTaskRecord", (JSONObject) JSONObject.toJSON(data));

        //update model status to Started, Started: 1, Finished: 2, Inited: 0, Error: -1
        Task task = taskDao.findFirstByTaskId(data.getTid());
        int state = task.getStatus();
        int remoteState = result.getJSONObject("data").getInteger("status");
        if (remoteState != state) {
            task.setStatus(remoteState);
        }
        if (remoteState == 2) {
            boolean hasValue = false;
            JSONArray outputs = result.getJSONObject("data").getJSONArray("outputs");
            for (int i = 0; i < outputs.size(); i++) {
                if (!outputs.getJSONObject(i).getString("url").equals("")) {
                    hasValue = true;
                    break;
                }
            }
            if (!hasValue) {
                task.setStatus(-1);
            }
            for (int i = 0; i < outputs.size(); i++) {
                if (outputs.getJSONObject(i).getString("url").contains("[")) {//说明是单event多输出的情况
                    outputs.getJSONObject(i).put("multiple",true);
                }
            }

            task.setOutputs(result.getJSONObject("data").getJSONArray("outputs").toJavaList(TaskData.class));

            //TODO templateMatch要不要
//            task = templateMatch(task);
        }
        taskDao.save(task);


        if (task.getStatus() == 0) {
            out.put("status", 0);
        } else if (task.getStatus() == 1) {
            out.put("status", 1);
        } else if (task.getStatus() == 2) {
            out.put("status", 2);
            out.put("outputdata", task.getOutputs());
        } else {
            out.put("status", -1);
        }

        return ResultUtils.success(out) ;
    }
}
