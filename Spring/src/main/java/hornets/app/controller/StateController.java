package hornets.app.controller;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import hornets.app.projections.StateSelectionProj;
import hornets.app.service.StateService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.util.List;

import com.fasterxml.jackson.core.JsonProcessingException;

@RestController
public class StateController {

	private StateService stateService;

	@Autowired
	public StateController(StateService stateService) {
		this.stateService = stateService;
	}

    @GetMapping(value = "/selectState/{stateAbbr}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<StateSelectionProj> selectState(@PathVariable String stateAbbr) throws JsonProcessingException {
		StateSelectionProj selectedStateData = stateService.getStateSelection(stateAbbr);
		if (selectedStateData != null) {
			return ResponseEntity.ok(selectedStateData);
		}
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
	}

	@GetMapping(value="/getPrecinctsGeoJson/{stateAbbr}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> getPrecinctsGeoJson(@PathVariable String stateAbbr) throws JsonProcessingException {
		String precinctsGeoJson = stateService.getPrecinctsGeoJson(stateAbbr);
		if (precinctsGeoJson != null) {
			return ResponseEntity.ok(precinctsGeoJson);
		}
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
	}

	@GetMapping(value="/getAllCandidateImgs/{stateAbbr}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<String>> getAllCandidateImgs(@PathVariable String stateAbbr) throws JsonProcessingException {
		List<String> candidateImgs = stateService.getAllCandidateImgs(stateAbbr);
		if (candidateImgs != null) {
			return ResponseEntity.ok(candidateImgs);
		}
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
	}

	@GetMapping(value="/getAllCandidateSvgs/{stateAbbr}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<String>> getAllCandidateSvgs(@PathVariable String stateAbbr) throws JsonProcessingException {
		List<String> candidateImgs = stateService.getAllCandidateSvgs(stateAbbr);
		if (candidateImgs != null) {
			return ResponseEntity.ok(candidateImgs);
		}
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
	}
}