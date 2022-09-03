package yangtzedeltasimulatorbackend.controller;


import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import yangtzedeltasimulatorbackend.entity.doo.JsonResult;
import yangtzedeltasimulatorbackend.entity.po.FileChunk;
import yangtzedeltasimulatorbackend.service.FileTransferService;

import javax.servlet.http.HttpServletResponse;

/**
 * @Description
 * @Author wyjq
 * @Date 2022/03/24
 */

//@Api(tags = "大文件数据上传接口")
@RestController
@RequestMapping(value = "/fileTransfer")
@Slf4j
public class FileTransferController {

    @Autowired
    FileTransferService fileTransferService;

    @ApiOperation(value = "上传大文件" )
    @PostMapping("/upload")
    public JsonResult uploadBigFile(
            @ModelAttribute FileChunk fileChunk,
            HttpServletResponse response){
        return fileTransferService.uploadBigFile(fileChunk,response);
    }

    @ApiOperation(value = "上传乱七八糟其他未分类文件，返回文件名" )
    @PostMapping("/uploadNoClassFile")
    public JsonResult uploadNoClassFile(
            @RequestPart("file") MultipartFile upFile,
            HttpServletResponse response){
        return fileTransferService.uploadNoClassFile(upFile,response);
    }

    @ApiOperation(value = "获取乱七八糟其他未分类文件" )
    @GetMapping("/getNoClassFile/{noClassFileName}")
    public void getNoClassFile(@PathVariable("noClassFileName") String noClassFileName,HttpServletResponse response){
        fileTransferService.getNoClassFile(noClassFileName,response);
    }


//    @ApiOperation(value = "上传地图文件，若是zip包则解压" )
//    @PostMapping("/upload/mapFile")
//    public JsonResult uploadMapFile(
//        @ModelAttribute MapChunk chunk,
//        HttpServletResponse response
//    ){
//
//        String mapCLSId = chunk.getMapCLSId();
//        MetadataTable mapCLS = metadataTableService.findById(mapCLSId);
//        if (mapCLS == null){
//            response.setStatus(500);
//            return ResultUtils.error("mapItem CLS 输入错误");
//        }
//
//        return fileTransferService.uploadMapFile(chunk,response);
//    }


//    @ApiOperation(value = "上传文件，不支持上传zip包" )
//    @PostMapping("/upload/file")
//    public JsonResult uploadFile(
//        @ModelAttribute Chunk chunk,
//        HttpServletResponse response
//    ){
//        return fileTransferService.uploadFile(chunk,response);
//    }

}
