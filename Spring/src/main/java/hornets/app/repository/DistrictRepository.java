package hornets.app.repository;

import org.springframework.data.repository.CrudRepository;
import hornets.app.model.District;

import java.util.Collection;

import hornets.app.projections.DistrictSummaryProj;

public interface DistrictRepository extends CrudRepository<District, Long>{

    Collection<DistrictSummaryProj> findByCandidateIdAndStateAbbr(int candidateId, String stateAbbr);

}
