package yangtzedeltasimulatorbackend.entity.dto.script;


import lombok.Data;

@Data
public class TxtAnalysisDTO {
    String inputFeaturesName;
    String inputTxtPath;
    String type;
    String chartsType;
    String dateNum;
}
