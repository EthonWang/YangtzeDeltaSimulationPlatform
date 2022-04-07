package yangtzedeltasimulatorbackend.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import yangtzedeltasimulatorbackend.entity.JsonResult;
import yangtzedeltasimulatorbackend.entity.ModelItem;
import yangtzedeltasimulatorbackend.service.ModelItemService;
import yangtzedeltasimulatorbackend.utils.ResultUtils;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/4/6
 **/

@RestController
@RequestMapping(value="/modelItem")
public class ModelItemController {

    @Autowired
    ModelItemService modelItemService;

    @ApiOperation(value = "上传模型")
    @PostMapping ("/saveModelItem")
    public JsonResult saveModelItem(@RequestBody ModelItem modelItem){
        return modelItemService.saveModelItem(modelItem);
    }


    @ApiOperation(value = "获取模型列表")
    @PostMapping ("/getModelItemList")
    public JsonResult getModelItemList(){
        return modelItemService.getModelItemList();
    }

}
