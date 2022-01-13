package hornets.app.repository;

import org.springframework.data.repository.CrudRepository;

import hornets.app.model.Demographics;

public interface DemographicsRepository extends CrudRepository<Demographics, Long> {
    
}
