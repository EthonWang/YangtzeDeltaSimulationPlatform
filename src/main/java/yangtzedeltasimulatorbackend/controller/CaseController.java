package yangtzedeltasimulatorbackend.controller;

import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import yangtzedeltasimulatorbackend.entity.doo.JsonResult;
import yangtzedeltasimulatorbackend.entity.dto.CreateCaseDTO;
import yangtzedeltasimulatorbackend.service.CaseService;

/**
 * @Description
 * @Author wyjq
 * @Date 2022/05/25
 */
@RestController
@RequestMapping(value="/case")
public class CaseController {

    @Autowired
    CaseService caseService;

    @ApiOperation(value = "新建案例")
    @PostMapping("/createCase")
    public JsonResult createCase(@RequestBody CreateCaseDTO createCaseDTO){
        return caseService.createCase(createCaseDTO);
    }

}
