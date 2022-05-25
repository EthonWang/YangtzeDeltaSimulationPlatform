package yangtzedeltasimulatorbackend.entity.dto.dashboard;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * @Description
 * @Author bin
 * @Date 2022/05/25
 */
@Data
public class SortDTO {

    @ApiModelProperty(value = "返回的结果数量", example = "10")
    int count; //返回的结果数量
    @ApiModelProperty(value = "是否升序(1:升序; -1:降序)", example = "-1")
    int isAsc; //是否升序(1:升序; -1:降序)

}
