package yangtzedeltasimulatorbackend.controller;

import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import yangtzedeltasimulatorbackend.component.LoginRequired;
import yangtzedeltasimulatorbackend.entity.doo.JsonResult;
import yangtzedeltasimulatorbackend.entity.dto.script.GDALClipDTO;
import yangtzedeltasimulatorbackend.entity.dto.script.TxtAnalysisDTO;
import yangtzedeltasimulatorbackend.entity.po.UserData;
import yangtzedeltasimulatorbackend.service.ScriptExecService;
import yangtzedeltasimulatorbackend.utils.MyFileUtils;

import javax.servlet.http.HttpServletResponse;
import java.io.File;

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
    @PostMapping("/gdalClip/{labTaskId}/{userId}")
    public JsonResult gdalClip(@RequestBody GDALClipDTO gdalClipDTO,  @PathVariable String labTaskId,  @PathVariable String userId){
        if (!gdalClipDTO.getInputRasterPath().equals("")){
            return  scriptExecService.gdalClip(gdalClipDTO,labTaskId, userId);
        } else {
            return  scriptExecService.gdalClipDataSet(gdalClipDTO,labTaskId, userId);
        }
    }

    @ApiOperation(value = "txt_analysis")
    @PostMapping("/txtAnalysis/{labTaskId}")
    public JsonResult txtAnalysis(@RequestBody TxtAnalysisDTO txtAnalysisDTO, @PathVariable String labTaskId){
        return  scriptExecService.txtAnalysis(txtAnalysisDTO,labTaskId);
    }
    
    @ApiOperation(value = "下载数据")
    @GetMapping("/downloadPic/{path}")
    public void downloadDataItem(@PathVariable("path") String path, HttpServletResponse response) {
        scriptExecService.downloadPic(path, response);
    }

}
