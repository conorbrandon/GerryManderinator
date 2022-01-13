package hornets.app.repository;

import java.util.Collection;

import org.springframework.data.repository.CrudRepository;

import hornets.app.model.Precinct;

public interface PrecinctRepository extends CrudRepository<Precinct, Long> {
    
    Collection<Precinct> findByStateAbbr(String stateAbbr);
}
