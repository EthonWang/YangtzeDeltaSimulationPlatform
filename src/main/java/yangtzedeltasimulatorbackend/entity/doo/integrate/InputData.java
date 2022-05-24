package yangtzedeltasimulatorbackend.entity.doo.integrate;

import lombok.Data;
import yangtzedeltasimulatorbackend.entity.doo.integrate.DataTemplate;

import java.util.ArrayList;

/**
 * @Author: wangming
 * @Date: 2019-11-15 21:24
 */
@Data
public class InputData {
    private ArrayList<DataTemplate> inputs;
}
