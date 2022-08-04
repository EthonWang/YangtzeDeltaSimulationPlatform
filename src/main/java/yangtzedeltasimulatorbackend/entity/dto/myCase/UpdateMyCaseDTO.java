package yangtzedeltasimulatorbackend.entity.dto.myCase;

import com.alibaba.fastjson.JSONObject;
import lombok.Data;

import java.util.List;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/7/6
 **/
@Data
public class UpdateMyCaseDTO {
    String name;
    String thumbnail;
    String path;
    String theme;

    List<JSONObject> description;
    List<JSONObject> dataList;
    List<JSONObject> caseAuthor;
}
