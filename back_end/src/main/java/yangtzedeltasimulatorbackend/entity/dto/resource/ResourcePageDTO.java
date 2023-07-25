package yangtzedeltasimulatorbackend.entity.dto.resource;

import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import yangtzedeltasimulatorbackend.entity.dto.PageDTO;

import java.io.Serializable;

/**
 * @Description
 * @Author wyjq
 * @Date 2022/3/17
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResourcePageDTO extends PageDTO {
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
    @ApiModelProperty(value = "tag类型", example = "problemTags")
    private String tagClass = "problemTags"; //标签的类型
    @ApiModelProperty(value = "tag的值", example = "全球变化与区域环境演化")
    private String tagName = "全球变化与区域环境演化"; //标签的名字

}

