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
    @ApiOperation(value = "数据---创建资源中心数据")
    @PostMapping("/saveResourceData")
    public JsonResult saveResourceData(@RequestPart("info") CreateResourceDataDTO createResourceDataDTO,
                                       @ApiParam @RequestPart(value = "visualFile",required = false) MultipartFile visualFile,
                                       @RequestPart("imgFile") MultipartFile imgFile){
        return resourceService.saveResourceData(createResourceDataDTO,visualFile,imgFile);
    }

    //    @LoginRequired
    @ApiOperation(value = "数据---获取资源中心数据列表")
    @PostMapping("/getResourceDataList")
    public JsonResult getResourceDataList(@RequestBody ResourcePageDTO resourcePageDTO){
        return resourceService.getResourceDataList(resourcePageDTO);
    }

    @ApiOperation(value = "数据---获取资源中心数据列表")
    @PostMapping("/getResourceDataListByVisualChecked")
    public JsonResult getResourceDataListByVisualChecked(@RequestBody ResourcePageDTO resourcePageDTO){
        return resourceService.getResourceDataListByVisualChecked(resourcePageDTO);
    }

    @ApiOperation(value = "数据---删除资源中心数据")
    @GetMapping("/deleteResourceData/{resourceDataId}")
    public JsonResult deleteResourceData(@PathVariable("resourceDataId") String resourceDataId ){
        return resourceService.deleteResourceData(resourceDataId);
    }

    @ApiOperation(value = "数据---保存资源中心其他小数据")
    @PostMapping("/saveResourceSmallFile")
    public JsonResult saveResourceSmallFile(@RequestPart("info") CreateResourceSmallFileDTO createResourceSmallFileDTO,
                                       @RequestPart("smallFile") MultipartFile smallFile){
        return resourceService.saveResourceSmallFile(createResourceSmallFileDTO,smallFile);
    }

    @ApiOperation(value = "数据---保存资源中心条目数据")
    @PostMapping("/saveResourceItemFile")
    public JsonResult saveResourceItemFile(@RequestPart("info") CreateResourceSmallFileDTO createResourceSmallFileDTO,
                                            @RequestPart("imgFile") MultipartFile imgFile){
        return resourceService.saveResourceItemFile(createResourceSmallFileDTO,imgFile);
    }


    @ApiOperation(value = "数据---删除资源中心其他小数据")
    @GetMapping("/deleteResourceSmall/{resourceSmallFileId}")
    public JsonResult deleteResourceSmallFile(@PathVariable("resourceSmallFileId") String resourceSmallFileId ){
        return resourceService.deleteResourceSmallFile(resourceSmallFileId);
    }

    @ApiOperation(value = "模型---创建资源中心的模型条目")
    @PostMapping("/createResourceModel")
    public JsonResult createResourceModel(@RequestPart("info") CreateResourceModelDTO createResourceModelDTO,
                                          @RequestPart("imgFile") MultipartFile imgFile){
        return resourceService.createResourceModel(createResourceModelDTO,imgFile);
    }

    @ApiOperation(value = "模型---获取资源中心模型列表")
    @PostMapping("/getResourceModelList")
    public JsonResult getResourceModelList(@RequestBody ResourcePageDTO resourcePageDTO){
        return resourceService.getResourceModelList(resourcePageDTO);
    }

    @ApiOperation(value = "模型---获取资源中心模型根据id")
    @PostMapping("/getResourceModelById/{resourceModelId}")
    public JsonResult getResourceModelById(@PathVariable("resourceModelId") String resourceModelId){
        return resourceService.getResourceModelById(resourceModelId);
    }

    @ApiOperation(value = "模型---删除资源中心的模型条目")
    @GetMapping("/deleteResourceModel/{resourceModelId}")
    public JsonResult deleteResourceModel(@PathVariable("resourceModelId") String resourceModelId){
        return resourceService.deleteResourceModel(resourceModelId);
    }


//    @ApiOperation(value = "专题页上传图片")
//    @PostMapping("/uploadThemeImg")
//    public JsonResult uploadThemeImg(@RequestPart("file") MultipartFile uploadImg){
//        return themeService.uploadThemeImg(uploadImg);
//    }

    @ApiOperation(value = "实验室---保存实验室的geojson")
    @PostMapping("/saveLabGeoJsonFile")
    public JsonResult saveLabGeoJsonFile(HttpServletRequest request){
       return resourceService.saveLabGeoJsonFile(request);
    }

    @ApiOperation(value = "数据---浏览数据，pageviews加一")
    @GetMapping("/resDataView/{resDataId}")
    public JsonResult resDataView(@PathVariable("resDataId") String id){
        return resourceService.resDataView(id);
    }

    @ApiOperation(value = "数据---获取点击量前六的数据条目")
    @GetMapping("/getResByDataView")
    public JsonResult getResByDataView(){
        return resourceService.getResByDataView();
    }


}
