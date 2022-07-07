package yangtzedeltasimulatorbackend.entity.dto;

import com.alibaba.fastjson.JSONObject;

import java.util.List;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/7/6
 **/
public class CreateCaseDTO {
    String name;
    String thumbnail;
    String path;
    String theme;

    List<JSONObject> description;
    List<JSONObject> dataList;
    List<JSONObject> caseAuthor;
}
