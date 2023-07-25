package yangtzedeltasimulatorbackend.entity.dto.theme;

import com.alibaba.fastjson.JSONObject;
import lombok.Data;

import java.util.List;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/6/10
 **/
@Data
public class GetCasesDTO {
    List<JSONObject>  ids;
}
