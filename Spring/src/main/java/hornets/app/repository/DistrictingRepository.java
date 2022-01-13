package hornets.app.repository;

import org.springframework.data.repository.CrudRepository;
import hornets.app.model.Districting;

import java.util.Collection;
import java.util.List;

import hornets.app.projections.DistrictingGeojsonProj;
import hornets.app.projections.DistrictingSummaryDTO;
import hornets.app.projections.DistrictingSummaryProj;

public interface DistrictingRepository extends CrudRepository<Districting, Long>{
    
    // DistrictingGeojsonProj findFirstByCandidateIdAndStateAbbr(int candidateId, String stateAbbr);
    Collection<DistrictingSummaryProj> findByStateAbbr(String stateAbbr);

    Districting findFirstByCandidateIdAndStateAbbr(int candidateId, String stateAbbr);


}
