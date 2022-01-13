package hornets.app.repository;

import org.springframework.data.repository.CrudRepository;

import hornets.app.model.Election;

public interface ElectionRepository extends CrudRepository<Election, Long> {
    
}
