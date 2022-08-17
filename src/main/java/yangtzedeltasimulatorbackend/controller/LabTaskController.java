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
    JsonResult createLabTask(@RequestBody CreateLabTaskDTO createLabTaskDTO) {
//        String userId= TokenUtils.getUserId(request.getHeader("token"));
        return labTaskService.createLabTask(createLabTaskDTO);
    }

    @ApiOperation(value = "根据实验室id，获取任务列表")
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


    @ApiOperation(value = "修改文本文件内容")
    @PostMapping("/updateLabTxtFile")
    public JsonResult updateLabTxtFile(HttpServletRequest request){
        return labTaskService.updateLabTxtFile(request);
    }


    @ApiOperation(value = "在案例中打开实验室，返回新实验室id")
    @GetMapping(value = "/openLabTaskByCase/{userId}/{caseName}")
    JsonResult getLabTaskByCase(@PathVariable("userId") String userId,
                                @PathVariable("caseName") String caseName ) {
        return labTaskService.getLabTaskByCase(userId,caseName);
    }


}
