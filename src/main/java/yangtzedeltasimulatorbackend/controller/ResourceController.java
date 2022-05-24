package yangtzedeltasimulatorbackend.controller;

import com.auth0.jwt.JWT;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.HttpRequestHandler;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import yangtzedeltasimulatorbackend.entity.dto.DataItemDTO;
import yangtzedeltasimulatorbackend.entity.po.DataItem;
import yangtzedeltasimulatorbackend.entity.doo.JsonResult;
import yangtzedeltasimulatorbackend.entity.po.Folder;
import yangtzedeltasimulatorbackend.service.ResourceService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/4/6
 **/

@RestController
@RequestMapping(value="/resource")
public class ResourceController {

    @Autowired
    ResourceService resourceService;

    @ApiOperation(value = "新建文件夹")
    @PostMapping ("/createFolder")
    public JsonResult createFolder(@RequestBody Folder folder){
        //        String token = request.getHeader("token");
//        String userEmail= JWT.decode(token).getAudience().get(0);
        String userEmail="opengms@126.com";
        return resourceService.createFolder(folder,userEmail);
    }

    //TODO 如果前端能够发送可以接受的数据，接收参数可以改写为一个dto
    @ApiOperation(value = "上传数据")
    @PostMapping ("/saveDataItem")
    public JsonResult saveDataItem(@RequestParam("data") MultipartFile multipartFile,
                                   @RequestParam("name") String name,
                                   @RequestParam("overview") String overview,
                                   @RequestParam("issueTags") List<String> issueTags,
                                   @RequestParam("normalTags") List<String> normalTags,
                                   @RequestParam("isPrivate") boolean isPrivate,
                                   @RequestParam("isVisualization") boolean isVisualization,
                                   @RequestParam("parentId") String parentId,
                                   HttpServletRequest request){

        DataItemDTO dataItemDTO=new DataItemDTO(multipartFile,name,overview,issueTags,normalTags,isPrivate,isVisualization,parentId);

//        String token = request.getHeader("token");
//        String userEmail= JWT.decode(token).getAudience().get(0);
        String userEmail="opengms@126.com";
        return resourceService.saveDataItem(dataItemDTO,userEmail);
    }

    @ApiOperation(value = "获取用户的文件夹数据")
    @PostMapping ("/getUserResource")
    public JsonResult getUserResource(@RequestParam("parentId") String parentId){
//        String token = request.getHeader("token");
//        String userEmail= JWT.decode(token).getAudience().get(0);
        String userEmail="opengms@126.com";

        return resourceService.getUserResource(parentId,userEmail);
    }


    @ApiOperation(value = "删除文件夹，或有数据级联删除")
    @PostMapping ("/deleteFolder")
    public JsonResult deleteFolder(@RequestParam("folderId") String folderId){
//        String token = request.getHeader("token");
//        String userEmail= JWT.decode(token).getAudience().get(0);
        String userEmail="opengms@126.com";

        return resourceService.deleteFolder(folderId,userEmail);
    }


    @ApiOperation(value = "删除数据")
    @PostMapping ("/deleteDataItem")
    public JsonResult deleteDataItem(@RequestParam("dataItemId") String dataItemId){
        return resourceService.deleteDataItem(dataItemId);
    }


    @ApiOperation(value = "下载数据")
    @GetMapping ("/downloadDataItem/{dataItemId}")
    public void downloadDataItem(@PathVariable("dataItemId") String dataItemId,HttpServletResponse response){
        resourceService.downloadDataItem(dataItemId,response);
    }

}
