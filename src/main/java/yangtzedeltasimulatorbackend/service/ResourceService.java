package yangtzedeltasimulatorbackend.service;

import cn.hutool.core.io.FileUtil;
import cn.hutool.core.io.file.FileNameUtil;
import cn.hutool.core.util.IdUtil;
import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import yangtzedeltasimulatorbackend.dao.ResourceDataDao;
import yangtzedeltasimulatorbackend.dao.ResourceModelDao;
import yangtzedeltasimulatorbackend.dao.ResourceSmallFileDao;
import yangtzedeltasimulatorbackend.entity.doo.JsonResult;
import yangtzedeltasimulatorbackend.entity.dto.resource.CreateResourceDataDTO;
import yangtzedeltasimulatorbackend.entity.dto.resource.CreateResourceModelDTO;
import yangtzedeltasimulatorbackend.entity.dto.resource.CreateResourceSmallFileDTO;
import yangtzedeltasimulatorbackend.entity.dto.resource.ResourcePageDTO;
import yangtzedeltasimulatorbackend.entity.po.*;
import yangtzedeltasimulatorbackend.utils.FileUtils;
import yangtzedeltasimulatorbackend.utils.GeoServerUtils;
import yangtzedeltasimulatorbackend.utils.ResultUtils;

import java.io.File;
import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.List;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/4/18
 **/
@Slf4j
@Service
public class ResourceService {

    @Value("${dataStoreDir}"+"/resourceData")
    private  String resourceDataFolder;

    @Value("${dataStoreDir}")
    private  String dataStoreDir;

    @Value("${bigFileUploadDir}")
    String bigFileUploadDir;

    @Value("${geoserverUrl}")
    String geoserverUrl;

    @Autowired
    ResourceDataDao resourceDataDao;

    @Autowired
    ResourceSmallFileDao resourceSmallFileDao ;

    @Autowired
    CommonService commonService;

    @Autowired
    ResourceModelDao resourceModelDao;

    public JsonResult saveResourceData(CreateResourceDataDTO createResourceDataDTO, MultipartFile visualFile, MultipartFile imgFile) {
        try{
            File folder = new File(resourceDataFolder);
            if (!folder.isDirectory()) {
                folder.mkdirs();
            }

            ResourceData resourceData= new ResourceData();
            BeanUtils.copyProperties(createResourceDataDTO,resourceData);

            //大文件
            String srcFilePath=bigFileUploadDir+"/"+createResourceDataDTO.getFileStoreName();
            FileUtil.copy(srcFilePath,resourceDataFolder,true);
            resourceData.setFileWebAddress("/store/resourceData/"+createResourceDataDTO.getFileStoreName());
            resourceData.setFileRelativePath("/resourceData/"+createResourceDataDTO.getFileStoreName());
            FileUtil.del(srcFilePath); //删除大文件临时存在的位置
            ArrayList<VisualDataItem> visualDataItems = resourceData.getVisualDataItems();

            if("tif".equals(resourceData.getVisualType())){
                List<JSONObject> fileInfo;
                try {
                    fileInfo = FileUtils.zipUncompress(
                            resourceDataFolder+"/"+createResourceDataDTO.getFileStoreName(),
                            resourceDataFolder+"/"+createResourceDataDTO.getFileStoreName().split(".zip")[0]);
                } catch (Exception e) {
                    return null;
                }
                //解压成功后把压缩包给删了
//                FileUtils.deleteFile(basePath + "/" + workName + "." + suffix);
                for (JSONObject item : fileInfo) {
                    String fileName = item.getString("fileName");
                    if (fileName.indexOf(".tif") != -1){
                        VisualDataItem visualDataItem = new VisualDataItem();
                        String path = item.getString("path");
                        Long fileSize = item.getLong("fileSize");
                        GeoServerUtils.PublishTiff("yangtzeRiver",fileName.split(".tif")[0],path);
                        String geoServerUrl= MessageFormat.format("{0}/yangtzeRiver/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image%2FPNG&TRANSPARENT=true&STYLES&LAYERS=yangtzeRiver%3A{1}&exceptions=application%2Fvnd.ogc.se_inimage&SRS=EPSG%3A3857" +
                                "&WIDTH=512&HEIGHT=512&BBOX='{'bbox-epsg-3857'}'",geoserverUrl,fileName.split(".tif")[0]);
                        visualDataItem.setName(fileName);
                        visualDataItem.setType("tif");
                        visualDataItem.setSize(fileSize.toString());
                        visualDataItem.setFileStoreName(resourceData.getFileStoreName());
                        visualDataItem.setFileWebAddress(resourceData.getFileWebAddress());
                        visualDataItem.setProblemTags(resourceData.getProblemTags());
                        visualDataItem.setNormalTags(resourceData.getNormalTags());
                        visualDataItem.setUserId(resourceData.getUserEmail());
                        visualDataItem.setVisualWebAddress(geoServerUrl);
                        visualDataItem.setPublicBoolean(true);
                        visualDataItem.setVisualizationBoolean(true);
                        visualDataItem.setVisualRelativePath(path.split(dataStoreDir)[1]);
                        visualDataItems.add(visualDataItem);
                    }
                }
            } else if("shp".equals(resourceData.getVisualType())){
                List<JSONObject> fileInfo;
                try {
                    fileInfo = FileUtils.zipUncompress(resourceDataFolder+"/"+createResourceDataDTO.getFileStoreName(),resourceDataFolder);
                } catch (Exception e) {
                    return null;
                }
                //解压成功后把压缩包给删了
//                FileUtils.deleteFile(basePath + "/" + workName + "." + suffix);
                for (JSONObject item : fileInfo) {
                    String fileName = item.getString("fileName");
                    if (fileName.indexOf(".shp") != -1){
                        VisualDataItem visualDataItem = new VisualDataItem();
                        String path = item.getString("path");
                        Long fileSize = item.getLong("fileSize");
                        GeoServerUtils.PublishTiff("yangtzeRiver",fileName,path);
                        String geoServerUrl= MessageFormat.format("{0}/yangtzeRiver/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image%2FPNG&TRANSPARENT=true&STYLES&LAYERS=yangtzeRiver%3A{1}&exceptions=application%2Fvnd.ogc.se_inimage&SRS=EPSG%3A3857" +
                                "&WIDTH=512&HEIGHT=512&BBOX='{'bbox-epsg-3857'}'",geoserverUrl,resourceData.getName());
                        visualDataItem.setName(fileName);
                        visualDataItem.setType("shp");
                        visualDataItem.setSize(fileSize.toString());
                        visualDataItem.setFileStoreName(resourceData.getFileStoreName());
                        visualDataItem.setFileWebAddress(resourceData.getFileWebAddress());
                        visualDataItem.setProblemTags(resourceData.getProblemTags());
                        visualDataItem.setNormalTags(resourceData.getNormalTags());
                        visualDataItem.setUserId(resourceData.getUserEmail());
                        visualDataItem.setVisualWebAddress(geoServerUrl);
                        visualDataItem.setPublicBoolean(true);
                        visualDataItem.setVisualizationBoolean(true);
                        visualDataItem.setVisualRelativePath(path.split(dataStoreDir)[1]);
                        visualDataItems.add(visualDataItem);
                    }
                }
            }
            resourceData.setVisualDataItems(visualDataItems);

            //图像
            if (imgFile.isEmpty()) {
                resourceData.setImgWebAddress("");
            }else {
                //将文件保存到指定位置
                String imgFileName = imgFile.getOriginalFilename(); //eg: XXX.js
                String imgFileMainName= FileNameUtil.mainName(imgFileName); // XXX
                String imgFileExtName = FileNameUtil.extName(imgFileName); //js
                String imgFileNewName=IdUtil.objectId()+"."+imgFileExtName;
                File saveImgFile = new File(folder, imgFileNewName);//eg: E:\\TEMP\\1231231.js
                imgFile.transferTo(saveImgFile);
                resourceData.setImgStoreName(imgFileNewName);
                resourceData.setImgWebAddress("/store/resourceData/"+imgFileNewName);
                resourceData.setImgRelativePath("/resourceData/"+imgFileNewName);
            }
            resourceData.setUserEmail("temp@xx.com");
            resourceDataDao.save(resourceData);

            return ResultUtils.success("保存资源数据成功！");
        }catch (Exception e){
            log.error(e.getMessage());
            return ResultUtils.error("保存资源数据失败！");
        }
    }

    public JsonResult getResourceDataList(ResourcePageDTO resourcePageDTO) {
        try{
            Pageable pageable = commonService.getPageable(resourcePageDTO);
            String tagClass= resourcePageDTO.getTagClass();

            if(tagClass.equals("problemTags")){
                Page<ResourceData> re = resourceDataDao.findAllByNameLikeIgnoreCaseAndProblemTagsLikeIgnoreCase(resourcePageDTO.getSearchText(), resourcePageDTO.getTagName(),pageable);
                return ResultUtils.success(re);
            }else if(tagClass.equals("normalTags")){
                Page<ResourceData> re = resourceDataDao.findAllByNameLikeIgnoreCaseAndNormalTagsLikeIgnoreCase(resourcePageDTO.getSearchText(), resourcePageDTO.getTagName(),pageable);
                return ResultUtils.success(re);
            }else {
                return ResultUtils.error("数据类别不正确，problemTags或normalTags");
            }
        }catch (Exception e){
            log.error(e.getMessage());
            return ResultUtils.error("保存资源数据失败！");
        }
    }


    public JsonResult deleteResourceData(String resourceDataId) {
        try{
            ResourceData resourceData = resourceDataDao.findById(resourceDataId).get();

            String filePath=resourceDataFolder+"/"+resourceData.getFileStoreName();
            FileUtil.del(filePath);

            ArrayList<VisualDataItem> visualDataItems = resourceData.getVisualDataItems();
            for(VisualDataItem item : visualDataItems){
                String visualFilePath=resourceDataFolder+"/"+item.getVisualStoreName();
                FileUtil.del(visualFilePath);
            }

            String imgFilePath=resourceDataFolder+"/"+resourceData.getImgStoreName();
            FileUtil.del(imgFilePath);

            resourceDataDao.deleteById(resourceDataId);
            return ResultUtils.success("删除资源数据成功！");
        }catch (Exception e){
            log.error(e.getMessage());
            return ResultUtils.error("删除资源数据失败！");
        }
    }

    public JsonResult saveResourceSmallFile(CreateResourceSmallFileDTO createResourceSmallFileDTO, MultipartFile upSmallFile) {
        try{
            File folder = new File(resourceDataFolder);
            if (!folder.isDirectory()) {
                folder.mkdirs();
            }

            ResourceSmallFile resourceSmallFile=new ResourceSmallFile();
            BeanUtils.copyProperties(createResourceSmallFileDTO,resourceSmallFile);

            //可视化文件
            if (upSmallFile.isEmpty()) {
                return ResultUtils.error("上传文件为空");
            }

            //将文件保存到指定位置
            String fileName = upSmallFile.getOriginalFilename(); //eg: XXX.js
            String fileMainName= FileNameUtil.mainName(fileName); // XXX
            String fileExtName = FileNameUtil.extName(fileName); //js
            String fileNewName=IdUtil.objectId()+"."+fileExtName;
            File saveVisualFile = new File(folder, fileNewName);//eg: E:\\TEMP\\1231231.js

            upSmallFile.transferTo(saveVisualFile);
            resourceSmallFile.setFileStoreName(fileNewName);
            resourceSmallFile.setFileWebAddress("/store/resourceData/"+fileNewName);

            resourceSmallFile.setUserEmail("temp@xx.com");
            resourceSmallFileDao.save(resourceSmallFile);

            return ResultUtils.success("保存资源小文件成功！");
        }catch (Exception e){
            log.error(e.getMessage());
            return ResultUtils.error("保存资源小文件失败！");
        }
    }

    public JsonResult deleteResourceSmallFile(String resourceSmallFileId) {
        try{

            ResourceSmallFile resourceSmallFile=resourceSmallFileDao.findById(resourceSmallFileId).get();

            String filePath=resourceDataFolder+"/"+resourceSmallFile.getFileStoreName();
            FileUtil.del(filePath);

            resourceDataDao.deleteById(resourceSmallFileId);
            return ResultUtils.success("删除资源小文件成功！");
        }catch (Exception e){
            log.error(e.getMessage());
            return ResultUtils.error("删除资源小文件失败！");
        }
    }

    public JsonResult createResourceModel(CreateResourceModelDTO createResourceModelDTO) {
        try{
            ResourceModel resourceModel=new ResourceModel();
            BeanUtils.copyProperties(createResourceModelDTO,resourceModel);
            resourceModelDao.save(resourceModel);
            return ResultUtils.success("创建模型条目成功！");
        }catch (Exception e){
            log.error(e.getMessage());
            return ResultUtils.error("创建模型条目失败！");
        }
    }



    public JsonResult deleteResourceModel(String resourceModelId) {
        try{
            resourceModelDao.deleteById(resourceModelId);
            return ResultUtils.success("删除模型条目成功！");
        }catch (Exception e){
            log.error(e.getMessage());
            return ResultUtils.error("删除模型条目失败！");
        }
    }

    public JsonResult getResourceModelList(ResourcePageDTO resourcePageDTO) {
        try{
            Pageable pageable = commonService.getPageable(resourcePageDTO);
            String tagClass= resourcePageDTO.getTagClass();

            if(tagClass.equals("problemTags")){
                Page<ResourceModel> re = resourceModelDao.findAllByNameLikeIgnoreCaseAndProblemTagsLikeIgnoreCase(resourcePageDTO.getSearchText(), resourcePageDTO.getTagName(),pageable);
                return ResultUtils.success(re);
            }else if(tagClass.equals("normalTags")){
                Page<ResourceModel> re = resourceModelDao.findAllByNameLikeIgnoreCaseAndNormalTagsLikeIgnoreCase(resourcePageDTO.getSearchText(), resourcePageDTO.getTagName(),pageable);
                return ResultUtils.success(re);
            }else {
                return ResultUtils.error("数据类别不正确，problemTags或normalTags");
            }
        }catch (Exception e){
            log.error(e.getMessage());
            return ResultUtils.error("保存资源数据失败！");
        }
    }
}
