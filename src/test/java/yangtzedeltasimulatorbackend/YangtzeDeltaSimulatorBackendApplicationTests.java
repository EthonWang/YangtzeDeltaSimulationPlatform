package yangtzedeltasimulatorbackend;

import cn.hutool.core.io.file.FileReader;
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
import org.springframework.web.multipart.MultipartFile;
import yangtzedeltasimulatorbackend.dao.ModelItemDao;
import yangtzedeltasimulatorbackend.dao.QuestionDao;
import yangtzedeltasimulatorbackend.entity.po.QuestionItem;
import yangtzedeltasimulatorbackend.utils.Utils;

import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@SpringBootTest
class YangtzeDeltaSimulatorBackendApplicationTests {

    @Autowired
    ModelItemDao modelItemDao;

    @Autowired
    QuestionDao questionDao;

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
        JSONArray deleteFolders=new JSONArray();
        deleteFolders.add("00");
        List<String> t=new ArrayList<>();
        t.add("1");
        t.add("2");
        t.add("3");
        deleteFolders.addAll(t);
    }


}
