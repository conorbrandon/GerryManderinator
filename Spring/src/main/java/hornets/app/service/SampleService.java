package hornets.app.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.TimeUnit;

@Service
public class SampleService {

    private AtomicInteger sample;

    @Autowired
    public SampleService() {
        this.sample = new AtomicInteger();
    }

    @Async
    public void doLongTask() { // if this has return type needs to be some kind of Future
        for (int i = 0; i < 100; i++) {
            this.setSample(i);
            try {
                TimeUnit.SECONDS.sleep(10);
            } catch (InterruptedException ex) {
                System.out.println(ex.getMessage());
            }
        }
    }


    public Integer getSample() {
        return this.sample.get();
    }

    public void setSample(int sample) {
        this.sample.set(sample);
    }

}
