package yangtzedeltasimulatorbackend.service;

import cn.hutool.core.io.FileUtil;
import cn.hutool.core.io.file.FileNameUtil;
import cn.hutool.core.util.IdUtil;
import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.apache.tomcat.jni.FileInfo;
import org.apache.tomcat.util.http.fileupload.FileUtils;
import org.springframework.beans.factory.BeanNameAware;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import yangtzedeltasimulatorbackend.dao.BigFileInfoDao;
import yangtzedeltasimulatorbackend.entity.doo.JsonResult;
import yangtzedeltasimulatorbackend.entity.dto.dashboard.SortDTO;
import yangtzedeltasimulatorbackend.entity.po.BigFileInfo;
import yangtzedeltasimulatorbackend.entity.po.FileChunk;
import yangtzedeltasimulatorbackend.utils.IFileUtils;
import yangtzedeltasimulatorbackend.utils.MyFileUtils;
import yangtzedeltasimulatorbackend.utils.ResultUtils;

import javax.servlet.http.HttpServletResponse;
import javax.swing.*;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.RandomAccessFile;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * @Description
 * @Author bin
 * @Date 2022/03/24
 */
@Service
@Slf4j
public class FileTransferService {

    @Value("${bigFileUploadDir}")
    private String bigFileUploadDir;

    @Value("${dataStoreDir}"+"/noClassFile")
    private String noClassFileDir;

    @Value("${dataStoreDir}")
    private String dataStoreDir;

    @Autowired
    BigFileInfoDao bigFileInfoDao;

//    IGenericService genericService;

    public JsonResult uploadBigFile(FileChunk fileChunk, HttpServletResponse response) {

        /**
         * 每一个上传块都会包含如下分块信息：
         * chunkNumber: 当前块的次序，第一个块是 1，注意不是从 0 开始的。
         * totalChunks: 文件被分成块的总数。
         * chunkSize: 分块大小，根据 totalSize 和这个值你就可以计算出总共的块数。注意最后一块的大小可能会比这个要大。
         * currentChunkSize: 当前块的大小，实际大小。
         * totalSize: 文件总大小。
         * identifier: 这个就是每个文件的唯一标示。
         * filename: 文件名。
         * relativePath: 文件夹上传的时候文件的相对路径属性。
         * 一个分块可以被上传多次，当然这肯定不是标准行为，但是在实际上传过程中是可能发生这种事情的，这种重传也是本库的特性之一。
         *
         * 根据响应码认为成功或失败的：
         * 200 文件上传完成
         * 201 文加快上传成功
         * 500 第一块上传失败，取消整个文件上传
         * 507 服务器出错自动重试该文件块上传
         */


        // 判断文件类型
        String fileName = fileChunk.getFilename(); //aaa.txt
        String fileMainName=fileName.substring(0,fileName.lastIndexOf('.'));//aaa
        String fileExtName=fileName.substring(fileName.lastIndexOf('.')+1,fileName.length());//txt

//        String storeName=UUID.randomUUID()+"."+fileExtName;
//        String newFileName=storeName;  //uuid当文件名存了

        File file= new File(bigFileUploadDir,fileName);

        //第一个块,则新建文件
        if(fileChunk.getChunkNumber()==1 && !file.exists()){
            boolean b = MyFileUtils.mkFile(file);
            if (!b){
                response.setStatus(500);
                return ResultUtils.error("exception:createFileException");
            }
        }

        //进行写文件操作
        InputStream is = null;
        RandomAccessFile raf = null;
        try{
            //将块文件写入文件中
            is = fileChunk.getFile().getInputStream();
            raf =new RandomAccessFile(file,"rw");
            int len = -1;
            byte[] buffer=new byte[1024];
            raf.seek((fileChunk.getChunkNumber()-1) * fileChunk.getChunkSize());
            while((len = is.read(buffer)) != -1){
                raf.write(buffer,0,len);
            }
        } catch (IOException e) {
            e.printStackTrace();
            if(fileChunk.getChunkNumber()==1) {
                file.delete();
            }
            response.setStatus(507);
            return ResultUtils.error("exception:writeFileException");
        } finally {
            // 注意要把流给关了，不然后面的文件删不掉
            try {
                if (raf != null) {
                    raf.close();
                }
                if (is != null) {
                    is.close();
                }
            }catch (IOException e) {
                log.error("InputStream close error");
            }
        }

        if(fileChunk.getChunkNumber().equals(fileChunk.getTotalChunks())){
            response.setStatus(200);

//            BigFileInfo bigFileInfo=new BigFileInfo();
//            bigFileInfo.setOriginName(fileName);
//            bigFileInfo.setStoreName(storeName);
//
//
//            String requestPath=staticFilePattern+"/"+

            String storeName=UUID.randomUUID().toString(); //没有后缀
//            File bigfile=new File()
            FileUtil.rename(file,storeName,true,true);

            JSONObject o=new JSONObject();
            o.put("fileOriginName",fileMainName);
            o.put("fileStoreName",storeName+"."+fileExtName);
            o.put("fileSize",fileChunk.getTotalSize());

            return ResultUtils.success(o);
        }else {
            response.setStatus(201);
            return ResultUtils.error("upload part success");
        }
    }

    public JsonResult uploadNoClassFile(MultipartFile upFile, HttpServletResponse response) {
        try{
            if(upFile.isEmpty()){
                return ResultUtils.error("文件为空");
            }

            String fileName = upFile.getOriginalFilename(); //eg: XXX.js
            String fileMainName= FileNameUtil.mainName(fileName); // XXX
            String fileExtName = FileNameUtil.extName(fileName); //js
            String fileNewName=IdUtil.objectId()+"."+fileExtName;
            File saveFile = new File(noClassFileDir, fileNewName);//eg: E:\\TEMP\\XXX1231231.js
            upFile.transferTo(saveFile);

            JSONObject o=new JSONObject();
            o.put("noClassFileName",fileNewName);
            return ResultUtils.success(o);
        }catch (Exception e){
            log.error(e.getMessage());
            return  ResultUtils.error("上传文件失败");
        }

    }

    public void getNoClassFile(String noClassFileName, HttpServletResponse response) {
        try {
            File file=new File(noClassFileDir,noClassFileName);
            MyFileUtils.downloadFile(file,response);
        }catch (Exception e){
            log.error(e.getMessage());
        }
    }


//    public JsonResult uploadFile(Chunk chunk, HttpServletResponse response) {
//
//        // 判断文件类型
//        String fileName = chunk.getFilename();
//        String[] split = fileName.split("\\.");
//        String fileType = split[split.length - 1];
//
//        if(fileType.equals("zip") || fileType.equals("rar")){
//            response.setStatus(500);
//            return ResultUtils.error("不能上传压缩包");
//        }
//
//
//        String uploadPath = resourcePath + mapItemDir + "/uploadFile";
//        String localFileName = System.currentTimeMillis() + "_" + fileName;
//        File file= new File(uploadPath + "/" + localFileName);
//        //第一个块,则新建文件
//        if(chunk.getChunkNumber()==1 && !file.exists()){
//
//            boolean b = FileUtils.mkFile(file);
//            if (!b){
//                response.setStatus(500);
//                return ResultUtils.error("exception:createFileException");
//            }
//        }
//
//        //进行写文件操作
//        InputStream is = null;
//        RandomAccessFile raf = null;
//        try{
//            //将块文件写入文件中
//            is = chunk.getFile().getInputStream();
//            raf =new RandomAccessFile(file,"rw");
//            int len = -1;
//            byte[] buffer=new byte[1024];
//            raf.seek((chunk.getChunkNumber()-1) * chunk.getChunkSize());
//            while((len = is.read(buffer)) != -1){
//                raf.write(buffer,0,len);
//            }
//        } catch (IOException e) {
//            e.printStackTrace();
//            if(chunk.getChunkNumber()==1) {
//                file.delete();
//            }
//            response.setStatus(507);
//            return ResultUtils.error("exception:writeFileException");
//        } finally {
//            // 注意要把流给关了，不然后面的文件删不掉
//            try {
//                if (raf != null) {
//                    raf.close();
//                }
//                if (is != null) {
//
//                    is.close();
//                }
//            }catch (IOException e) {
//                log.error("InputStream close error");
//            }
//        }
//        if(chunk.getChunkNumber().equals(chunk.getTotalChunks())){
//            response.setStatus(200);
//
//            // 向数据库中保存上传信息
//            FileInfo fileInfo = initFileInfo(localFileName, file.getAbsolutePath());
//
//            return ResultUtils.success(fileInfo);
//        }else {
//            response.setStatus(201);
//            return ResultUtils.success("upload part success");
//        }
//    }


    /**
     * 文件信息入库
     * @param fileName 文件名
     * @param filePath 文件路径(相对于resourcePath的路径)
     * @return com.example.maparchivebackend.entity.po.FileInfo
     * @Author bin
     **/
//    private FileInfo initFileInfo(String fileName, String filePath){
//        FileInfo fileInfo = new FileInfo();
//        fileInfo.setFileName(fileName);
//        String[] split = fileName.split("\\.");
//        fileInfo.setType(split[split.length - 1]);
//        fileInfo.setPath(filePath.replace("\\", "/"));
//        return fileInfoDao.insert(fileInfo);
//    }
}
