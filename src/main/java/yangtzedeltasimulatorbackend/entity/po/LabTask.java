package yangtzedeltasimulatorbackend.entity.po;

import cn.hutool.core.util.IdUtil;
import cn.hutool.json.JSONObject;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.springframework.data.annotation.Id;

import java.util.List;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/6/11
 **/
@Data
public class LabTask {
    @Id
    @ApiModelProperty(value = "id",hidden = true)
    String id= IdUtil.objectId();

    String name;
    String description;

    boolean publicBoolean;
    List<String> problemTags;  //地理问题标签
    List<JSONObject> dataList;
    List<ResourceModel> modelList;

    String userId;

    String labId;

}
