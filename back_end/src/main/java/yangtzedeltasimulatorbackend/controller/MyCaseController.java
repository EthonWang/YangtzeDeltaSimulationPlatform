package yangtzedeltasimulatorbackend.controller;

import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import yangtzedeltasimulatorbackend.entity.doo.JsonResult;
import yangtzedeltasimulatorbackend.entity.dto.myCase.CreateMyCaseDTO;
import yangtzedeltasimulatorbackend.entity.dto.myCase.GetResourceDataDTO;
import yangtzedeltasimulatorbackend.entity.dto.myCase.UpdateMyCaseDTO;
import yangtzedeltasimulatorbackend.entity.dto.theme.GetCasesDTO;
import yangtzedeltasimulatorbackend.service.MyCaseService;

/**
 * @Description
 * @Author wyjq
 * @Date 2022/05/25
 */

@CrossOrigin
@RestController
@RequestMapping(value="/case")
public class MyCaseController {

    @Autowired
    MyCaseService myCaseService;

    @ApiOperation(value = "新建案例")
    @PostMapping("/createCase")
    public JsonResult createCase(@RequestBody CreateMyCaseDTO createMyCaseDTO){
        return myCaseService.createCase(createMyCaseDTO);
    }


    @ApiOperation(value = "获取全部案例列表")
    @GetMapping("/getAllCase")
    public JsonResult getAllCase(){
        return myCaseService.getAllCase();
    }

    @ApiOperation(value = "删除案例")
    @GetMapping("/deleteCaseById/{caseId}")
    public JsonResult deleteCaseById(@PathVariable("caseId") String caseId){
        return myCaseService.deleteCaseById(caseId);
    }

    @ApiOperation(value = "根据id获取案例")
    @GetMapping("/getCaseById/{caseId}")
    public JsonResult getCaseById(@PathVariable("caseId") String caseId){
        return myCaseService.getCaseById(caseId);
    }

    @ApiOperation(value = "更新案例")
    @PostMapping("/updateCase/{caseId}")
    public JsonResult updateCase(@PathVariable("caseId") String caseId,
                                 @RequestBody UpdateMyCaseDTO updateMyCaseDTO){
        String name=updateMyCaseDTO.getName();
        return myCaseService.updateCase(caseId,updateMyCaseDTO);
    }

    @ApiOperation(value = "案例中批量查询资源数据信息")
    @PostMapping("/getResourceDataListInfo")
    public JsonResult getResourceDataListInfo(@RequestBody GetResourceDataDTO getResourceDataDTO){
        return myCaseService.getResourceDataListInfo(getResourceDataDTO);
    }

}
