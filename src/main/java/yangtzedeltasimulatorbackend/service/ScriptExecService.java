package yangtzedeltasimulatorbackend.service;

import cn.hutool.core.util.IdUtil;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import io.swagger.models.auth.In;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import yangtzedeltasimulatorbackend.dao.LabTaskDao;
import yangtzedeltasimulatorbackend.dao.UserDataDao;
import yangtzedeltasimulatorbackend.entity.doo.JsonResult;
import yangtzedeltasimulatorbackend.entity.dto.script.GDALClipDTO;
import yangtzedeltasimulatorbackend.entity.dto.script.TxtAnalysisDTO;
import yangtzedeltasimulatorbackend.entity.po.LabTask;
import yangtzedeltasimulatorbackend.entity.po.UserData;
import yangtzedeltasimulatorbackend.utils.ExecCmdUtils;
import yangtzedeltasimulatorbackend.utils.GeoServerUtils;
import yangtzedeltasimulatorbackend.utils.MyFileUtils;
import yangtzedeltasimulatorbackend.utils.ResultUtils;

import javax.servlet.http.HttpServletResponse;
import java.io.*;
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

    @Value("${dataStoreDir}" + "/scriptOut")
    private String scriptOutDir;

    @Value("${dataStoreDir}")
    private String dataResourceDir;

    @Value("${geoserverUrl}")
    private String geoserverUrl;

    @Autowired
    UserDataDao userDataDao;

    @Autowired
    LabTaskDao labTaskDao;

    public void execTest(HttpServletResponse response) {
        try {

            String outFile = "test.txt";
            String outFilePath = scriptOutDir + "/" + outFile;

            List<String> argvList = new ArrayList<>();
            argvList.add(outFilePath);
            int re = ExecCmdUtils.execPython("test.py", argvList);

            if (re == 0) {
                MyFileUtils.downloadFile(new File(outFilePath), response);
            }
        } catch (Exception e) {
            log.error(e.getMessage());
        }
    }


    public JsonResult gdalClip(GDALClipDTO gdalClipDTO, String labTaskId, String userId) {
        try {
            Boolean isShp = gdalClipDTO.getIsShp();
            String inputPath;
            if (isShp) {
                inputPath = gdalClipDTO.getInputShpPath();
            } else {
                inputPath = gdalClipDTO.getInputGeoJson();
            }
            String inputRasterPath = gdalClipDTO.getInputRasterPath();
            String outFileName = gdalClipDTO.getOutputTifName();

            List<String> argvList = new ArrayList<>();
            argvList.add(dataResourceDir + inputPath);
            argvList.add(dataResourceDir + inputRasterPath);
            argvList.add(scriptOutDir + "/" + outFileName);

            int re;
            if (isShp) {
                re = ExecCmdUtils.execPython("GDAL_clip.py", argvList);
            } else {
                re = ExecCmdUtils.execPython("GDAL_clip_GeoJson.py", argvList);
            }
            if (re == 0) {
                // 对裁剪成功的tif进行发布
                File file = new File(scriptOutDir + "/" + outFileName);
                UserData userData = new UserData();
                String path = scriptOutDir + "/" + outFileName;
                String fileName = file.getName();
                Long fileSize = file.length();
                GeoServerUtils.PublishTiff("yangtzeRiver", fileName.split(".tif")[0], path);
                String geoServerUrl = MessageFormat.format("{0}/yangtzeRiver/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image%2FPNG&TRANSPARENT=true&STYLES&LAYERS=yangtzeRiver%3A{1}&exceptions=application%2Fvnd.ogc.se_inimage&SRS=EPSG%3A3857" +
                        "&WIDTH=512&HEIGHT=512&BBOX='{'bbox-epsg-3857'}'", geoserverUrl, fileName.split(".tif")[0]);
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
                userData.setUserId(userId);
                userDataDao.save(userData);
                //保存到labTask
                Optional<LabTask> byId1 = labTaskDao.findById(labTaskId);
                if (!byId1.isPresent()) {
                    return ResultUtils.error("保存失败");
                }
                LabTask labTask = byId1.get();
                List<cn.hutool.json.JSONObject> dataList = labTask.getDataList();
                cn.hutool.json.JSONObject dataObject = new cn.hutool.json.JSONObject();
                dataObject.set("id", userData.getId());
                dataObject.set("name", fileName);
                dataObject.set("type", "tif");
                dataObject.set("visualType", "tif");
                dataObject.set("size", String.valueOf(fileSize));
                dataObject.set("fileStoreName", fileName);
                dataObject.set("fileRelativePath", "/scriptOut/" + fileName);
                dataObject.set("fileWebAddress", "/store/scriptOut/" + fileName);
                dataObject.set("visualWebAddress", geoServerUrl);
                dataObject.set("visualizationBoolean", true);
                dataObject.set("publicBoolean", true);
                dataObject.set("source", "cloud");
                dataList.add(dataObject);
                labTask.setDataList(dataList);
                labTaskDao.save(labTask);

                return ResultUtils.success(labTask);
            }
            return ResultUtils.error();
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResultUtils.error();
        }
    }

    /**
     * @param gdalClipDTO
     * @param labTaskId
     * @param userId
     * @return: yangtzedeltasimulatorbackend.entity.doo.JsonResult
     * @Description:  集的裁剪批量操作
     * @Author: ZhaoYiming
     * @Date: 2022-8-3 16:35
     */
    public JsonResult gdalClipDataSet(GDALClipDTO gdalClipDTO, String labTaskId, String userId) {
        try {
            Boolean isShp = gdalClipDTO.getIsShp();
            String inputPath;
            if (isShp) {
                inputPath = gdalClipDTO.getInputShpPath();
            } else {
                inputPath = gdalClipDTO.getInputGeoJson();
            }
//            String inputRasterPath = gdalClipDTO.getInputRasterPath();
            ArrayList<cn.hutool.json.JSONObject> inputRasterList = gdalClipDTO.getInputRasterListPath();
            //创建批量处理的存放文件夹
            String outFileName = gdalClipDTO.getOutputTifName();
            String folderId = IdUtil.objectId();
            String folderPath = scriptOutDir + "/" + outFileName + folderId;
            File folderFile = new File(folderPath);
            folderFile.mkdir();

            // TODO: 2022-8-3  主要针对asc文件的批量处理
            // 1. asc转tif (原路径）
            // 2. tif裁剪 （新文件夹下）
            // 3. tif转asc （新文件夹下）
            String publish_1st = "false";
            String tempGeoUrl = "";
            ArrayList<cn.hutool.json.JSONObject> resultList = new ArrayList<>();
            for(cn.hutool.json.JSONObject item: inputRasterList){
                String oldAscPath = dataResourceDir + item.getStr("fileRelativePath");
                String oldTifPath = oldAscPath.replace(".asc",".tif");
                // asc2tif
                List<String> argvList = new ArrayList<>();
                argvList.add(oldAscPath);
                argvList.add(oldTifPath);
                int re = ExecCmdUtils.execPython("asc2tif.py", argvList);
                if (re == 0) {
                    // 裁剪
                    List<String> argvList1 = new ArrayList<>();
                    argvList1.add(dataResourceDir + inputPath);
                    argvList1.add(oldTifPath);
                    String newTifPath = folderPath + "/" + item.getStr("name").replace(".asc","_clip.tif");
                    argvList1.add(newTifPath);
                    int re1;
                    if (isShp) {
                        re1 = ExecCmdUtils.execPython("GDAL_clip.py", argvList1);
                    } else {
                        re1 = ExecCmdUtils.execPython("GDAL_clip_GeoJson.py", argvList1);
                    }
                    if (re1 == 0) {
                        //tif2asc
                        if(publish_1st.equals("false")){
                            List<String> argvList3 = new ArrayList<>();
                            argvList3.add(newTifPath);
                            int re3 = ExecCmdUtils.execPython("tifSetProj.py", argvList3);
                            if (re3 == 0) {
                                publish_1st = "true";
                                String tempName = IdUtil.objectId() + item.getStr("name").replace(".asc","_clip.tif");
                                GeoServerUtils.PublishTiff("yangtzeRiver",tempName.split(".tif")[0].replace(".","_"),newTifPath);
                                String geoServerUrl= MessageFormat.format("{0}/yangtzeRiver/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image%2FPNG&TRANSPARENT=true&STYLES&LAYERS=yangtzeRiver%3A{1}&exceptions=application%2Fvnd.ogc.se_inimage&SRS=EPSG%3A3857" +
                                        "&WIDTH=512&HEIGHT=512&BBOX='{'bbox-epsg-3857'}'",geoserverUrl,tempName.split(".tif")[0].replace(".","_"));
                                tempGeoUrl = geoServerUrl;
                            }
                        }
                        List<String> argvList2 = new ArrayList<>();
                        argvList2.add(newTifPath);
                        argvList2.add(newTifPath.replace(".tif",".asc"));
                        int re2 = ExecCmdUtils.execPython("tif2asc.py", argvList2);
                        if (re2 == 0){
                            cn.hutool.json.JSONObject ascObject = new cn.hutool.json.JSONObject();
                            ascObject.set("name", item.getStr("name").replace(".asc","_clip.asc"));
                            ascObject.set("fileRelativePath",newTifPath.replace(".tif",".asc").split(dataResourceDir)[1]);
                            ascObject.set("type","asc");
                            ascObject.set("visualType", "asc");
                            ascObject.set("visualWebAddress",tempGeoUrl);
                            ascObject.set("id",IdUtil.objectId());
                            resultList.add(ascObject);
                        }
                    }
                }
            }
            if(publish_1st.equals("true") && resultList.size() == inputRasterList.size()){
                //保存到labTask
                Optional<LabTask> byId1 = labTaskDao.findById(labTaskId);
                if (!byId1.isPresent()) {
                    return ResultUtils.error("保存失败");
                }
                LabTask labTask = byId1.get();
                List<cn.hutool.json.JSONObject> dataList = labTask.getDataList();
                cn.hutool.json.JSONObject dataObject = new cn.hutool.json.JSONObject();
                dataObject.set("id", IdUtil.objectId());
                dataObject.set("name", outFileName);
                dataObject.set("type", "tif");
                dataObject.set("visualType", "dataSet");
                dataObject.set("size", "0");
                dataObject.set("fileStoreName", outFileName + folderId);
                dataObject.set("fileRelativePath", "/scriptOut/" + outFileName + folderId);
                dataObject.set("fileWebAddress", "/store/scriptOut/" + outFileName + folderId);
                dataObject.set("visualWebAddress", tempGeoUrl);
                dataObject.set("visualizationBoolean", true);
                dataObject.set("publicBoolean", true);
                dataObject.set("source", "cloud");
                dataObject.set("dataSetList", resultList);
                dataList.add(dataObject);
                labTask.setDataList(dataList);
                labTaskDao.save(labTask);

                return ResultUtils.success(labTask);
            }

            return ResultUtils.error();
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResultUtils.error();
        }
    }

    public JsonResult txtAnalysis(TxtAnalysisDTO txtAnalysisDTO, String labTaskId) {
        String type = txtAnalysisDTO.getType();
        String txtPath = txtAnalysisDTO.getInputTxtPath();
        String chartsType = txtAnalysisDTO.getChartsType();
        String name = txtAnalysisDTO.getInputFeaturesName();
        String dateNum = txtAnalysisDTO.getDateNum();
        JSONObject options = new JSONObject();
        if (type.equals("charts")) {
            //1.根据txt路径，读取文件
            // 使用ArrayList来存储每行读取到的字符串
            ArrayList<String> arrayList = new ArrayList<>();
            try {
                File file = new File(dataResourceDir + txtPath);
                InputStreamReader inputReader = new InputStreamReader(new FileInputStream(file));
                BufferedReader bf = new BufferedReader(inputReader);
                // 按行读取字符串
                String str;
                while ((str = bf.readLine()) != null) {
                    arrayList.add(str);
                }
                bf.close();
                inputReader.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
            // 对ArrayList中存储的字符串进行处理
            options = getChartOptionsByArrayList(arrayList, chartsType);
            return ResultUtils.success(options);
//            options.getJSONObject("title").put("text",name);
            //2.根据图表类型，组织成相应的options数据返回
        } else if (type.equals("raster")) {
            //1.利用python绘图，并配置底图
            String inputPath = dataResourceDir + txtPath;
            String outputPngName = IdUtil.objectId() + ".png";
            String outputPath = scriptOutDir + "/" + outputPngName;
            List<String> argvList = new ArrayList<>();
            argvList.add(inputPath);
            argvList.add(dateNum);
            argvList.add(outputPath);
            int re;
            re = ExecCmdUtils.execPython("matplotlib_plotMap.py", argvList);
            if (re == 0){
                return ResultUtils.success(outputPngName);
            }
            return ResultUtils.error();
            //2.将图片添加到个人空间的实验室文件夹下(单独的接口)
        }
        return ResultUtils.error();
    }

    public void downloadPic(String path, HttpServletResponse response) {
        try{
            File file=new File(dataResourceDir + "/" + path);
            MyFileUtils.downloadFile(file,response);
        }catch (Exception e){
            log.error(e.getMessage());
        }
    }

    public JSONObject getChartOptionsByArrayList(ArrayList<String> arrayList, String chartsType) {
        // 1. 处理数据
        ArrayList<String> dataTitle = new ArrayList<>();
        ArrayList<ArrayList<String>> dataArray = new ArrayList<>();
        int length = arrayList.size();
        int dataNum = arrayList.get(0).split(",").length;
        for (int i = 0; i < length; i++) {
            for (int j = 0; j < dataNum; j++) {
                String txtTemp = arrayList.get(i);
                if (i == 0) {
                    dataTitle.add(txtTemp.split(",")[j]);
                } else {
                    if (dataArray.size() < j + 1) {
                        ArrayList<String> list = new ArrayList<>();
                        dataArray.add(list);
                    }
                    dataArray.get(j).add(txtTemp.split(",")[j]);
                }
            }
        }
        // 2.匹配合适的options格式
        String templateOptionsName = "";
        if (chartsType.equals("line")) {
            if(dataTitle.size() == 2){
                templateOptionsName = "area_time_axis.json";
            } else if (dataTitle.size() == 3){
                templateOptionsName = "area_rainfall.json";
            }
        } else if (chartsType.equals("bar")) {
            if(dataTitle.size() == 2){
                templateOptionsName = "bar_simple.json";
            }else if (dataTitle.size() == 3){
                templateOptionsName = "bar_mix_zoom_onvalue.json";
            }
        } else if (chartsType.equals("pie")) {
            templateOptionsName = "pie_simple.json";
        } else if (chartsType.equals("scatter")) {
            templateOptionsName = "scatter_simple.json";
        }
        String scriptsDir = ClassLoader.getSystemResource("static/myChartOptions/").getPath().substring(1); //eg: e:\\xx\static\\myScripts\\
        String optionsPath = scriptsDir + templateOptionsName; //eg: eg: e:\\xx\static\\myScripts\\test.py
        String optionsStr = "";
        try {
            //创建FileInputStream对象，读取文件内容
            InputStream fis = new BufferedInputStream(new FileInputStream(optionsPath));
            byte[] buffer = new byte[fis.available()];
            fis.read(buffer);
            optionsStr = new String(buffer);
            fis.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        JSONObject optionsJson = JSON.parseObject(optionsStr);
        if (chartsType.equals("line")) {
            if(dataTitle.size() == 2){
                optionsJson.getJSONObject("xAxis").put("data",dataArray.get(0));
                optionsJson.getJSONArray("series").getJSONObject(0).put("data",dataArray.get(1));
                optionsJson.getJSONArray("series").getJSONObject(0).put("name",dataTitle.get(1));
            } else if (dataTitle.size() == 3){
                ArrayList<String> legend = new ArrayList<>();
                legend.add(dataTitle.get(1));
                legend.add(dataTitle.get(2));
                optionsJson.getJSONObject("legend").put("data",legend);
                optionsJson.getJSONObject("xAxis").put("data",dataArray.get(0));
                optionsJson.getJSONArray("series").getJSONObject(0).put("data",dataArray.get(1));
                optionsJson.getJSONArray("series").getJSONObject(0).put("name",dataTitle.get(1));
                optionsJson.getJSONArray("series").getJSONObject(1).put("data",dataArray.get(2));
                optionsJson.getJSONArray("series").getJSONObject(1).put("name",dataTitle.get(2));
            }
        } else if (chartsType.equals("bar")) {
            if(dataTitle.size() == 2){
                optionsJson.getJSONObject("xAxis").put("data",dataArray.get(0));
                optionsJson.getJSONArray("series").getJSONObject(0).put("data",dataArray.get(1));
            }else if (dataTitle.size() == 3){
                ArrayList<String> legend = new ArrayList<>();
                legend.add(dataTitle.get(1));
                legend.add(dataTitle.get(2));
                optionsJson.getJSONObject("legend").put("data",legend);
                optionsJson.getJSONArray("xAxis").getJSONObject(0).put("data",dataArray.get(0));
                optionsJson.getJSONArray("yAxis").getJSONObject(0).put("name",dataTitle.get(1));
                optionsJson.getJSONArray("series").getJSONObject(0).put("data",dataArray.get(1));
                optionsJson.getJSONArray("series").getJSONObject(0).put("name",dataTitle.get(1));
                optionsJson.getJSONArray("series").getJSONObject(1).put("data",dataArray.get(2));
                optionsJson.getJSONArray("series").getJSONObject(1).put("name",dataTitle.get(2));
            }
        } else if (chartsType.equals("pie")) {
            optionsJson.getJSONArray("series").getJSONObject(0).put("name",dataTitle.get(1));
            ArrayList<JSONObject> pieSeriesData = new ArrayList<>();
            for(int i = 0 ; i < dataArray.get(0).size() ; i++){
                JSONObject pieValue = new JSONObject();
                pieValue.put("value",dataArray.get(1).get(i));
                pieValue.put("name",dataArray.get(0).get(i));
                pieSeriesData.add(pieValue);
            }
            optionsJson.getJSONArray("series").getJSONObject(0).put("data",pieSeriesData);
        } else if (chartsType.equals("scatter")) {
            ArrayList<ArrayList<Float>> scatterSeriesData = new ArrayList<>();
            for(int i = 0 ; i < dataArray.get(0).size() ; i++){
                ArrayList<Float> scatterValue = new ArrayList<>();
                scatterValue.add(Float.valueOf(dataArray.get(0).get(i)));
                scatterValue.add(Float.valueOf(dataArray.get(1).get(i)));
                scatterSeriesData.add(scatterValue);
            }
            optionsJson.getJSONArray("series").getJSONObject(0).put("data",scatterSeriesData);
        }
        return optionsJson;
    }
}
