package yangtzedeltasimulatorbackend.controller;

import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import yangtzedeltasimulatorbackend.component.LoginRequired;
import yangtzedeltasimulatorbackend.entity.doo.JsonResult;
import yangtzedeltasimulatorbackend.utils.ResultUtils;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/4/6
 **/

@CrossOrigin
@RestController
public class HelloWorldController {

//    @LoginRequired
    @ApiOperation(value = "HelloWorld测试")
    @GetMapping("/hello")
    public JsonResult handle(){
        return ResultUtils.success("okkkkk!");
    }



}
