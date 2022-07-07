package yangtzedeltasimulatorbackend.entity.dto.script;

import cn.hutool.json.JSONObject;
import lombok.Data;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/6/28
 **/

@Data
public class GDALClipDTO {
    String inputGeoJson;
    String inputShpPath;
    String inputRasterPath;
    String outputTifName;
    Boolean isShp;
}
