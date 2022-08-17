package yangtzedeltasimulatorbackend.entity.dto.model;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/8/12
 **/

@Data
public class SaveResultDataDTO {
    String userId;
    String labId;
    List<String> dataUrlList;
}
