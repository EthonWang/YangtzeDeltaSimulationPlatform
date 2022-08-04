package yangtzedeltasimulatorbackend.service;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import yangtzedeltasimulatorbackend.dao.MyCaseDao;
import yangtzedeltasimulatorbackend.entity.doo.JsonResult;
import yangtzedeltasimulatorbackend.entity.dto.myCase.CreateMyCaseDTO;
import yangtzedeltasimulatorbackend.entity.dto.myCase.UpdateMyCaseDTO;
import yangtzedeltasimulatorbackend.entity.po.MyCase;
import yangtzedeltasimulatorbackend.utils.ResultUtils;

import java.util.List;
import java.util.Optional;


/**
 * @Description
 * @Author wyjq
 * @Date 2022/3/17
 */

@Service
public class MyCaseService {

    @Autowired
    MyCaseDao myCaseDao;

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
}
