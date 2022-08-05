package yangtzedeltasimulatorbackend.entity.dto.user;

import lombok.Data;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/6/11
 **/
@Data
public class UpdateFolderDTO {
    String id;
    String name;
    boolean publicBoolean=false;
    String description;
    String problemTags="";  //地理问题标签
}
