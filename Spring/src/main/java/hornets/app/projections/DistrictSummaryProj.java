package hornets.app.projections;

import hornets.app.model.PopulationType;
import hornets.app.model.Demographics;
import hornets.app.model.ElectionType;
import hornets.app.model.Election;

import java.util.Map;

public interface DistrictSummaryProj {
    Long getId();
    String getStateAbbr();
    int getCandidateId();
    int getDistrictNumber();
    Map<PopulationType, Demographics> getDemographics();
    Map<ElectionType, Election> getElections();
    double getGraphCompactness();
    double getPolsbyPopper();
    int getNumSplitCounties();
}