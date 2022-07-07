package yangtzedeltasimulatorbackend.service;

import cn.hutool.core.util.IdUtil;
import cn.hutool.json.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import yangtzedeltasimulatorbackend.dao.LabTaskDao;
import yangtzedeltasimulatorbackend.dao.UserDataDao;
import yangtzedeltasimulatorbackend.entity.doo.JsonResult;
import yangtzedeltasimulatorbackend.entity.dto.PageDTO;
import yangtzedeltasimulatorbackend.entity.dto.script.GDALClipDTO;
import yangtzedeltasimulatorbackend.entity.po.LabTask;
import yangtzedeltasimulatorbackend.entity.po.UserData;
import yangtzedeltasimulatorbackend.entity.po.VisualDataItem;
import yangtzedeltasimulatorbackend.utils.ExecCmdUtils;
import yangtzedeltasimulatorbackend.utils.GeoServerUtils;
import yangtzedeltasimulatorbackend.utils.MyFileUtils;
import yangtzedeltasimulatorbackend.utils.ResultUtils;

import javax.servlet.http.HttpServletResponse;
import javax.swing.*;
import java.io.File;
import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * @Description
 * @Author wyjq
 * @Date 2022/3/17
 */

@Slf4j
@Service
public class ScriptExecService {

    @Value("${dataStoreDir}"+"/scriptOut")
    private  String scriptOutDir;

    @Value("${dataStoreDir}")
    private  String dataResourceDir;

    @Value("${geoserverUrl}")
    private  String geoserverUrl;

    @Autowired
    UserDataDao userDataDao ;

    @Autowired
    LabTaskDao labTaskDao ;

    public void execTest(HttpServletResponse response) {
        try{

            String outFile="test.txt";
            String outFilePath=scriptOutDir+"/"+outFile;

            List<String> argvList=new ArrayList<>();
            argvList.add(outFilePath);
            int re= ExecCmdUtils.execPython("test.py",argvList);

            if(re==0){
                MyFileUtils.downloadFile(new File(outFilePath),response);
            }
        }catch (Exception e){
            log.error(e.getMessage());
        }
    }


    public JsonResult gdalClip(GDALClipDTO gdalClipDTO, String labTaskId) {
        try{
            Boolean isShp = gdalClipDTO.getIsShp();
            String inputPath;
            if(isShp){
                inputPath = gdalClipDTO.getInputShpPath();
            } else {
                inputPath=gdalClipDTO.getInputGeoJson();
            }
            String inputRasterPath = gdalClipDTO.getInputRasterPath();
            String outFileName = gdalClipDTO.getOutputTifName();

            List<String> argvList=new ArrayList<>();
            argvList.add(dataResourceDir + inputPath);
            argvList.add(dataResourceDir + inputRasterPath);
            argvList.add(scriptOutDir + "/" + outFileName);

            int re = 0;
            if(isShp){
                re= ExecCmdUtils.execPython("GDAL_clip.py",argvList);
            } else {
                re= ExecCmdUtils.execPython("GDAL_clip_GeoJson.py",argvList);
            }
            if(re==0){
                // 对裁剪成功的tif进行发布
                File file = new File(scriptOutDir + "/" + outFileName);
                UserData userData = new UserData();
                String path = scriptOutDir + "/" + outFileName;
                String fileName = file.getName();
                Long fileSize = file.length();
                GeoServerUtils.PublishTiff("yangtzeRiver",fileName.split(".tif")[0],path);
                String geoServerUrl= MessageFormat.format("{0}/yangtzeRiver/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image%2FPNG&TRANSPARENT=true&STYLES&LAYERS=yangtzeRiver%3A{1}&exceptions=application%2Fvnd.ogc.se_inimage&SRS=EPSG%3A3857" +
                        "&WIDTH=512&HEIGHT=512&BBOX='{'bbox-epsg-3857'}'",geoserverUrl,fileName.split(".tif")[0]);
                userData.setName(fileName);
                userData.setType("file");
                userData.setVisualType("tif");
                userData.setSize(fileSize.toString());
                userData.setFileStoreName(fileName);
                userData.setFileWebAddress("/store/scriptOut/" + fileName);
                userData.setFileRelativePath("/scriptOut/" + fileName);
                userData.setVisualWebAddress(geoServerUrl);
                userData.setPublicBoolean(true);
                userData.setVisualizationBoolean(true);
                userData.setParentId(labTaskId);
                userDataDao.save(userData);
                //保存到labTask
                Optional<LabTask> byId1 = labTaskDao.findById(labTaskId);
                if (!byId1.isPresent()) { return ResultUtils.error("保存失败");}
                LabTask labTask = byId1.get();
                List<cn.hutool.json.JSONObject> dataList = labTask.getDataList();
                cn.hutool.json.JSONObject dataObject = new cn.hutool.json.JSONObject();
                dataObject.set("id", IdUtil.objectId());
                dataObject.set("name", fileName);
                dataObject.set("type","tif");
                dataObject.set("visualType","tif");
                dataObject.set("size",String.valueOf(fileSize));
                dataObject.set("fileStoreName",fileName);
                dataObject.set("fileRelativePath","/data/"+fileName);
                dataObject.set("fileWebAddress","/store/data/"+fileName);
                dataObject.set("visualWebAddress",geoServerUrl);
                dataObject.set("visualizationBoolean",true);
                dataObject.set("publicBoolean",true);
                dataList.add(dataObject);
                labTask.setDataList(dataList);
                labTaskDao.save(labTask);

                return  ResultUtils.success(userData);
            }
            return ResultUtils.error();
        }catch (Exception e){
            log.error(e.getMessage());
            return ResultUtils.error();
        }
    }
}
