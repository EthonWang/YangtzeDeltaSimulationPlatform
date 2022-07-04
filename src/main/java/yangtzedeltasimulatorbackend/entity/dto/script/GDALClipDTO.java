package yangtzedeltasimulatorbackend.entity.dto.script;

import lombok.Data;

/**
 * @Description
 * @Auther wyjq
 * @Date 2022/6/28
 **/

@Data
public class GDALClipDTO {
    String inputShp;
    String inputRaster;
    String outputTif;
}
