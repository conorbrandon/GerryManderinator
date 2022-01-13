package hornets.app.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import hornets.app.service.SampleService;

@Controller
public class SampleController {

    private final SampleService sampleService;

    @Autowired
    SampleController(SampleService sampleService) {
        this.sampleService = sampleService;
    }

    @PostMapping(value="/startLongTask")
    @ResponseBody
    public ResponseEntity<String> startLongTask() throws JsonProcessingException {
        // DeferredResult<ResponseEntity<String>> res = new DeferredResult<>();
        this.sampleService.doLongTask();
        // res.setResult(ResponseEntity.ok("Started long task"));
        // return res;
        return ResponseEntity.ok("started");
    }

    @GetMapping(value="/getSample")
    @ResponseBody
    public ResponseEntity<Integer> getSample() {
        int sample = this.sampleService.getSample();
        return ResponseEntity.ok(sample);
    }

}
