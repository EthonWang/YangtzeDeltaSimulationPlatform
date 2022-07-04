package yangtzedeltasimulatorbackend.entity.dto.theme;

import ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy;
import com.alibaba.fastjson.JSONObject;
import lombok.Data;

import java.util.List;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/6/10
 **/


@Data
public class UpdateThemeDTO {
    String id;
    String name;
    String introduction;
    List<JSONObject>  description;
    List<JSONObject> relatedCases;
    List<JSONObject> relateData;
}
