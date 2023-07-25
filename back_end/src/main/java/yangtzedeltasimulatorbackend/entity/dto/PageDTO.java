package yangtzedeltasimulatorbackend.entity.dto;

import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * @Description
 * @Author wyjq
 * @Date 2022/3/17
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PageDTO implements Serializable {
    @ApiModelProperty(value = "当前页数", example = "1")
    private Integer page = 1; //当前页数
    @ApiModelProperty(value = "每页数量", example = "10")
    private Integer pageSize = 10; //每页数量
    @ApiModelProperty(value = "是否顺序，从小到大", example = "false")
    private Boolean asc = false; //是否顺序，从小到大
    @ApiModelProperty(value = "查询内容", example = "")
    private String searchText = ""; //查询内容
    @ApiModelProperty(value = "排序字段", example = "createTime")
    private String sortField = "createTime"; //排序字段
}

