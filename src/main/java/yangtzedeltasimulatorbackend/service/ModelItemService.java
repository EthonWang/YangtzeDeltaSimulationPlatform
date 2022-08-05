package yangtzedeltasimulatorbackend.service;

import cn.hutool.core.io.FileUtil;
import cn.hutool.core.io.file.FileNameUtil;
import cn.hutool.core.io.file.FileReader;
import cn.hutool.core.util.IdUtil;
import cn.hutool.core.util.ZipUtil;
import cn.hutool.json.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.entity.ContentType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.multipart.MultipartFile;
import yangtzedeltasimulatorbackend.dao.*;
import yangtzedeltasimulatorbackend.entity.doo.JsonResult;
import yangtzedeltasimulatorbackend.entity.doo.support.TaskData;
import yangtzedeltasimulatorbackend.entity.po.*;
import yangtzedeltasimulatorbackend.utils.FileUtils;
import yangtzedeltasimulatorbackend.utils.GeoServerUtils;
import yangtzedeltasimulatorbackend.utils.ResultUtils;
import yangtzedeltasimulatorbackend.utils.Utils;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.MessageFormat;
import java.util.*;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/4/6
 **/
@Slf4j
@Service
public class ModelItemService {

    @Autowired
    ModelItemDao modelItemDao;

    @Autowired
    QuestionDao questionDao;

    @Autowired
    TaskDao taskDao;

    @Autowired
    ResourceModelDao resourceModelDao;

    @Autowired
    UserDataDao userDataDao;

    @Autowired
    LabTaskDao labTaskDao;

    @Value("${dataStoreDir}"+"/temp")
    private  String tempDir;

    @Value("${dataStoreDir}"+"/data")
    private  String userDataDir;

    @Value("${dataStoreDir}"+"/models")
    private  String modelsFolder;

    @Value("${dataStoreDir}")
    private  String dataStoreDir;

    //远程数据容器地址
    @Value("${dataContainerIpAndPort}")
    String dataContainerIpAndPort;

    @Value("${managerServerIpAndPort}")
    String managerServerIpAndPort;



    public JsonResult saveModelItem(ModelItem modelItem){
        try{
            modelItemDao.save(modelItem);
            return ResultUtils.success("add modelItem ok");
        }catch (Exception e){
            return ResultUtils.error(e.getMessage());
        }
    }

    public JsonResult saveModelZipFile(MultipartFile modelZipFile, String modelId) {
        try{
            if (modelZipFile.isEmpty()) {
                return ResultUtils.error("file is empty!!!");
            }

            File folder = new File(modelsFolder);
            if (!folder.isDirectory()) {
                folder.mkdirs();
            }

            //将zip保存到指定位置
            String fileName = modelZipFile.getOriginalFilename(); //eg: XXX.zip
            String fileMainName=FileNameUtil.mainName(fileName); // XXX 模型名字也是文件名字
            File zipFile = new File(folder, fileName);//eg: E:\\TEMP\\XXX.zip
            if(zipFile.exists()){
                zipFile.delete();
                File oldModelFolder=new File(folder, fileMainName); //eg: E:\\TEMP\\XXX
                FileUtil.del(oldModelFolder);
            }
            modelZipFile.transferTo(zipFile);

            //解压
            String zipFileAbsPathStr = zipFile.getAbsoluteFile().toString(); //zip文件绝对路径字符串 E:\\TEMP\\XXX.zip
            String unzipTargetFolder = zipFileAbsPathStr.substring(0, zipFileAbsPathStr.length() - 4);//zip文件的解压目标路径 E:\\TEMP\\XXX
            ZipUtil.unzip(zipFileAbsPathStr, unzipTargetFolder); //解压, 文件路径结构 E:\\TEMP\\XXX

            if(uploadInputDataSetToDataServer(unzipTargetFolder+"/config.json")){
                //设置对应modelItem中的config.json路径
                ModelItem modelItem=modelItemDao.findById(modelId).get();
                modelItem.setModelDataConfigPath(unzipTargetFolder+"/config.json");
                modelItemDao.save(modelItem);

                return ResultUtils.success("upload file ok");
            }
            return ResultUtils.error("upload data to dataServer error");

        }catch (Exception e){
            return ResultUtils.error(e.getMessage());
        }
    }


    public boolean uploadInputDataSetToDataServer(String dataConfigPath) {
        try{
            FileReader fileReader = new FileReader(dataConfigPath);
            JSONObject dataConfigJson = JSONObject.parseObject(fileReader.readString());
            JSONObject dataInputObject=dataConfigJson.getJSONObject("Input");

            for (String dataSetName : dataInputObject.keySet()) {  //遍历模型包含的每个输入数据集
                JSONArray dataSetArray= dataInputObject.getJSONArray(dataSetName);
                for(int i=0;i<dataSetArray.size();i++){
                    JSONObject oneInput=dataSetArray.getJSONObject(i);

                    File file = new File(modelsFolder+oneInput.getString("path"));
                    FileInputStream fileInputStream = new FileInputStream(file);
                    MultipartFile multipartFile = new MockMultipartFile(file.getName(), file.getName(),
                            ContentType.APPLICATION_OCTET_STREAM.toString(), fileInputStream);

                    MultiValueMap<String, Object> part = new LinkedMultiValueMap<>();
                    part.add("datafile",multipartFile.getResource());
                    part.add("userId","371252847@qq.com");
                    part.add("serverNode","China");
                    part.add("origination","YangzeDelta");
                    JSONObject uploadResult=Utils.uploadDataToDataServer(dataContainerIpAndPort,part);
                    if(uploadResult.getIntValue("code")==1){
                        String dataUrl="http://"+ dataContainerIpAndPort +"/data/"+uploadResult.getJSONObject("data").getString("id");
                        dataConfigJson.getJSONObject("Input").getJSONArray(dataSetName).getJSONObject(i).put("dataUrl",dataUrl);
                    }else{
                        log.error(uploadResult.getString("message"));
                        return false;
                    }
                }
            }

            BufferedWriter out = new BufferedWriter(new FileWriter(dataConfigPath));
            out.write(JSONObject.toJSONString(dataConfigJson));
            out.close();
            return true;
        }catch (Exception e){
            log.error(e.getMessage());
            return false;
        }
    }


    public JsonResult getModelItemList() {
        List<ModelItem> modelItems= modelItemDao.findAll();
        return ResultUtils.success(modelItems);
    }


    public JsonResult getModelTree() {
        try{
            JSONArray treeList=new JSONArray();
            List<QuestionItem> questions = questionDao.findAll();
            for(int i=0;i<questions.size();i++){  //遍历问题
                QuestionItem q=questions.get(i);

                JSONObject questionObj= new JSONObject();
                questionObj.put("type", "problem");
                questionObj.put("label", q.getQuestionName());
                JSONArray modelList=new JSONArray();
                for(int j=0;j<q.getModelRelateList().size();j++){  //遍历某问题关联的模型名数组

                    JSONObject modelObj= new JSONObject();
                    modelObj.put("type","model");
                    modelObj.put("label",q.getModelRelateList().get(j));
                    ModelItem aimModel=modelItemDao.findByModelName(q.getModelRelateList().get(j));
                    modelObj.put("modelId",aimModel.getId());
                    String dataConfigPath=aimModel.getModelDataConfigPath();
                    FileReader fileReader = new FileReader(dataConfigPath);
                    JSONObject dataConfigJson = JSONObject.parseObject(fileReader.readString());
                    JSONObject dataVisualJson=dataConfigJson.getJSONObject("Visualization");

                    JSONArray dataSetList=new JSONArray();
                    for (String testDataName : dataVisualJson.keySet()) {  //遍历每个模型包含的数据集
                        JSONObject dataSetObj= new JSONObject();
                        dataSetObj.put("type","dataSet");
                        dataSetObj.put("label",testDataName);
                        dataSetObj.put("children",dataVisualJson.get(testDataName));
                        dataSetList.add(dataSetObj);
                    }
                    modelObj.put("children",dataSetList);
                    modelList.add(modelObj);
                }
                questionObj.put("children",modelList);
                treeList.add(questionObj);
            }
            return ResultUtils.success(treeList);
        }catch (Exception e){
            return ResultUtils.error(e.getMessage());
        }

    }


    public JsonResult getMdlJson(String modelId) {
        try{
            ModelItem modelItem=modelItemDao.findById(modelId).get();
            String mdlString=modelItem.getMdl();
            JSONObject mdl= Utils.convertMdl(mdlString);
            return ResultUtils.success(mdl);
        }catch (Exception e){
            return ResultUtils.error(e.getMessage());
        }
    }

    //添加问题条目
    public JsonResult addQuestionItem(QuestionItem questionItem) {
        try{
            questionDao.save(questionItem);
            return ResultUtils.success("add questionItem ok");
        }catch (Exception e){
            return ResultUtils.error(e.getMessage());
        }
    }


    //获取模型输入的测试数据集
    public JsonResult getInputDataSet(String modelId){
        try{
            ModelItem modelItem=modelItemDao.findById(modelId).get();
            String configPath=modelItem.getModelDataConfigPath();
            FileReader fileReader = new FileReader(configPath);
            JSONObject dataConfigJson = JSONObject.parseObject(fileReader.readString());
            JSONObject inputJson=dataConfigJson.getJSONObject("Input");

            return ResultUtils.success(inputJson);
        }catch (Exception e){
            log.error(e.getMessage());
            return ResultUtils.error("get input data set err");
        }
    }



    // 调用模型前处理
    public JsonResult handleInvoke(JSONObject lists, String email) {
        if (lists == null)
            return ResultUtils.error();

        lists.put("username", email);

//        ComputableModel computableModel=computableModelDao.findFirstById(lists.getString("oid"));
        ResourceModel resourceModel = resourceModelDao.findById(lists.getString("oid")).get();
        //长三角这里pid就是md5前端不传了
        lists.put("pid", resourceModel.getMd5());

        String mdlStr=resourceModel.getMdl();
        JSONObject mdlJson= Utils.convertMdl(mdlStr);
        // System.out.println(mdlJson);
        JSONObject mdl=mdlJson.getJSONObject("mdl");
        JSONArray states=mdl.getJSONArray("states");
        //截取RelatedDatasets字符串

        JSONArray outputs=new JSONArray();
        for(int i=0;i<states.size();i++){
            JSONObject state=states.getJSONObject(i);
            JSONArray events=state.getJSONArray("event");
            for(int j=0;j<events.size();j++){
                JSONObject event=events.getJSONObject(j);
                String eventType=event.getString("eventType");
                if(eventType.equals("noresponse")){
                    JSONObject output=new JSONObject();
                    output.put("statename",state.getString("name"));
                    output.put("event",event.getString("eventName"));
                    JSONObject template=new JSONObject();

                    JSONArray dataArr=event.getJSONArray("data");
                    if(dataArr!=null) {
                        JSONObject data = dataArr.getJSONObject(0);
                        String dataType = data.getString("dataType");
                        if (dataType.equals("external")) {
                            String externalId = data.getString("externalId");

                            template.put("type", "id");
                            template.put("value", externalId.toLowerCase());
                            output.put("template", template);

                        } else if (dataType.equals("internal")) {
                            JSONArray nodes = data.getJSONArray("nodes");
                            if (nodes != null) {
                                if(data.getString("schema")!=null) {
                                    template.put("type", "schema");
                                    template.put("value", data.getString("schema"));
                                    output.put("template", template);
                                }else{
                                    template.put("type", "none");
                                    template.put("value", "");
                                    output.put("template", template);
                                }
                            } else {
                                template.put("type", "none");
                                template.put("value", "");
                                output.put("template", template);
                            }
                        } else {
                            template.put("type", "none");
                            template.put("value", "");
                            output.put("template", template);
                        }
                    }else {
                        template.put("type", "none");
                        template.put("value", "");
                        output.put("template", template);
                    }
                    outputs.add(output);
                }
            }
        }
        lists.put("outputs",outputs);


        JSONObject result = invoke(lists);


        if (result == null) {
            return ResultUtils.error("invoke failed!");
        } else {
            Task task = new Task();
            task.setComputableId(lists.getString("oid"));
            task.setComputableName(resourceModel.getName());
            task.setTaskId(result.getString("tid"));
            task.setEmail(email);
            task.setIntegrate(false);
            task.setPermission("private");
            // task.setIp(lists.getString("ip"));
            // task.setPort(lists.getInteger("port"));
            task.setIp(result.getString("ip"));
            task.setPort(result.getInteger("port"));
            task.setRunTime(new Date());
            task.setStatus(0);
            JSONArray inputs = lists.getJSONArray("inputs");
            task.setInputs(JSONObject.parseArray(inputs.toJSONString(), TaskData.class));
            task.setOutputs(null);
//                for(int i=0;i<inputs.size();i++)
//                {
//                    JSONObject input=inputs.getJSONObject(i);
//                    BeanUtils.copyProperties(input,);
//                }

            taskDao.save(task);

            resourceModelDao.save(resourceModel);

            return ResultUtils.success(result);
        }
    }


    // 调用模型
    public JSONObject invoke(JSONObject lists) {

        JSONObject result = postJSON("http://" + managerServerIpAndPort + "/GeoModeling/computableModel/invoke", lists);

        if (result != null) {
            if (result.getInteger("code") == 1) {

                // return result.getJSONObject("data").getString("tid");
                // 由于做任务合并，打开模型信息界面时的服务器可能与调用模型的服务器不一样，
                // 所以请求完这个数据时应该对任务的ip和port进行修改
                // 有用到invoke方法的我都进行了修改，如果之后有错的话再改
                return result.getJSONObject("data");
            }
        }

        return null;
    }


    public static JSONObject postJSON(String urlStr, JSONObject jsonParam) {
        try {

            //System.out.println(obj);
            // 创建url资源
            URL url = new URL(urlStr);
            // 建立http连接
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            // 设置允许输出
            conn.setDoOutput(true);

            conn.setDoInput(true);

            // 设置不用缓存
            conn.setUseCaches(false);
            // 设置传递方式
            conn.setRequestMethod("POST");
            // 设置维持长连接
            conn.setRequestProperty("Connection", "Keep-Alive");
            // 设置文件字符集:
            conn.setRequestProperty("Charset", "UTF-8");
            //转换为字节数组
            byte[] data = (jsonParam.toJSONString()).getBytes();

            // 设置文件长度
            conn.setRequestProperty("Content-Length", String.valueOf(data.length));

            // 设置文件类型:
            conn.setRequestProperty("Content-Type", "application/json; charset=UTF-8");


            // 开始连接请求
            conn.connect();
            OutputStream out = conn.getOutputStream();
            // 写入请求的字符串
            out.write(data);
            out.flush();
            out.close();

            // System.out.println(conn.getResponseCode());
            // System.out.println(conn.getResponseMessage());

            // 请求返回的状态
            if (conn.getResponseCode() == 200) {
                // System.out.println("连接成功");
                // 请求返回的数据
                InputStream in = conn.getInputStream();
                String a = null;
                try {
                    byte[] data1 = new byte[in.available()];
                    in.read(data1);
                    // 转成字符串
                    a = new String(data1);
                    // System.out.println(a);
                    return JSONObject.parseObject(a);
                } catch (Exception e1) {
                    e1.printStackTrace();
                    return null;
                }
            } else {
                // System.out.println("no++");
                return null;
            }

        } catch (Exception e) {
            // System.out.println(e);
            return null;
        }

    }

    public JsonResult getMdlById(String modelId) {
        try{
            ResourceModel resourceModel= resourceModelDao.findById(modelId).get();
            String mdlString=resourceModel.getMdl();
            JSONObject mdl= Utils.convertMdl(mdlString);
            return ResultUtils.success(mdl);
        }catch (Exception e){
            return ResultUtils.error(e.getMessage());
        }
    }


    public JsonResult upToDataContainer(String userDataId, String dataRelativePath) {
        try {
            // 用户中心的资源 上传到 数据容器
            File file = new File(dataStoreDir,dataRelativePath);
            if(!file.exists()){
                return ResultUtils.error("文件不存在");
            }
            FileInputStream fileInputStream = new FileInputStream(file);
            MultipartFile multipartFile = new MockMultipartFile(file.getName(), file.getName(),
                    ContentType.APPLICATION_OCTET_STREAM.toString(), fileInputStream);

            MultiValueMap<String, Object> part = new LinkedMultiValueMap<>();
            part.add("datafile",multipartFile.getResource());
            part.add("userId","371252847@qq.com");
            part.add("serverNode","China");
            part.add("origination","YangzeDelta");
            JSONObject uploadResult=Utils.uploadDataToDataServer(dataContainerIpAndPort,part);
            if(uploadResult.getIntValue("code")==1){
                String dataUrl="http://"+ dataContainerIpAndPort +"/data/"+uploadResult.getJSONObject("data").getString("id");

                UserData u=userDataDao.findById(userDataId).get();
                u.setDataContainerUrl(dataUrl);
                userDataDao.save(u);

                return ResultUtils.success(dataUrl);
            }else{
                log.error(uploadResult.getString("message"));
                return ResultUtils.error("上传数据容器失败");
            }

        }catch (Exception e){
            log.error(e.getMessage());
            return ResultUtils.error("上传数据容器失败");
        }
    }

    /**
     * @param resDataId
     * @param labTaskId
     * @param dataRelativePath
     * @return: yangtzedeltasimulatorbackend.entity.doo.JsonResult
     * @Description:  上传资源目录或者处理后的资源到 数据容器
     * @Author: ZhaoYiming
     * @Date: 2022-8-4 21:55
     */
    public JsonResult upResToDataContainer(String resDataId, String labTaskId, String userId, String dataRelativePath) {
        try {
            // CASE 1.资源目录中的资源上传到数据容器 （资源目录中的单个（总的）数据直接添加到 数据容器，dataContainerUrl只临时保留在labTask中）
            // CASE 2.脚本处理后的数据上传数据容器  （脚本处理后理论上属于用户中心资源，有parentId，走的是上边的方法）
            // CASE 3.集数据上传数据容器（根据路径复制出来，打包成压缩包上传，压缩包添加到个人中心，但格式为压缩包，而不是集）
            Optional<LabTask> byId1 = labTaskDao.findById(labTaskId);
            if (!byId1.isPresent()) {
                return ResultUtils.error("上传失败失败，taskId错误！");
            }
            LabTask labTask = byId1.get();
            List<cn.hutool.json.JSONObject> dataList = new ArrayList<>();
            dataList = labTask.getDataList();
            cn.hutool.json.JSONObject resDataInfo = new cn.hutool.json.JSONObject();
            for(cn.hutool.json.JSONObject item : dataList){
                if(item.getStr("id") == resDataId){
                    resDataInfo = item;
                }
            }
            if(resDataInfo.getStr("id") == null || resDataInfo.getStr("id").equals("")){
                return ResultUtils.error("上传失败，未找到该数据信息");
            }
            // 判断类型（来自资源目录还是集）
            if(resDataInfo.getStr("visualType").equals("dataSet")){
                //集
                // 1.创建压缩文件
                String tempFolderPath = tempDir + "/" + resDataInfo.getStr("name");
                File tempFolder =new File(tempFolderPath);
                tempFolder.mkdir();
                cn.hutool.json.JSONArray dataSetList = new cn.hutool.json.JSONArray();
                dataSetList = resDataInfo.getJSONArray("dataSetList");
                if(dataSetList != null){
                    Iterator<Object> it = dataSetList.iterator();
                    while(it.hasNext()){
                        cn.hutool.json.JSONObject jo = (cn.hutool.json.JSONObject) it.next();
                        String joPath = dataStoreDir + jo.getStr("fileRelativePath");
                        String joName = jo.getStr("name");
                        File originFile = new File(joPath);
                        File targetFile = new File(tempFolderPath + "/" + joName.replace("_clip",""));
                        targetFile.createNewFile();
                        FileUtils.copyFileUsingStream(originFile,targetFile);
                    }
                }
                String zipPath = userDataDir + "/" + resDataInfo.getStr("name") + ".zip";
                File zipFile = new File(zipPath);
                FileOutputStream zipFos = new FileOutputStream(zipFile);
                FileUtils.toZip(tempFolderPath, zipFos,true);

                // 2.（压缩包）保存到个人中心
                UserData userData = new UserData();
                String fileName = zipFile.getName();
                Long fileSize = zipFile.length();
                userData.setName(fileName);
                userData.setType("file");
                userData.setVisualType("zip");
                userData.setSize(fileSize.toString());
                userData.setFileStoreName(fileName);
                userData.setFileWebAddress("/store/data/" + fileName);
                userData.setFileRelativePath("/data/" + fileName);
                userData.setPublicBoolean(true);
                userData.setVisualizationBoolean(true);
                userData.setParentId(labTaskId);
                userData.setUserId(userId);

                // 3.上传数据容器
                if(!zipFile.exists()){
                    return ResultUtils.error("文件不存在");
                }
                FileInputStream fileInputStream = new FileInputStream(zipFile);
                MultipartFile multipartFile = new MockMultipartFile(zipFile.getName(), zipFile.getName(),
                        ContentType.APPLICATION_OCTET_STREAM.toString(), fileInputStream);

                MultiValueMap<String, Object> part = new LinkedMultiValueMap<>();
                part.add("datafile",multipartFile.getResource());
                part.add("userId","371252847@qq.com");
                part.add("serverNode","China");
                part.add("origination","YangzeDelta");
                JSONObject uploadResult=Utils.uploadDataToDataServer(dataContainerIpAndPort,part);
                if(uploadResult.getIntValue("code")==1){
                    String dataUrl="http://"+ dataContainerIpAndPort +"/data/"+uploadResult.getJSONObject("data").getString("id");

                    resDataInfo.set("dataContainerUrl",dataUrl);
                    userData.setDataContainerUrl(dataUrl);
                    userDataDao.save(userData);

                    return ResultUtils.success(dataUrl);
                }else{
                    log.error(uploadResult.getString("message"));
                    return ResultUtils.error("上传数据容器失败");
                }
            } else {
                //资源目录
                File file = new File(dataStoreDir,dataRelativePath);
                if(!file.exists()){
                    return ResultUtils.error("文件不存在");
                }
                FileInputStream fileInputStream = new FileInputStream(file);
                MultipartFile multipartFile = new MockMultipartFile(file.getName(), file.getName(),
                        ContentType.APPLICATION_OCTET_STREAM.toString(), fileInputStream);

                MultiValueMap<String, Object> part = new LinkedMultiValueMap<>();
                part.add("datafile",multipartFile.getResource());
                part.add("userId","371252847@qq.com");
                part.add("serverNode","China");
                part.add("origination","YangzeDelta");
                JSONObject uploadResult=Utils.uploadDataToDataServer(dataContainerIpAndPort,part);
                if(uploadResult.getIntValue("code")==1){
                    String dataUrl="http://"+ dataContainerIpAndPort +"/data/"+uploadResult.getJSONObject("data").getString("id");

                    resDataInfo.set("dataContainerUrl",dataUrl);

                    return ResultUtils.success(dataUrl);
                }else{
                    log.error(uploadResult.getString("message"));
                    return ResultUtils.error("上传数据容器失败");
                }
            }
        }catch (Exception e){
            log.error(e.getMessage());
            return ResultUtils.error("上传数据容器失败");
        }
    }

    public JsonResult upXMLToDataContainer(MultipartFile upFile) {
        try {

            if (upFile.isEmpty()){
                return ResultUtils.error("文件为空");
            }

            String fileName = upFile.getOriginalFilename(); //eg: XXX.js
            String fileMainName= FileNameUtil.mainName(fileName); // XXX
            String fileExtName = FileNameUtil.extName(fileName); //js
            String fileNewName=IdUtil.objectId()+"."+fileExtName;
            File file = new File(tempDir,fileNewName);
            upFile.transferTo(file);

            FileInputStream fileInputStream = new FileInputStream(file);
            MultipartFile multipartFile = new MockMultipartFile(file.getName(), file.getName(),
                    ContentType.APPLICATION_OCTET_STREAM.toString(), fileInputStream);

            MultiValueMap<String, Object> part = new LinkedMultiValueMap<>();
            part.add("datafile",multipartFile.getResource());
            part.add("userId","371252847@qq.com");
            part.add("serverNode","China");
            part.add("origination","YangzeDelta");
            JSONObject uploadResult=Utils.uploadDataToDataServer(dataContainerIpAndPort,part);
            file.delete();
            if(uploadResult.getIntValue("code")==1){
                String dataUrl="http://"+ dataContainerIpAndPort +"/data/"+uploadResult.getJSONObject("data").getString("id");
                return ResultUtils.success(dataUrl);
            }else{
                log.error(uploadResult.getString("message"));
                return ResultUtils.error("上传数据容器失败");
            }

        }catch (Exception e){
            log.error(e.getMessage());
            return ResultUtils.error("上传数据容器失败");
        }
    }


    //以下三个数据请求不用了

    //三种可视化数据请求
//    public JsonResult getVisualData(String visualDataPath) {
//        try{
////            String visualDataPath="/SWAT/Data/Visualization/TestData/Tmp/TMP.json";
//            File visualDataFile = new File(modelsFolder,visualDataPath);
//            FileReader fileReader = new FileReader(visualDataFile);
//            JSONObject dataConfigJson = JSONObject.parseObject(fileReader.readString());
//            return ResultUtils.success(dataConfigJson);
//        }catch (Exception e){
//            return ResultUtils.error(e.getMessage());
//        }
//    }
//
//    public Object getShpJsonData(String shpJsonPath) {
//        try{
//            File visualDataFile = new File(modelsFolder,shpJsonPath);
//            FileReader fileReader = new FileReader(visualDataFile);
//            JSONObject ShpJson = JSONObject.parseObject(fileReader.readString());
//            return ShpJson;
//        }catch (Exception e){
//            return ResultUtils.error(e.getMessage());
//        }
//    }
//
//    public void getKmzData(String kmzDataPath, HttpServletResponse response) {
//        try{
//            File visualDataFile = new File(modelsFolder,kmzDataPath);
//            if (!visualDataFile.exists()) {
//                log.warn("file not exist: "+visualDataFile.getName());
//                return;
//            }
//
//            response.reset();
//            response.setContentType("application/octet-stream");
//            response.setCharacterEncoding("utf-8");
//            response.setContentLength((int) visualDataFile.length());
//            //解决页面下载框中文乱码问题
//            response.setHeader("Content-Disposition", "attachment;filename=" + new String(visualDataFile.getName().getBytes("UTF-8"),"iso-8859-1"));
////            response.addHeader("Access-Control-Allow-origin","http://172.21.213.15:8080");
//            response.addHeader("Access-Control-Allow-origin","*");
//
//            byte[] readBytes = FileUtil.readBytes(visualDataFile);
//            OutputStream os = response.getOutputStream();
//            os.write(readBytes);
//
//        }catch (Exception e){
//            log.error(e.getMessage());
//        }
//
//    }
}
