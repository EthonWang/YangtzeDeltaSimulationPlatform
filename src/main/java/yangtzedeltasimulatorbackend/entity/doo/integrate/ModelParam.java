package yangtzedeltasimulatorbackend.entity.doo.integrate;

import lombok.Data;
import yangtzedeltasimulatorbackend.entity.doo.integrate.Input;

import java.util.List;

@Data
public class ModelParam {
    String mId;
    List<Input> inputs;
}
