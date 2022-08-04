package yangtzedeltasimulatorbackend.controller;

import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import yangtzedeltasimulatorbackend.entity.doo.JsonResult;
import yangtzedeltasimulatorbackend.entity.dto.theme.GetCasesDTO;
import yangtzedeltasimulatorbackend.entity.dto.theme.ThemeDTO;
import yangtzedeltasimulatorbackend.entity.dto.theme.UpdateThemeDTO;
import yangtzedeltasimulatorbackend.entity.po.Theme;
import yangtzedeltasimulatorbackend.service.ThemeService;
import yangtzedeltasimulatorbackend.utils.ResultUtils;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/4/6
 **/
@RestController
public class ThemeController {

    @Autowired
    ThemeService themeService;

//    @LoginRequired
    @ApiOperation(value = "保存主题信息")
    @PostMapping("/saveTheme")
    public JsonResult saveTheme(@RequestBody ThemeDTO themeDTO){
        return themeService.saveTheme(themeDTO);
    }

//    @ApiOperation(value = "更新主题信息")
//    @PostMapping("/updateTheme")
//    public JsonResult updateTheme(@RequestBody UpdateThemeDTO updateThemeDTO){
//        return themeService.updateTheme(updateThemeDTO);
//    }

    @ApiOperation(value = "根据名称获取主题信息")
    @GetMapping("/getTheme/{themeName}")
    public JsonResult getTheme(@PathVariable("themeName") String themeName){
        return themeService.getTheme(themeName);
    }

    @ApiOperation(value = "专题页上传图片")
    @PostMapping("/uploadThemeImg")
    public JsonResult uploadThemeImg(@RequestPart("file") MultipartFile uploadImg){
        return themeService.uploadThemeImg(uploadImg);
    }

    @ApiOperation(value = "批量查询案例信息")
    @PostMapping("/getCasesInfo")
    public JsonResult getCasesInfo(@RequestBody GetCasesDTO getCasesDTO){
        return themeService.getCasesInfo(getCasesDTO);
    }

}
