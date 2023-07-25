package yangtzedeltasimulatorbackend.entity.po;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;
import yangtzedeltasimulatorbackend.entity.doo.base.MyId;

import java.util.Date;
import java.util.List;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/5/27
 **/

@Data
public class Theme extends MyId {
    String name;
    String introduction;
    List<JSONObject> description;
    List<JSONObject> relatedCases;
    List<JSONObject> relateData;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss",timezone="GMT+8")
    Date createTime=new Date(); //
}
