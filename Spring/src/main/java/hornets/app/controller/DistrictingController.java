package hornets.app.controller;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.FileCopyUtils;

import com.fasterxml.jackson.core.JsonProcessingException;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.Collection;
import java.util.List;

import hornets.app.projections.DistrictingGeojsonProj;
import hornets.app.projections.DistrictingSummaryDTO;
import hornets.app.projections.DistrictingSummaryProj;
import hornets.app.repository.DistrictingRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;

@RestController
public class DistrictingController {

	private DistrictingRepository districtingRepository;
	private ResourceLoader resourceLoader;

	@Autowired
	public DistrictingController(DistrictingRepository districtingRepository,
		ResourceLoader resourceLoader) {
		this.districtingRepository = districtingRepository;
		this.resourceLoader = resourceLoader;
	}

	@GetMapping(value = "/getDistrictingMeasures/{stateAbbr}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Collection<DistrictingSummaryProj>> getDistrictingMeasures(@PathVariable String stateAbbr) throws JsonProcessingException {
		Collection<DistrictingSummaryProj> districtingMeasures = districtingRepository.findByStateAbbr(stateAbbr);
		if (districtingMeasures != null) {
			return ResponseEntity.ok(districtingMeasures);
		}
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
	}

    @GetMapping(value = "/getCandidateGeoJson/{stateAbbr}/{candidateId}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> getCandidateGeoJson(@PathVariable String stateAbbr, @PathVariable int candidateId) throws JsonProcessingException {
		String path = String.format("classpath:candidate-geojson/%s/%s-districts.json", stateAbbr, Integer.toString(candidateId));
		String geoJson = loadResourceAsString(path);
		if (geoJson != null) {
			return ResponseEntity.ok(geoJson);
		}
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
	}

	public String loadResourceAsString(String path) {
        Resource r = resourceLoader.getResource(path);
        String s = null;
        try (Reader reader = new InputStreamReader(r.getInputStream())) {
            s = FileCopyUtils.copyToString(reader);
        } catch (IOException e) {
            System.out.println(e.getMessage());
        }
        return s;
    }
}
