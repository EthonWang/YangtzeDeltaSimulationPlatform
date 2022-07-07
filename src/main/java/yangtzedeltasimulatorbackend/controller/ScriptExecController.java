package yangtzedeltasimulatorbackend.controller;

import com.alibaba.fastjson.JSONObject;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import yangtzedeltasimulatorbackend.entity.doo.JsonResult;
import yangtzedeltasimulatorbackend.entity.dto.dashboard.SortDTO;
import yangtzedeltasimulatorbackend.entity.dto.script.GDALClipDTO;
import yangtzedeltasimulatorbackend.service.ScriptExecService;
import yangtzedeltasimulatorbackend.utils.ResultUtils;

import javax.servlet.http.HttpServletResponse;
import java.util.Map;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/6/28
 **/

@RestController
@RequestMapping(value="/script")
public class ScriptExecController {

    @Autowired
    ScriptExecService scriptExecService;

    @ApiOperation(value = "脚本执行测试,返回测试结果txt文件")
    @PostMapping("/execTest")
    public void execTest(HttpServletResponse response){
         scriptExecService.execTest(response);
    }

    @ApiOperation(value = "GDAL_clip")
    @PostMapping("/gdalClip/{labTaskId}")
    public JsonResult gdalClip(@RequestBody GDALClipDTO gdalClipDTO,  @PathVariable String labTaskId){
        return  scriptExecService.gdalClip(gdalClipDTO,labTaskId);
    }

}
