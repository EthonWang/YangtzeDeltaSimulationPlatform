package yangtzedeltasimulatorbackend.service;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import yangtzedeltasimulatorbackend.entity.doo.JsonResult;
import yangtzedeltasimulatorbackend.entity.dto.CreateCaseDTO;
import yangtzedeltasimulatorbackend.entity.dto.PageDTO;
import yangtzedeltasimulatorbackend.utils.ResultUtils;


/**
 * @Description
 * @Author wyjq
 * @Date 2022/3/17
 */

@Service
public class CaseService {

    public JsonResult createCase(CreateCaseDTO createCaseDTO) {
        try{
            return ResultUtils.success();
        }catch (Exception e){
            return ResultUtils.error();
        }
    }
}
