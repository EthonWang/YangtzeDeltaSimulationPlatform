package yangtzedeltasimulatorbackend.controller;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import yangtzedeltasimulatorbackend.entity.doo.JsonResult;
import yangtzedeltasimulatorbackend.entity.dto.PageDTO;
import yangtzedeltasimulatorbackend.entity.dto.resource.CreateResourceDataDTO;
import yangtzedeltasimulatorbackend.entity.dto.resource.CreateResourceSmallFileDTO;
import yangtzedeltasimulatorbackend.entity.dto.resource.ResourceDataPageDTO;
import yangtzedeltasimulatorbackend.service.ResourceService;
import yangtzedeltasimulatorbackend.utils.ResultUtils;

import javax.servlet.http.HttpServletRequest;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/4/6
 **/
@RestController
public class ResourceController {

    @Autowired
    ResourceService resourceService;

//    @LoginRequired
    @ApiOperation(value = "保存资源中心数据")
    @PostMapping("/saveResourceData")
    public JsonResult saveResourceData(@RequestPart("info") CreateResourceDataDTO createResourceDataDTO,
                                       @ApiParam @RequestPart(value = "visualFile",required = false) MultipartFile visualFile,
                                       @RequestPart("imgFile") MultipartFile imgFile){
        return resourceService.saveResourceData(createResourceDataDTO,visualFile,imgFile);
    }

    //    @LoginRequired
    @ApiOperation(value = "获取资源中心列表")
    @PostMapping("/getResourceDataList")
    public JsonResult getResourceDataList(@RequestBody ResourceDataPageDTO resourceDataPageDTO){
        return resourceService.getResourceDataList(resourceDataPageDTO);
    }

    @ApiOperation(value = "删除资源中心数据")
    @GetMapping("/deleteResourceData/{resourceDataId}")
    public JsonResult deleteResourceData(@PathVariable("resourceDataId") String resourceDataId ){
        return resourceService.deleteResourceData(resourceDataId);
    }

    @ApiOperation(value = "保存资源中心其他小数据")
    @PostMapping("/saveResourceSmallFile")
    public JsonResult saveResourceSmallFile(@RequestPart("info") CreateResourceSmallFileDTO createResourceSmallFileDTO,
                                       @RequestPart("smallFile") MultipartFile smallFile){
        return resourceService.saveResourceSmallFile(createResourceSmallFileDTO,smallFile);
    }


    @ApiOperation(value = "删除资源中心其他小数据")
    @GetMapping("/deleteResourceSmall/{resourceSmallFileId}")
    public JsonResult deleteResourceSmallFile(@PathVariable("resourceSmallFileId") String resourceSmallFileId ){
        return resourceService.deleteResourceSmallFile(resourceSmallFileId);
    }

//    @ApiOperation(value = "专题页上传图片")
//    @PostMapping("/uploadThemeImg")
//    public JsonResult uploadThemeImg(@RequestPart("file") MultipartFile uploadImg){
//        return themeService.uploadThemeImg(uploadImg);
//    }


}
