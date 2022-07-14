package yangtzedeltasimulatorbackend.entity.dto.labTask;

import cn.hutool.json.JSONObject;
import lombok.Data;
import yangtzedeltasimulatorbackend.entity.po.ResourceModel;

import java.util.List;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/6/11
 **/
@Data
public class UpdateLabTaskDTO {

    String name;
    String description;

    boolean publicBoolean;
    String problemTags="";  //地理问题标签
    List<JSONObject> dataList;
    List<ResourceModel> modelList;

}
