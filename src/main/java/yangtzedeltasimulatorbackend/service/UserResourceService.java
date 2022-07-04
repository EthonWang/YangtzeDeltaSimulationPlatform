package yangtzedeltasimulatorbackend.service;

import ch.qos.logback.classic.Logger;
import cn.hutool.core.io.FileTypeUtil;
import cn.hutool.core.io.FileUtil;
import cn.hutool.core.io.file.FileNameUtil;
import cn.hutool.core.util.IdUtil;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import yangtzedeltasimulatorbackend.dao.*;
import yangtzedeltasimulatorbackend.entity.dto.DataItemDTO;
import yangtzedeltasimulatorbackend.entity.dto.UpdateDataItem;
import yangtzedeltasimulatorbackend.entity.dto.user.CreateFolderDTO;
import yangtzedeltasimulatorbackend.entity.po.*;
import yangtzedeltasimulatorbackend.entity.doo.JsonResult;
import yangtzedeltasimulatorbackend.utils.MyFileUtils;
import yangtzedeltasimulatorbackend.utils.ResultUtils;

import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/4/18
 **/
@Slf4j
@Service
public class UserResourceService {

    @Autowired
    DataItemDao dataItemDao;

    @Autowired
    FolderDao folderDao;

    @Autowired
    ResourceDataDao resourceDataDao;

    @Autowired
    ThemeDao themeDao;

    @Autowired
    ModelItemDao  modelItemDao;


    @Value("${dataStoreDir}"+"/data")
    private  String dataFolder;

    public JsonResult saveDataItem(MultipartFile upFile,DataItemDTO dataItemDTO,String userId) {

        try{
//            MultipartFile upFile=dataItemDTO.getMultipartFile();
            if (upFile.isEmpty()) {
                return ResultUtils.error("file is empty!!!");
            }

            DataItem dataItem=new DataItem();
//            BeanUtils.copyProperties(dataItemDTO,dataItem,"multipartFile");
            BeanUtils.copyProperties(dataItemDTO,dataItem);


            File folder = new File(dataFolder);
            if (!folder.isDirectory()) {
                folder.mkdirs();
            }

            //将文件保存到指定位置
            String fileName = upFile.getOriginalFilename(); //eg: XXX.js
            String fileMainName= FileNameUtil.mainName(fileName); // XXX
            String fileExtName = FileNameUtil.extName(fileName); //js
            String fileNewName=fileMainName+IdUtil.objectId()+"."+fileExtName;
            File saveFile = new File(folder, fileNewName);//eg: E:\\TEMP\\XXX1231231.js

            upFile.transferTo(saveFile);

            dataItem.setUserId(userId);
            dataItem.setFileRelativePath("/data/"+fileNewName);
            dataItem.setFileWebAddress("/store/data/"+fileNewName);
            dataItem.setFileStoreName(fileNewName);
//            dataItem.setType(FileTypeUtil.getType(saveFile));
            dataItem.setType("file");
            dataItem.setSize(String.format("%.3f",saveFile.length() / 1048576.0) + " MB");


            dataItemDao.save(dataItem);
            return ResultUtils.success("上传文件成功");
        }catch (Exception e){
            log.error(e.getMessage());
            return ResultUtils.error("上传文件失败");
        }

    }

    public JsonResult getDataItemList() {
        return ResultUtils.success();
    }

    public JsonResult createFolder(CreateFolderDTO createFolderDTO, String userId) {
        try{
            Folder folder=new Folder();
            BeanUtils.copyProperties(createFolderDTO,folder);

            folder.setUserId(userId);
//            folder.setType("folder");
            folderDao.save(folder);
            return ResultUtils.success("创建文件夹成功");
        }catch (Exception e){
            log.error(e.getMessage());
            return ResultUtils.error("创建文件夹失败");
        }
    }

    public JsonResult getUserResource(String parentId) {
        try{

            JSONArray jsonArray=new JSONArray();

            //第一级目录的parentId是用户的id
//            List<Folder> folders = folderDao.findAllByUserEmailAndParentId(userEmail, parentId);
            List<Folder> folders = folderDao.findAllByParentId(parentId);
            for(int i=0;i<folders.size();i++){
                jsonArray.add(folders.get(i));
            }

//            List<DataItem> dataItems=dataItemDao.findAllByUserEmailAndParentId(userEmail,parentId);
            List<DataItem> dataItems = dataItemDao.findAllByParentId(parentId);
            for(int i=0;i<dataItems.size();i++){
                jsonArray.add(dataItems.get(i));
            }

            return ResultUtils.success(jsonArray);
        }catch (Exception e){
            log.error(e.getMessage());
            return ResultUtils.error("查询用户文件资源失败");
        }
    }

    public JsonResult deleteFolder(String folderId) {
        try{
            if(deleteFolderCascade(folderId)){
                return ResultUtils.success("删除文件夹成功");
            }else {
                return ResultUtils.error("删除文件夹失败");
            }
        }catch (Exception e){
            log.error(e.getMessage());
            return ResultUtils.error("删除文件夹失败");
        }
    }

    //递归
    public boolean deleteFolderCascade(String folderId) {
        try {
            folderDao.deleteById(folderId);
            dataItemDao.deleteAllByParentId(folderId);
            List<Folder> childFolders = folderDao.findAllByParentId(folderId);
            for (int i = 0; i < childFolders.size(); i++) {
                return deleteFolderCascade(childFolders.get(i).getId());
            }
            return true;
        }catch (Exception e){
            log.error(e.getMessage());
            return false;
        }
    }

    //循环
    public boolean deleteFolderCascade2(String folderId) {
        try {
            JSONArray deleteFolders=new JSONArray();
            deleteFolders.add(folderId);
            for(int i=0;i<deleteFolders.size();i++){
                folderDao.deleteById(deleteFolders.getString(i));
                dataItemDao.deleteAllByParentId(deleteFolders.getString(i));
                List<Folder> childFolders = folderDao.findAllByParentId(deleteFolders.getString(i));
                deleteFolders.addAll(childFolders);
            }
            return true;
        }catch (Exception e){
            log.error(e.getMessage());
            return false;
        }
    }

    public JsonResult deleteDataItem(String dataItemId) {
        try{
            Optional<DataItem> dataItemDB=dataItemDao.findById(dataItemId);
            DataItem dataItem=dataItemDB.get();

            File file=new File(dataFolder,dataItem.getFileStoreName());
            if(file.exists()){
                file.delete();
            }

            dataItemDao.deleteById(dataItemId);

            return ResultUtils.success("删除数据成功");
        }catch (Exception e){
            log.error(e.getMessage());
            return ResultUtils.error("删除数据失败");
        }
    }

    public void downloadDataItem(String dataItemId, HttpServletResponse response) {
        try{
            DataItem dataItem=dataItemDao.findById(dataItemId).get();
            File file=new File(dataFolder,dataItem.getFileStoreName());
            MyFileUtils.downloadFile(file,response);

        }catch (Exception e){
            log.error(e.getMessage());
        }
    }

    public JsonResult updateDataItem(UpdateDataItem updateDataItem) {
        try {
            DataItem dataItem=dataItemDao.findById(updateDataItem.getId()).get();
            BeanUtils.copyProperties(updateDataItem,dataItem);
            dataItemDao.save(dataItem);

            return ResultUtils.success("更新数据成功");
        }catch (Exception e){
            log.error(e.getMessage());
            return ResultUtils.error("更新数据项失败"+e.getMessage());
        }
    }

    public JsonResult getUserAllResource(String userId) {
        try {
            JSONObject o=new JSONObject();

//            JSONArray personalDataArray=new JSONArray();
            List<DataItem> personalDataList = dataItemDao.findAllByUserId(userId);
//            for(int i=0;i<dataItems.size();i++){
//                personalDataArray.add(dataItems.get(i));
//            }
            o.put("personalData",personalDataList);

            List<ResourceData> publicDataList = resourceDataDao.findAll();
            o.put("publicData",publicDataList);

            List<Theme> themeList=themeDao.findAll();
            o.put("themeList",themeList);

            List<ModelItem> modelItemList=modelItemDao.findAll();
            o.put("modelList",modelItemList);

            return ResultUtils.success(o);

        }catch (Exception e){
            log.error(e.getMessage());
            return ResultUtils.error("查询失败"+e.getMessage());
        }
    }
}
