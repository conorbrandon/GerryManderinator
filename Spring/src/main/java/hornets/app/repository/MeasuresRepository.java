package hornets.app.repository;

import org.springframework.data.repository.CrudRepository;

import hornets.app.model.Measures;

public interface MeasuresRepository extends CrudRepository<Measures, Long> {
    
}
