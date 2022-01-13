package hornets.app.repository;

import org.springframework.data.repository.CrudRepository;

import hornets.app.model.CensusBlock;

public interface CensusBlockRepository extends CrudRepository<CensusBlock, String> {
    
}
