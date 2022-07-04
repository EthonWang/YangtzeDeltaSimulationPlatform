package yangtzedeltasimulatorbackend.controller;

import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import yangtzedeltasimulatorbackend.entity.doo.JsonResult;
import yangtzedeltasimulatorbackend.entity.dto.TaskCheckDTO;
import yangtzedeltasimulatorbackend.entity.dto.labTask.CreateLabTaskDTO;
import yangtzedeltasimulatorbackend.entity.po.LabTask;
import yangtzedeltasimulatorbackend.service.LabTaskService;
import yangtzedeltasimulatorbackend.service.TaskService;
import yangtzedeltasimulatorbackend.utils.ResultUtils;
import yangtzedeltasimulatorbackend.utils.TokenUtils;

import javax.servlet.http.HttpServletRequest;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/4/6
 **/

@RestController
@RequestMapping(value="/LabTask")
public class LabTaskController {

    @Autowired
    LabTaskService labTaskService;


    @ApiOperation(value = "新建实验室任务")
    @PostMapping(value = "/createLabTask")
    JsonResult createLabTask(@RequestBody CreateLabTaskDTO createLabTaskDTO, HttpServletRequest request) {
        String userId= TokenUtils.getUserId(request.getHeader("token"));
        return labTaskService.createLabTask(createLabTaskDTO,userId);
    }

    @ApiOperation(value = "获取实验室任务列表")
    @GetMapping(value = "/getLabTaskList/{userId}")
    JsonResult getLabTaskList(@PathVariable("userId") String userId ) {
        return labTaskService.getLabTaskList(userId);
    }

    @ApiOperation(value = "根据id更新实验室任务")
    @PostMapping(value = "/updateLabTask/{labTaskId}")
    JsonResult updateLabTask(@PathVariable("labTaskId") String labTaskId,
                             @RequestBody CreateLabTaskDTO createLabTaskDTO) {
        return labTaskService.updateLabTask(labTaskId,createLabTaskDTO);
    }


    @ApiOperation(value = "根据id删除实验室任务")
    @GetMapping(value = "/deleteLabTaskList/{labTaskId}")
    JsonResult deleteLabTaskList(@PathVariable("labTaskId") String labTaskId ) {
        return labTaskService.deleteLabTaskList(labTaskId);
    }

}
