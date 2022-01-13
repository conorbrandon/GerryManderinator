package hornets.app.repository;

import java.util.Collection;

import org.springframework.data.repository.CrudRepository;

import hornets.app.model.County;

public interface CountyRepository extends CrudRepository<County, Long> {
    
    Collection<County> findByStateAbbr(String stateAbbr);
}
