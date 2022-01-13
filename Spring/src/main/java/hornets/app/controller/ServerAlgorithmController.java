package hornets.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import hornets.app.service.ServerAlgorithmService;
import hornets.app.util.AlgorithmStatus;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

@RestController
public class ServerAlgorithmController {

	private ServerAlgorithmService saService;

	@Autowired
	public ServerAlgorithmController(ServerAlgorithmService saService) {
		this.saService = saService;
	}
    
    @PostMapping(value = "/validateUserParams/{params}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> validateUserParams(@PathVariable String params) {
		if (saService.isValidUserParams(params)) {
			return ResponseEntity.ok("Valid request!");
		}
		return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid request: bad numbers");
	}

	@PostMapping(value = "/startServerAlgorithm", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> startServerAlgorithm() {
		if (saService.startAlgorithm()) {
			return ResponseEntity.ok("Server algorithm finished!");
		}
		return ResponseEntity.status(HttpStatus.FORBIDDEN).body("no current generation in progress!");
	}

	@GetMapping(value = "/getUpdatedAlgorithmStatus", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> getUpdatedAlgorithmStatus() {
		String jsonStatus = saService.getUpdatedAlgorithmStatus();
		System.out.println("Update requested");
		if (jsonStatus == null) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body("no current generation in progress!");
		}
		return ResponseEntity.ok(jsonStatus);
	}

	@GetMapping(value = "/getFinalAlgorithmStatus", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> getFinalAlgorithmStatus() {
		String jsonStatus = saService.getFinalAlgorithmStatus();
		if (jsonStatus == null) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body("no current generation in progress!");
		}
		return ResponseEntity.ok(jsonStatus);
	}

	@GetMapping(value = "/pauseAlgorithm", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> pauseAlgorithm() {
		System.out.println("Attempting to pause");
		if (saService.setAlgorithmStatus(AlgorithmStatus.PAUSED)) {
			System.out.println("Paused!");
			return ResponseEntity.ok("paused");
		}
		System.out.println("Pause failed");
		return ResponseEntity.status(HttpStatus.FORBIDDEN).body("no current generation in progress!");
	}

	@GetMapping(value = "/resumeAlgorithm", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> resumeAlgorithm() {
		return startServerAlgorithm();
	}

	@GetMapping(value = "/stopAlgorithm", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> stopAlgorithm() {
		System.out.println("Stopping algorithm from client");
		if (saService.setAlgorithmStatus(AlgorithmStatus.STOPPED)) {
			return ResponseEntity.ok("paused");
		}
		return ResponseEntity.status(HttpStatus.FORBIDDEN).body("no current generation in progress!");
	}

}
