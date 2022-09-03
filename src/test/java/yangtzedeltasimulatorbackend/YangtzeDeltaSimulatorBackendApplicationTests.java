package yangtzedeltasimulatorbackend;

import cn.hutool.core.io.FileUtil;
import cn.hutool.core.io.file.FileReader;
import cn.hutool.core.util.CharsetUtil;
import cn.hutool.core.util.ZipUtil;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.entity.ContentType;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import yangtzedeltasimulatorbackend.dao.ModelItemDao;
import yangtzedeltasimulatorbackend.dao.QuestionDao;
import yangtzedeltasimulatorbackend.dao.ResourceDataDao;
import yangtzedeltasimulatorbackend.entity.doo.JsonResult;
import yangtzedeltasimulatorbackend.entity.po.QuestionItem;
import yangtzedeltasimulatorbackend.entity.po.ResourceData;
import yangtzedeltasimulatorbackend.service.LabTaskService;
import yangtzedeltasimulatorbackend.utils.GeoServerUtils;
import yangtzedeltasimulatorbackend.utils.MyFileUtils;
import yangtzedeltasimulatorbackend.utils.ResultUtils;
import yangtzedeltasimulatorbackend.utils.Utils;

import javax.swing.text.Style;
import java.io.*;
import java.lang.reflect.Member;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.nio.charset.Charset;
import java.nio.file.Paths;
import java.text.MessageFormat;
import java.text.SimpleDateFormat;
import java.util.*;

@Slf4j
@SpringBootTest
class YangtzeDeltaSimulatorBackendApplicationTests {

    @Autowired
    ModelItemDao modelItemDao;

    @Autowired
    QuestionDao questionDao;

    @Autowired
    ResourceDataDao resourceDataDao;

    @Value("${dataStoreDir}"+"/models")
    private  String modelsFolder;


    @Value("${dataStoreDir}")
    String dataStoreDir;

    //远程数据容器地址
    @Value("${dataContainerIpAndPort}")
    String dataContainerIpAndPort;

    @Test
    void contextLoads() {
    }

    @Test
    void fileIO(){
        String filePath=modelItemDao.findByModelName("SWAT").getModelDataConfigPath();
        FileReader fileReader = new FileReader(filePath);
        String result = fileReader.readString();
        JSONObject o= JSONObject.parseObject(result);
    }

    @Test
    void tree(){
        JSONObject temp=new JSONObject();
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
                String dataConfigPath=modelItemDao.findByModelName(q.getModelRelateList().get(j)).getModelDataConfigPath();
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
        System.out.println(treeList);
    }


    @Test
    void readVisualData(){
        String visualDataPath="/SWAT/Data/Visualization/TestData/Tmp/TMP.json";
        File visualDataFile = new File(modelsFolder,visualDataPath);
        FileReader fileReader = new FileReader(visualDataFile);
        JSONObject dataConfigJson = JSONObject.parseObject(fileReader.readString());
        System.out.println();
    }

    @Test
    void uploadDataToDataContainer() throws IOException {
        String dataConfigPath="E:\\GitProject\\YangtzeDataStore\\models\\SWAT/config.json";

        FileReader fileReader = new FileReader(dataConfigPath);
        JSONObject dataConfigJson = JSONObject.parseObject(fileReader.readString());
        JSONObject dataInputObject=dataConfigJson.getJSONObject("Input");

        for (String dataSetName : dataInputObject.keySet()) {  //遍历模型包含的每个输入数据集
            JSONArray dataSetArray= dataInputObject.getJSONArray(dataSetName);
            for(int i=0;i<dataSetArray.size();i++){
                JSONObject oneInput=dataSetArray.getJSONObject(i);
                dataConfigJson.getJSONObject("Input").getJSONArray(dataSetName).getJSONObject(i).put("dataUrl","123");

            }
        }
        BufferedWriter out = new BufferedWriter(new FileWriter(dataConfigPath));
        out.write(JSONObject.toJSONString(dataConfigJson));
        out.close();

    }

    @Test
    void uploadFileToUserServer() {
        try{
            File file = new File("E://0-0-0.jpg");
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
                System.out.println(dataUrl);
            }
        }catch (Exception e){
            log.error(e.getMessage());
        }


    }

    @Test
    void nothing(){
        FileUtil.del("D://aaa.txt");
    }

    @Test
    void del(){
        String a="1";
        String b="2";
        String c="2";

        List<String> list=new ArrayList<>();
        list.add(a);
    }

    @Test
    void execTest(){
        Process proc;

//        String pyName="test.py";
//        String scriptsDir=ClassLoader.getSystemResource("static/myScripts/").getPath().substring(1);
//        String pyPath=scriptsDir+pyName;
//
//        List<String> list1=new ArrayList<>();
//        list1.add("python");
//        list1.add(pyPath);
//
//        List<String> list=new ArrayList<>();
//        list.add("3");
//        list.add("4");
//
//        list1.addAll(list);
//
//        String []args=list1.toArray(new String[list1.size()]);
//        String []args2={"5","6"};

        try {
//            String cmdString= MessageFormat.format("python {0}",pyPath);
//            String cmdString2= "cmd /c python  E:/GitProject/YangtzeDeltaSimulatorBackend/target/classes/static/myScripts/test.py E:\\del\\aa.txt";
            String cmdString3="cmd /c python E:/GitProject/YangtzeDeltaSimulatorBackend/target/classes/static/myScripts/GDAL_clip.py E:\\del\\YangtzeRiverDeltaBoundary_1983.shp E:\\del\\yangtzeRiver_landuse.tif E:\\del\\wwww.tif";

            proc = Runtime.getRuntime().exec(cmdString3);// 执行py文件

            //获取错误输入流
            BufferedReader err = new BufferedReader(new InputStreamReader(proc.getErrorStream()));
            String errLine = null;
            while ((errLine = err.readLine()) != null) {
                log.info("errStream: "+errLine);
            }
            err.close();

            //获取正常输入流
            BufferedReader in = new BufferedReader(new InputStreamReader(proc.getInputStream()));
            String inLine = null;
            while ((inLine = in.readLine()) != null) {
                log.info("inputStream: "+inLine);
            }
            in.close();


            int exitVal =proc.waitFor(); //返回值如果是0表示正常结束
            System.out.println(exitVal);
        } catch (Exception e) {
            System.out.println(e.getMessage());;
        }
    }

    @Test
    void file2Geoserver() throws MalformedURLException, FileNotFoundException {

//        GeoServerUtils.PublishTiff("yangtzeRiver","landuse_1983","D:\\zym\\opengms\\yangtzeRiver\\GDAL_test\\landuse_1983.tif");
        GeoServerUtils.PublishShape("yangtzeRiver","out2", "out2",null,"D:\\zym\\opengms\\yangtzeRiver\\geojson2shpTest\\out2.shp");
    }

    @Test
    void filezip(){
        File unzip = ZipUtil.unzip("E:\\del\\ccc.zip","E:\\del\\ccc");
//        File file=new File("E:\\del\\aaa\\aab4e3f3-d984-4fc8-a2a9-e25b617de2d5.zip");
//        FileUtil.rename(file,"aaa",true,true);
    }

    @Test
    void del22(){
        String url="http://221.226.60.2:8082/data/1d5c8da2-6767-4886-a3d3-b2b4cb708962";
        File file = MyFileUtils.downloadRemoteData(url, "E://");
        System.out.println("aa");
    }

    @Test
    void resDataAddPageviews(){
        List<ResourceData> all = resourceDataDao.findAll();
        for (int i = 0; i < all.size(); i++) {
            ResourceData item = all.get(i);
            item.setPageviews(0);
            resourceDataDao.save(item);
        }
    }
    @Test
    void getResByDataView(){
        List<ResourceData> allByPageviews = resourceDataDao.findAll();
        Collections.sort(allByPageviews, (o1, o2) -> o1.getPageviews()-o2.getPageviews());
        System.out.println(allByPageviews);
//        return ResultUtils.success(allByPageviews.subList(0,6));
    }

    @Test
    void changePNG(){
        String path = "/store/resourceData/63117680a5c5103c515731ab.png";
        ResourceData resourceData = resourceDataDao.findById("6304dc3ca5c57662d9f9bdca").get();
        resourceData.setImgWebAddress(path);
        resourceData.setImgRelativePath("/resourceData/63117680a5c5103c515731ab.png");
        resourceData.setImgStoreName("63117680a5c5103c515731ab.png");
        resourceDataDao.save(resourceData);
    }

    @Test
    void resDataFilesize2Long(){
        List<ResourceData> allByPageviews = resourceDataDao.findAll();
        for (int i = 0; i < allByPageviews.size(); i++) {
            ResourceData item = allByPageviews.get(i);
            Long filesize = Long.valueOf(item.getFileSize());
//            System.out.println(filesize);
            item.setFilesizeLong(filesize);
            resourceDataDao.save(item);
        }
    }

}
