package yangtzedeltasimulatorbackend.service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import yangtzedeltasimulatorbackend.dao.MyCaseDao;
import yangtzedeltasimulatorbackend.dao.ResourceDataDao;
import yangtzedeltasimulatorbackend.entity.doo.JsonResult;
import yangtzedeltasimulatorbackend.entity.dto.myCase.CreateMyCaseDTO;
import yangtzedeltasimulatorbackend.entity.dto.myCase.GetResourceDataDTO;
import yangtzedeltasimulatorbackend.entity.dto.myCase.UpdateMyCaseDTO;
import yangtzedeltasimulatorbackend.entity.po.MyCase;
import yangtzedeltasimulatorbackend.entity.po.ResourceData;
import yangtzedeltasimulatorbackend.utils.ResultUtils;

import java.util.List;
import java.util.Optional;


/**
 * @Description
 * @Author wyjq
 * @Date 2022/3/17
 */

@Slf4j
@Service
public class MyCaseService {

    @Autowired
    MyCaseDao myCaseDao;

    @Autowired
    ResourceDataDao resourceDataDao;

    public JsonResult createCase(CreateMyCaseDTO createMyCaseDTO) {
        try{

            MyCase c=new MyCase();
            BeanUtils.copyProperties(createMyCaseDTO,c);
            myCaseDao.save(c);

            return ResultUtils.success("创建案例成功");
        }catch (Exception e){
            return ResultUtils.error("创建案例失败");
        }
    }

    public JsonResult getAllCase() {
        try{
            List<MyCase> allMyCase = myCaseDao.findAll();
            return ResultUtils.success(allMyCase);
        }catch (Exception e){
            return ResultUtils.error("获取案例列表失败");
        }
    }

    public JsonResult deleteCaseById(String caseId) {
        try{
            myCaseDao.deleteById(caseId);
            return ResultUtils.success("删除案例成功");
        }catch (Exception e){
            return ResultUtils.error("删除案例失败");
        }
    }

    public JsonResult getCaseById(String caseId) {
        try{
            MyCase c = myCaseDao.findById(caseId).get();
            return ResultUtils.success(c);
        }catch (Exception e){
            return ResultUtils.error("获取案例失败");
        }
    }


    public JsonResult updateCase(String caseId, UpdateMyCaseDTO updateMyCaseDTO) {
        try{
            MyCase myCase=myCaseDao.findById(caseId).get();
            BeanUtils.copyProperties(updateMyCaseDTO,myCase);
            myCaseDao.save(myCase);
            return ResultUtils.success("更新案例成功");
        }catch (Exception e){
            return ResultUtils.error("更新案例失败");
        }
    }

    public JsonResult getResourceDataListInfo(GetResourceDataDTO getResourceDataDTO) {
        try{
            JSONArray array=new JSONArray();
            List<JSONObject> idList=getResourceDataDTO.getIds();
            for(int i=0;i<idList.size();i++){
                JSONObject dataObject=idList.get(i);
                String dataId=dataObject.getString("id");
                ResourceData resourceData =resourceDataDao.findById(dataId).get();
                dataObject.put("name",resourceData.getName());
                dataObject.put("imgWebAddress",resourceData.getImgWebAddress());
                array.add(dataObject);
            }
            return ResultUtils.success(array);
        }catch (Exception e){
            log.error(e.getMessage());
            return ResultUtils.error("获取案例失败");
        }
    }
}
