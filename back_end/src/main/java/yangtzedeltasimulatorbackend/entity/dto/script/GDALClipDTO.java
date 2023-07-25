package yangtzedeltasimulatorbackend.entity.dto.script;

import com.alibaba.fastjson.JSONObject;
import lombok.Data;

import java.util.ArrayList;

@Data
public class GDALClipDTO {
    String inputGeoJson;
    String inputShpPath;
    String inputRasterPath;
    ArrayList<JSONObject> inputRasterListPath;
    String outputTifName;
    Boolean isShp;
}
