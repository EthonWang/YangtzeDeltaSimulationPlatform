package yangtzedeltasimulatorbackend.controller;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import yangtzedeltasimulatorbackend.entity.doo.JsonResult;
import yangtzedeltasimulatorbackend.entity.dto.resource.CreateResourceDataDTO;
import yangtzedeltasimulatorbackend.entity.dto.resource.CreateResourceModelDTO;
import yangtzedeltasimulatorbackend.entity.dto.resource.CreateResourceSmallFileDTO;
import yangtzedeltasimulatorbackend.entity.dto.resource.ResourcePageDTO;
import yangtzedeltasimulatorbackend.service.ResourceService;

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
    @ApiOperation(value = "获取资源中心数据列表")
    @PostMapping("/getResourceDataList")
    public JsonResult getResourceDataList(@RequestBody ResourcePageDTO resourcePageDTO){
        return resourceService.getResourceDataList(resourcePageDTO);
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

    @ApiOperation(value = "创建资源中心的模型条目")
    @PostMapping("/createResourceModel")
    public JsonResult createResourceModel(@RequestBody CreateResourceModelDTO createResourceModelDTO){
        return resourceService.createResourceModel(createResourceModelDTO);
    }

    @ApiOperation(value = "获取资源中心模型列表")
    @PostMapping("/getResourceModelList")
    public JsonResult getResourceModelList(@RequestBody ResourcePageDTO resourcePageDTO){
        return resourceService.getResourceModelList(resourcePageDTO);
    }

    @ApiOperation(value = "删除资源中心的模型条目")
    @GetMapping("/deleteResourceModel/{resourceModelId}")
    public JsonResult deleteResourceModel(@PathVariable("resourceModelId") String resourceModelId){
        return resourceService.deleteResourceModel(resourceModelId);
    }


//    @ApiOperation(value = "专题页上传图片")
//    @PostMapping("/uploadThemeImg")
//    public JsonResult uploadThemeImg(@RequestPart("file") MultipartFile uploadImg){
//        return themeService.uploadThemeImg(uploadImg);
//    }

    @ApiOperation(value = "保存资源中心其他小数据")
    @PostMapping("/saveLabGeoJsonFile")
    public JsonResult saveLabGeoJsonFile(HttpServletRequest request){
       return resourceService.saveLabGeoJsonFile(request);
    }

}
