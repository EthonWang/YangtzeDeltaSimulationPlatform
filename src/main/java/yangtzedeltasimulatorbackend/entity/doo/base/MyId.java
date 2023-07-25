package yangtzedeltasimulatorbackend.entity.doo.base;

import cn.hutool.core.util.IdUtil;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.springframework.data.annotation.Id;

import java.util.UUID;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/5/12
 **/

@Data
public class MyId {

    @Id
    @ApiModelProperty(value = "id",hidden = true)
    String id= IdUtil.objectId();
}
