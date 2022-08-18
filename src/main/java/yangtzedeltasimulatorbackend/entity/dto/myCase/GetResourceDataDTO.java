package yangtzedeltasimulatorbackend.entity.dto.myCase;

import com.alibaba.fastjson.JSONObject;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/6/10
 **/
@Data
public class GetResourceDataDTO {
    List<JSONObject>  ids=new ArrayList<>();
}
