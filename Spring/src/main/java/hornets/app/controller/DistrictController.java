package hornets.app.controller;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import com.fasterxml.jackson.core.JsonProcessingException;

import java.util.Collection;

import hornets.app.projections.DistrictSummaryProj;
import hornets.app.repository.DistrictRepository;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
public class DistrictController {
	//REMOVE THESE ONCE CODE IS IMPLEMENTED PROPERLY
	//Do not add to constants, we dont need these, these are only here for testing
	private static final int NUM_CANDIDATES = 30;
    private static final Set<String> validStates = new HashSet<>(Arrays.asList("AZ", "GA", "NV")); //If this project had more states, we would add them here.

	private DistrictRepository districtRepository;

	@Autowired
	public DistrictController(DistrictRepository districtRepository) {
		this.districtRepository = districtRepository;
	}

    @GetMapping(value = "/getDistrictStats/{stateAbbr}/{candidateId}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Collection<DistrictSummaryProj>> getDistrictStats(@PathVariable String stateAbbr, @PathVariable int candidateId) throws JsonProcessingException {
		if (!validStates.contains(stateAbbr)) { 
			ResponseEntity.status(HttpStatus.FORBIDDEN).body("invalid state: " + stateAbbr + "!");
		}
        if (candidateId < 0 || candidateId > NUM_CANDIDATES) {
            ResponseEntity.status(HttpStatus.FORBIDDEN).body("invalid candidateId: " + candidateId + "!");
        }
		Collection<DistrictSummaryProj> districtStats = districtRepository.findByCandidateIdAndStateAbbr(candidateId, stateAbbr);
		if (districtStats != null) {
			return ResponseEntity.ok(districtStats);
		}
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
	}

	// NOT USED
    // @GetMapping(value = "/getAllDistrictStats/{stateAbbr}", produces = MediaType.APPLICATION_JSON_VALUE)
	// public ResponseEntity<String> getAllDistrictStats(@PathVariable String stateAbbr) throws JsonProcessingException {
	// 	if (!validStates.contains(stateAbbr)) {
	// 		ResponseEntity.status(HttpStatus.FORBIDDEN).body("invlaid state: " + stateAbbr + "!");
	// 	}
	// 	String jsonStats = "";
	// 	return ResponseEntity.ok(jsonStats);
	// }
}
