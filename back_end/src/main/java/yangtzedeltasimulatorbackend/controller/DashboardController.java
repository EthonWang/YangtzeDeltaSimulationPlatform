package yangtzedeltasimulatorbackend.controller;

import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import yangtzedeltasimulatorbackend.entity.doo.JsonResult;
import yangtzedeltasimulatorbackend.entity.dto.dashboard.SortDTO;
import yangtzedeltasimulatorbackend.service.DashboardService;

/**
 * @Description
 * @Author bin
 * @Date 2022/05/25
 */
@CrossOrigin
@RestController
@RequestMapping(value="/dashboard")
public class DashboardController {

    @Autowired
    DashboardService dashboardService;

    @ApiOperation(value = "降雨量排名")
    @PostMapping("/sortRainfallByDistrict")
    public JsonResult sortRainfallByDistrict(@RequestBody SortDTO sortDTO){

        return dashboardService.sortRainfallByDistrict(sortDTO);
    }

    @ApiOperation(value = "每天降雨量, 返回的地区是通过降雨量排名得到的结果")
    @PostMapping("/getDailyRainfallByDistrict")
    public JsonResult getDailyRainfallByDistrict(@RequestBody SortDTO sortDTO){

        return dashboardService.getDailyRainfallByDistrict(sortDTO);
    }

}
