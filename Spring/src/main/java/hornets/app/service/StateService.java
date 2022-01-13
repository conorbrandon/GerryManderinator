package hornets.app.service;

import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.Base64;
import java.util.Comparator;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.core.io.support.ResourcePatternUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;
import hornets.app.projections.StateSelectionProj;
import hornets.app.repository.StateRepository;

@Service
public class StateService {

    private StateRepository stateRepo;
    private ResourceLoader resourceLoader;

    @Autowired
    public StateService(StateRepository stateRepo, ResourceLoader resourceLoader) {
        this.stateRepo = stateRepo;
        this.resourceLoader = resourceLoader;
    }

    public StateSelectionProj getStateSelection(String stateAbbr) {
        StateSelectionProj proj = stateRepo.findByStateAbbr(stateAbbr, StateSelectionProj.class);
        return proj;
    }

    public String getPrecinctsGeoJson(String stateAbbr) {
        String precincts = null;
        try {
            Resource r = resourceLoader.getResource("classpath:precincts-geojson/" + stateAbbr + ".json");
            precincts = FileCopyUtils.copyToString(new InputStreamReader(r.getInputStream()));
        } catch (IOException e) {
            e.printStackTrace();
        }
        return precincts;
    }


    public List<String> getAllCandidateImgs(String stateAbbr) {
        Resource[] imgResources = null;
        try {
            imgResources = ResourcePatternUtils
            .getResourcePatternResolver(resourceLoader)
            .getResources("classpath:candidate-png/" + stateAbbr + "/*.png");
            List<String> imgs = Arrays.stream(imgResources)
            .sorted(new ResComparator())
            .map(r -> {
                try {
                    byte[] imgBytes = FileUtils.readFileToByteArray(r.getFile());
                    return Base64.getEncoder().encodeToString(imgBytes);
                } catch (IOException e) {
                    e.printStackTrace();
                }
                return null;
            }).toList();
            return imgs;
        } catch(IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    // unused at the moment, keep in case we need to switch back to svg
    public List<String> getAllCandidateSvgs(String stateAbbr) {
        Resource[] svgResources = null;
        try {
            svgResources = ResourcePatternUtils
            .getResourcePatternResolver(resourceLoader)
            .getResources("classpath:candidate-svg/" + stateAbbr + "/*.svg");
            List<String> svgs = Arrays.stream(svgResources)
            .sorted(new ResComparator())
            .map(r -> {
                try {
                    return FileCopyUtils.copyToString(new InputStreamReader(r.getInputStream()));
                } catch (IOException e) {
                    e.printStackTrace();
                }
                return null;
            }).toList();
            return svgs;
        } catch(IOException e) {
            System.out.println(e.getMessage());
        }
        return null;
    }  


    // Comparator for sorting resources by candidate id
    // filenames of form 'AZ-1.svg', 'NV-3.png', etc.
    class ResComparator implements Comparator<Resource> {

        @Override
        public int compare(Resource r1, Resource r2) {
            int id1 = getIdFromFilename(r1.getFilename());
            int id2 = getIdFromFilename(r2.getFilename());
            return id1 - id2;
        }

        private int getIdFromFilename(String fn) {
            int start = fn.indexOf("-") + 1;
            int end = fn.indexOf(".");
            return Integer.parseInt(fn.substring(start, end));
        }
    }
}
