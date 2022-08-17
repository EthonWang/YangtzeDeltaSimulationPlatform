package yangtzedeltasimulatorbackend.controller;

import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import yangtzedeltasimulatorbackend.component.LoginRequired;
import yangtzedeltasimulatorbackend.entity.dto.user.DataItemDTO;
import yangtzedeltasimulatorbackend.entity.dto.user.UpdateUserDataItemDTO;
import yangtzedeltasimulatorbackend.entity.doo.JsonResult;
import yangtzedeltasimulatorbackend.entity.dto.user.CreateFolderDTO;
import yangtzedeltasimulatorbackend.entity.dto.user.UpdateFolderDTO;
import yangtzedeltasimulatorbackend.service.UserResourceService;
import yangtzedeltasimulatorbackend.utils.TokenUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/4/6
 **/

@RestController
@RequestMapping(value = "/resource")
public class UserResourceController {

    @Autowired
    UserResourceService userResourceService;



    @LoginRequired
    @ApiOperation(value = "新建文件夹")
    @PostMapping("/createFolder")
    public JsonResult createFolder(@RequestBody CreateFolderDTO createFolderDTO,HttpServletRequest request) {

        String userId= TokenUtils.getUserId(request.getHeader("token"));

        return userResourceService.createFolder(createFolderDTO, userId);
    }

    @LoginRequired
    @ApiOperation(value = "上传数据")
    @PostMapping("/saveDataItem")
    public JsonResult saveDataItem(@RequestParam("file") MultipartFile multipartFile,
                                   @RequestParam("name") String name,
                                   @RequestParam("description") String description,
                                   @RequestParam("parentId") String parentId,
                                   @RequestParam("publicBoolean") boolean publicBoolean,
                                   @RequestParam("problemTags") String  problemTags,
                                   HttpServletRequest request) {

        DataItemDTO dataItemDTO = new DataItemDTO(name, description,parentId,publicBoolean,problemTags);

        String userId= TokenUtils.getUserId(request.getHeader("token"));

        return userResourceService.saveDataItem(multipartFile, dataItemDTO, userId);
    }

    @LoginRequired
    @ApiOperation(value = "更新用户个人中心数据描述信息（不包括文件夹）")
    @PostMapping("/updateUserDataItem")
    public JsonResult updateUserDataItem(@RequestBody UpdateUserDataItemDTO updateUserDataItemDTO) {
        return userResourceService.updateUserDataItem(updateUserDataItemDTO);
    }

    @LoginRequired
    @ApiOperation(value = "更新用户文件夹描述信息")
    @PostMapping("/updateUserFolder")
    public JsonResult updateUserFolder(@RequestBody UpdateFolderDTO updateFolderDTO) {
        return userResourceService.updateUserFolder(updateFolderDTO);
    }

//    @ApiOperation(value = "上传数据")
//    @PostMapping("/saveDataItem2")
//    public JsonResult saveDataItem2(@RequestPart("data") MultipartFile multipartFile, @RequestPart("dataInfo") DataItemDTO dataItemDTO) {
//
////        DataItemDTO dataItemDTO=new DataItemDTO(multipartFile,name,overview,issueTags,normalTags,isPrivate,isVisualization,parentId);
//
////        String token = request.getHeader("token");
////        String userEmail= JWT.decode(token).getAudience().get(0);
//        String userEmail = "opengms@126.com";
////        DataItemDTO dataItemDTO=new DataItemDTO();
//        return resourceService.saveDataItem(multipartFile, dataItemDTO, userEmail);
//    }

    @LoginRequired
    @ApiOperation(value = "获取用户某一层级的文件夹和文件数据")
    @PostMapping("/getUserResource")
    public JsonResult getUserResource(@RequestParam("parentId") String parentId) {
//        String token = request.getHeader("token");
//        String userEmail= JWT.decode(token).getAudience().get(0);
        String userEmail = "opengms@126.com";

        return userResourceService.getUserResource(parentId);
    }

    @ApiOperation(value = "获取用户全部数据")
    @PostMapping(value = "/getUserAllResource")
    public JsonResult getUserInfo(@RequestParam("userId") String userId){
        return userResourceService.getUserAllResource(userId);
    }



    @LoginRequired
    @ApiOperation(value = "删除文件夹，或有数据级联删除")
    @PostMapping("/deleteFolder")
    public JsonResult deleteFolder(@RequestParam("folderId") String folderId) {
        return userResourceService.deleteFolder(folderId);
    }

    @LoginRequired
    @ApiOperation(value = "删除数据")
    @PostMapping("/deleteDataItem")
    public JsonResult deleteDataItem(@RequestParam("dataItemId") String dataItemId) {
        return userResourceService.deleteDataItem(dataItemId);
    }


    @ApiOperation(value = "下载数据")
    @GetMapping("/downloadDataItem/{dataItemId}")
    public void downloadDataItem(@PathVariable("dataItemId") String dataItemId, HttpServletResponse response) {
        userResourceService.downloadDataItem(dataItemId, response);
    }

}
