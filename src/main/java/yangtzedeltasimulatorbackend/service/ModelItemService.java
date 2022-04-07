package yangtzedeltasimulatorbackend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import yangtzedeltasimulatorbackend.dao.ModelItemDao;
import yangtzedeltasimulatorbackend.entity.JsonResult;
import yangtzedeltasimulatorbackend.entity.ModelItem;
import yangtzedeltasimulatorbackend.utils.ResultUtils;

import java.util.List;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/4/6
 **/
@Service
public class ModelItemService {

    @Autowired
    ModelItemDao modelItemDao;

    public JsonResult saveModelItem(ModelItem modelItem){
        modelItemDao.save(modelItem);
        return ResultUtils.success();
    }

    public JsonResult getModelItemList() {
        List<ModelItem> modelItems= modelItemDao.findAll();
        return ResultUtils.success(modelItems);
    }
}
