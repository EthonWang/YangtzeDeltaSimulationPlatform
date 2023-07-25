package yangtzedeltasimulatorbackend.controller;

import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import yangtzedeltasimulatorbackend.entity.doo.JsonResult;
import yangtzedeltasimulatorbackend.entity.dto.TaskCheckDTO;
import yangtzedeltasimulatorbackend.service.TaskService;
import yangtzedeltasimulatorbackend.utils.ResultUtils;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/4/6
 **/
@CrossOrigin
@RestController
@RequestMapping(value="/task")
public class TaskController {

    @Autowired
    TaskService taskService;

    @ApiOperation(value = "查询模型执行状态")
    @PostMapping(value = "/taskResult")
    JsonResult getResult(@RequestBody TaskCheckDTO data) {

        JsonResult out=taskService.getTaskResult(data);
        return ResultUtils.success(out);

    }

}
