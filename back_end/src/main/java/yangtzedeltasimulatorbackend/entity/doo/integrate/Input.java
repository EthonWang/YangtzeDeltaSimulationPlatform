package yangtzedeltasimulatorbackend.entity.doo.integrate;

import lombok.Data;

import java.util.List;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/4/6
 **/

@Data
public class Input {
    String eventName;
    String stateName;
    String eventID;
    String eventDesc;

    List<Param> params;
}
