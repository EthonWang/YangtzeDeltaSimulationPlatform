package yangtzedeltasimulatorbackend.controller;

import com.alibaba.fastjson.JSONObject;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import yangtzedeltasimulatorbackend.entity.doo.JsonResult;
import yangtzedeltasimulatorbackend.entity.dto.model.SaveResultDataDTO;
import yangtzedeltasimulatorbackend.entity.po.ModelItem;
import yangtzedeltasimulatorbackend.entity.po.QuestionItem;
import yangtzedeltasimulatorbackend.service.ModelItemService;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/4/6
 **/

@RestController
@RequestMapping(value="/model")
public class ModelController {

    @Autowired
    ModelItemService modelItemService;


//    @ApiOperation(value = "上传模型条目，带参数id视为更新")
//    @PostMapping ("/addModelItem")
//    public JsonResult saveModelItem(@RequestBody ModelItem modelItem){
//        return modelItemService.saveModelItem(modelItem);
//    }


//    @ApiOperation(value = "上传模型数据文件，文件名重复会覆盖原有文件")
//    @PostMapping ("/addModelZipFile")
//    public JsonResult saveModelFile(@RequestPart("modelZipFile") MultipartFile modelZipFile,
//                                    @RequestParam("modelId") String modelId){
//        return modelItemService.saveModelZipFile(modelZipFile,modelId);
//    }


    //同时接受文件和json，如果前端发送不过来，则使用接受文件和json字符串的方式
//    @ApiOperation(value = "上传模型条目+文件，带参数id视为更新")
//    @PostMapping ("/addModelItem")
//    public JsonResult saveModelItem(@RequestPart("modelItemJson") ModelItem modelItem,
//                                    @RequestPart("modelZipFile") MultipartFile multipartFile){
//        return modelItemService.saveModelItem(modelItem,multipartFile);
//    }

    //备用，接受文件和json字符串的方式
//    @ApiOperation(value = "上传模型条目+文件，带参数id视为更新，备用方法")
//    @PostMapping ("/addModelItem2")
//    public JsonResult saveModelItem2(@RequestParam("modelItemJson") String modelItemJsonString,
//                                    @RequestPart("modelZipFile") MultipartFile multipartFile){
//        JSONObject jsonObject = JSONObject.parseObject(modelItemJsonString);
//        ModelItem modelItem=JSONObject.toJavaObject(jsonObject,ModelItem.class);
//        return modelItemService.saveModelItem(modelItem,multipartFile);
//    }


//    @ApiOperation(value = "上传json string")
//    @PostMapping ("/addModelJson")
//    public JsonResult saveModelJson(@RequestParam("modelItemJson") String modelItemJsonString){
//        JSONObject jsonObject = JSONObject.parseObject(modelItemJsonString);
//        ModelItem modelItem=JSONObject.toJavaObject(jsonObject,ModelItem.class);
//        return ResultUtils.success();
//    }
//
//    @ApiOperation(value = "上传文件")
//    @PostMapping ("/addModelFile")
//    public JsonResult saveModelFile(@RequestPart("modelZipFile") MultipartFile multipartFile){
//        return ResultUtils.success();
//    }


//    @ApiOperation(value = "获取模型列表")
//    @GetMapping ("/getModelItemList")
//    public JsonResult getModelItemList(){
//        return modelItemService.getModelItemList();
//    }


//    @ApiOperation(value = "问题模型数据目录树")
//    @GetMapping ("/getModelTree")
//    public JsonResult getModelTree(){
//        return modelItemService.getModelTree();
//    }


//    @ApiOperation(value = "获取模型的mdlJSON")
//    @GetMapping ("/getMdlById/{modelId}")
//    public JsonResult getMdlById(@PathVariable("modelId") String modelId ){
//        return modelItemService.getMdlJson(modelId);
//    }


//    @ApiOperation(value = "图表类可视化数据")
//    @GetMapping ("/getVisualData")
//    public JsonResult getVisualData(@RequestParam("visualDataPath") String visualDataPath){
//        return modelItemService.getVisualData(visualDataPath);
//    }
//
//
//    @ApiOperation(value = "shp的geojson数据")
//    @GetMapping ("/getShpJsonData")
//    public Object getShpJsonData(@RequestParam("shpJsonPath") String shpJsonPath){
//
//        return modelItemService.getShpJsonData(shpJsonPath);
//    }
//
//
//    @ApiOperation(value = "kmz数据")
//    @GetMapping ("/getKmzData")
//    public void getKmzData(@RequestParam("kmzDataPath") String kmzDataPath, HttpServletResponse response){
//        modelItemService.getKmzData(kmzDataPath,response);
//    }



//    @ApiOperation(value = "获取模型的测试数据集")
//    @GetMapping ("/getModelTestDataSet/{modelId}")
//    public Object getInputDataSet(@PathVariable("modelId") String modelId){
//        return modelItemService.getInputDataSet(modelId);
//    }

    @ApiOperation(value = "获取处理后模型的mdlJSON")
    @GetMapping ("/getMdlById/{modelId}")
    public JsonResult getMdlById(@PathVariable("modelId") String modelId ){
        return modelItemService.getMdlById(modelId);
    }

    @ApiOperation(value = "调用模型 lists中的oid就是computableModel的id")
    @RequestMapping(value = "/invoke", method = RequestMethod.POST)
    public JsonResult invoke(@RequestBody JSONObject lists) {
        String email="371252847@qq.com";
        return modelItemService.handleInvoke(lists, email);
    }

    @ApiOperation(value = "上传用户数据到数据容器")
    @GetMapping ("/upToDataContainer")
    public JsonResult upToDataContainer(@RequestParam("userDataId") String userDataId,
                                        @RequestParam("dataRelativePath") String dataRelativePath){
        return modelItemService.upToDataContainer(userDataId,dataRelativePath);
    }

    @ApiOperation(value = "上传资源数据到数据容器")
    @GetMapping ("/upResToDataContainer")
    public JsonResult upResToDataContainer(@RequestParam("resDataId") String resDataId,
                                           @RequestParam("taskId") String taskId,
                                           @RequestParam("userId") String userId,
                                        @RequestParam("dataRelativePath") String dataRelativePath){
        return modelItemService.upResToDataContainer(resDataId,taskId,userId,dataRelativePath);
    }

    @ApiOperation(value = "上传xml到数据容器")
    @PostMapping(value = "/upXMLToDataContainer")
    public JsonResult upXMLToDataContainer(@RequestPart("xmlData") MultipartFile  upFile) {
    public JsonResult upXMLToDataContainer(@RequestParam("xmlData") MultipartFile upFile) {
//        String email="371252847@qq.com";
        return modelItemService.upXMLToDataContainer(upFile);
    }

    @ApiOperation(value = "保存模型运行结果到个人空间和实验室")
    @PostMapping(value = "/saveModelOutput")
    public JsonResult saveModelOutput(@RequestBody SaveResultDataDTO saveResultDataDTO) {
//        String email="371252847@qq.com";
        return modelItemService.saveModelOutput(saveResultDataDTO);
    }


    //添加大类问题，就一个方法不至于新写一个controller了
//    @ApiOperation(value = "添加问题条目")
//    @PostMapping("/addQuestionItem")
//    public JsonResult addQuestionItem(@RequestBody QuestionItem questionItem){
//        return modelItemService.addQuestionItem(questionItem);
//    }


}
