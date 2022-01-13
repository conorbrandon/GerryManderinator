package hornets.app.projections;

import java.util.Map;

import hornets.app.model.ElectionType;
import hornets.app.model.MeasureType;
import hornets.app.model.Measures;
import hornets.app.model.RacialType;

public interface DistrictingSummaryProj {
    Long getId();
    String getStateAbbr();
    int getCandidateId();
    Measures getMeasures(); // this is the issue
    
}
