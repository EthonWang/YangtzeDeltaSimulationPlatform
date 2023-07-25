package yangtzedeltasimulatorbackend.entity.doo.support;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

/**
 * @Description 各区域降水量
 * @Author bin
 * @Date 2022/05/25
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DistrictRainfall {

    double total; //区域总降水量
    int count; //区域点数量
    Map<String, Double> daily; //区域几天降雨量

}
