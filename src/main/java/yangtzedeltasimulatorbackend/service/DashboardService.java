package yangtzedeltasimulatorbackend.service;

import io.swagger.annotations.ApiOperation;
import org.apache.tomcat.util.http.fileupload.FileUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import yangtzedeltasimulatorbackend.entity.doo.JsonResult;
import yangtzedeltasimulatorbackend.entity.doo.support.DistrictRainfall;
import yangtzedeltasimulatorbackend.entity.dto.dashboard.SortDTO;
import yangtzedeltasimulatorbackend.utils.MyFileUtils;
import yangtzedeltasimulatorbackend.utils.ResultUtils;
import yangtzedeltasimulatorbackend.utils.Utils;

import java.io.File;
import java.text.DecimalFormat;
import java.util.*;
import java.util.function.BiFunction;

/**
 * @Description
 * @Author bin
 * @Date 2022/05/25
 */
@Service
public class DashboardService {

    @Value("${dataStoreDir}")
    private String dataStoreDir;

    public JsonResult sortRainfallByDistrict(SortDTO sortDTO) {

        Map<String, DistrictRainfall> districtMap = calcRainfall("district");
        if (districtMap == null)
            return ResultUtils.error();

        //计算每个区域平均降水量
        Map<String, Double> avgMap = calcAvgRainfall(districtMap);

        //对结果排序
        List<Map.Entry<String, Double>> result = Utils.sortTreeMap(avgMap, sortDTO.getIsAsc());
        result = sortDTO.getCount() <= result.size() ? result.subList(0, sortDTO.getCount()) : result;

        return ResultUtils.success(result);
    }

    private Map<String, Double> calcAvgRainfall(Map<String, DistrictRainfall> districtMap) {
        Map<String, Double> avgMap = new TreeMap<>();
        for (Map.Entry<String, DistrictRainfall> entry : districtMap.entrySet()) {
            String key = entry.getKey();
            DistrictRainfall value = entry.getValue();
            avgMap.put(key, Utils.twoDecimalPlaces(value.getTotal() / value.getCount()));
        }
        return avgMap;
    }

    public JsonResult getDailyRainfallByDistrict(SortDTO sortDTO) {

        Map<String, DistrictRainfall> districtMap = calcRainfall("district");
        if (districtMap == null)
            return ResultUtils.error();

        //计算每个区域平均降水量
        Map<String, Double> avgMap = calcAvgRainfall(districtMap);

        //对结果排序
        List<Map.Entry<String, Double>> result = Utils.sortTreeMap(avgMap, sortDTO.getIsAsc());
        result = sortDTO.getCount() <= result.size() ? result.subList(0, sortDTO.getCount()) : result;

        //得到结果对应的每个区域的降水量信息
        Map<String, List<Double>> dailyResult = new HashMap<>();
        for (Map.Entry<String, Double> res : result) {
            List<Double> dailyList = new ArrayList<>();
            String key = res.getKey();
            DistrictRainfall rainfall = districtMap.get(key);
            Map<String, Double> daily = rainfall.getDaily();
            for (Map.Entry<String, Double> entry : daily.entrySet()) {
                dailyList.add(Utils.twoDecimalPlaces(entry.getValue()));
            }
            dailyResult.put(key, dailyList);

        }
        return ResultUtils.success(dailyResult);
    }

    /**
     * @param aggKey 聚合字段 ("district")
     **/
    private Map<String, DistrictRainfall> calcRainfall(String aggKey){
        Map map = null;
        try {
//            File file = ResourceUtils.getFile("classpath:static/output.json");
            File file=new File(dataStoreDir,"output.json");
            map = MyFileUtils.readJson(file);
        }catch (Exception e){
            e.printStackTrace();
        }

        if (map == null)
            return null;

        //key：区域；value：该区域降水量对象
        Map<String, DistrictRainfall> districtMap = new HashMap<>();

        List<Map> features = (List) map.get("features");

        for (Map feature : features) {

            Map<String, Object> properties = (Map) feature.get("properties");

            // System.out.println(properties);

            Object o = properties.get(aggKey);
            String district = null;
            if (o instanceof String){
                district = (String)properties.get(aggKey);
            } else {
                continue;
            }
            if (district == null){
                continue;
            }
//            String district = (String)properties.get(aggKey);

            if (districtMap.containsKey(district)){
                // map中有该district了直接拿，没有put进去新的
                DistrictRainfall districtRainfall = districtMap.get(district);
                //计算该区域降雨量
                calcRainfallByProperties(properties, districtRainfall);

                //该区域点数量+1
                int count = districtRainfall.getCount();
                count++;
                districtRainfall.setCount(count);
                districtMap.put(district, districtRainfall);
            } else {
                DistrictRainfall districtRainfall = new DistrictRainfall(0, 1,
                    new TreeMap<>(new Comparator<String>() {
                        @Override
                        public int compare(String str1, String str2) {
                            //对降雨量的key排序
                            return str1.compareTo(str2);
                        }
                    }));
                calcRainfallByProperties(properties, districtRainfall);
                districtMap.put(district, districtRainfall);
            }

        }


        return districtMap;
    }

    //根据Properties计算降雨量
    private DistrictRainfall calcRainfallByProperties(Map<String, Object> properties, DistrictRainfall rainfall) {
        double total = rainfall.getTotal();
        Map<String, Double> daily = rainfall.getDaily();
        for (Map.Entry<String, Object> entry : properties.entrySet()) {
            String mapKey = entry.getKey();
            Object mapValue = entry.getValue();
            // System.out.println(mapKey + "：" + mapValue);
            if (mapKey.contains("rainData")){
                //计算总降雨量
                total += Double.valueOf(mapValue.toString());

                //计算每日降雨量
                if (!daily.containsKey(mapKey)){
                    // 初始化
                    daily.put(mapKey, Double.valueOf(mapValue.toString()));
                } else {
                    Double dailyRain = daily.get(mapKey);
                    dailyRain += Double.valueOf(mapValue.toString());
                    daily.put(mapKey,dailyRain);
                }
            }
        }
        rainfall.setTotal(total);

        return rainfall;
    }
}
