package hornets.app.repository;


import org.springframework.data.repository.CrudRepository;
import hornets.app.model.State;
// import hornets.app.projections.StatePrecinctsGeoJsonProj;
// import hornets.app.projections.StateSelectionProj;

public interface StateRepository extends CrudRepository<State, String>{
    
    // don't need this anymore since stateAbbr is now the primary key
    // StateSelectionProj findFirstByStateAbbr(String stateAbbr); 

    // StateSelectionProj findByStateAbbr(String stateAbbr);

    <T> T findByStateAbbr(String stateAbbr, Class<T> type);
}
