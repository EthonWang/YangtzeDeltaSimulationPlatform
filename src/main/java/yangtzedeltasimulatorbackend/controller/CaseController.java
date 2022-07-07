package yangtzedeltasimulatorbackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
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

//    @ApiOperation(value = "新建案例")
//    @PostMapping("/createCase")
//    public JsonResult createCase(@RequestBody CreateCaseDTO createCaseDTO){
//        return caseService.createCase(createCaseDTO);
//    }

}
