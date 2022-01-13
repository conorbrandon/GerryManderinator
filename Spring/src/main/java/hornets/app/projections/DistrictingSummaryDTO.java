package hornets.app.projections;

import hornets.app.model.Measures;

import lombok.Value;

@Value
public class DistrictingSummaryDTO {

    Measures measures;
    Long id;
    String stateAbbr;
    int candidateId;

}