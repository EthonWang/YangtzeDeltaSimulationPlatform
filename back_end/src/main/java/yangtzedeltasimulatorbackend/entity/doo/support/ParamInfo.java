package yangtzedeltasimulatorbackend.entity.doo.support;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/4/6
 **/

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ParamInfo {
    String eventName;
    String eventDesc;
    String eventType;
    String value;
}
