package hornets.app.projections;

import java.util.Map;
import hornets.app.model.Demographics;
import hornets.app.model.Election;
import hornets.app.model.ElectionType;
import hornets.app.model.PopulationType;

public interface StateSelectionProj {
    String getStateAbbr();
    String getLongName();
    int getNumDistricts();
    Map<PopulationType, Demographics> getDemographics();
    Map<ElectionType, Election> getElections();
    String getCountiesGeoJson();
    String getBoxWhiskerData();
    double getLatitude();
    double getLongitude();
    double getMapZoom();
}