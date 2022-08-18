package yangtzedeltasimulatorbackend.entity.po;

import cn.hutool.core.util.IdUtil;
import com.alibaba.fastjson.JSONObject;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.springframework.data.annotation.Id;
import yangtzedeltasimulatorbackend.entity.doo.base.MyId;

import java.util.Date;
import java.util.List;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/5/27
 **/

@Data
public class MyCase {
    @Id
    @ApiModelProperty(value = "id",hidden = true)
    String id= IdUtil.objectId();

    String name;
    String thumbnail;
    String path;
    String theme;

    String introduction;

    List<JSONObject> description;
    List<JSONObject> resourceDataList;
    List<JSONObject> caseAuthor;
    List<JSONObject> relatedResource;


    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss",timezone="GMT+8")
    Date createTime=new Date();
}
