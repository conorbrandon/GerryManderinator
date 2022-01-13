package hornets.app;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.apache.tomcat.util.bcel.Const;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.core.io.support.ResourcePatternUtils;
import org.springframework.stereotype.Component;
import org.springframework.util.FileCopyUtils;

import hornets.app.model.CensusBlock;
import hornets.app.model.County;
import hornets.app.model.Demographics;
import hornets.app.model.District;
import hornets.app.model.Districting;
import hornets.app.model.Election;
import hornets.app.model.ElectionType;
import hornets.app.model.MeasureType;
import hornets.app.model.Measures;
import hornets.app.model.PartyType;
import hornets.app.model.PopulationType;
import hornets.app.model.Precinct;
import hornets.app.model.RacialType;
import hornets.app.model.State;
import hornets.app.repository.CensusBlockRepository;
import hornets.app.repository.CountyRepository;
import hornets.app.repository.DemographicsRepository;
import hornets.app.repository.DistrictRepository;
import hornets.app.repository.DistrictingRepository;
import hornets.app.repository.ElectionRepository;
import hornets.app.repository.MeasuresRepository;
import hornets.app.repository.PrecinctRepository;
import hornets.app.repository.StateRepository;
import hornets.app.util.Constants;

@Component
public class DatabaseLoader implements CommandLineRunner{
    private final StateRepository stateRepo;
    private final DistrictingRepository districtingRepo;
    private final MeasuresRepository measuresRepo;
    private final DistrictRepository districtRepo;
    private final ElectionRepository electionsRepo;
    private final DemographicsRepository demographicsRepo;
    private final CensusBlockRepository censusRepo;
    private final PrecinctRepository precinctRepo;
    private final CountyRepository countyRepo;
    private final ObjectMapper mapper;
    private final ResourceLoader resourceLoader;


    @Autowired
    public DatabaseLoader(StateRepository srep, 
            DistrictingRepository dingrep, 
            MeasuresRepository mrep,
            DistrictRepository drep,
            ElectionRepository elRep,
            DemographicsRepository demRep,
            CensusBlockRepository cRep,
            PrecinctRepository pRep,
            CountyRepository countyRep,
            ObjectMapper om,
            ResourceLoader resourceLoader) {
        this.districtingRepo = dingrep;
        this.measuresRepo = mrep;
        this.districtRepo = drep;
        this.stateRepo = srep;
        this.electionsRepo = elRep;
        this.demographicsRepo = demRep;
        this.censusRepo = cRep;
        this.precinctRepo = pRep;
        this.countyRepo = countyRep;
        this.mapper = om;
        this.resourceLoader = resourceLoader;
    
    }


    @Override
    public void run(String... strings) throws Exception { // This will run on app startup
        long startTime = System.currentTimeMillis();
        // loadAndSaveAllButCensusBlocks();

        // we can safely remove census blocks and all associated demographics via deleteAll (or deleteById or deleteAllById)
        // txt


        long endTime = System.currentTimeMillis();
        long elapsedMillis = endTime - startTime;
        double elapsedMinutes = ((double) elapsedMillis) / 60000;
        System.out.println(String.format("Finished running in %f minutes", elapsedMinutes));
    }


    public void loadAndSaveAllButCensusBlocks() {

        State az = loadAndSaveState("AZ", "Arizona", 9, 34.5, -111.093735, 6);
        State nv = loadAndSaveState("NV", "Nevada", 4, 39, -115.8537227, 5.6);
        State ga = loadAndSaveState("GA", "Georgia", 14, 33, -82.900078, 6.35);
        List<State> states = Arrays.asList(az, nv, ga);

        // THIS WORKS!
        states.forEach(state -> {
            // save elections and demographics for state
            String abbr = state.getStateAbbr();
            Resource stateResource = resourceLoader.getResource("classpath:db-load/" + abbr + "/state.json");
            try {
                JsonNode root = mapper.readTree(stateResource.getFile());
                state.setElections(loadAndSaveElections(root));
                state.setDemographics(loadAndSaveDemographics(root));
            } catch (JsonProcessingException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }
            // save districtings with non-nested data
            List<Districting> districtings = loadAndSaveDistrictings(abbr);
            // add nested entities to districtings
            districtings.forEach(districting -> {
                int id = districting.getCandidateId();
                Set<District> districts = loadAndSaveDistricts(abbr, id);
                districting.setDistricts(districts);
                Measures measures = loadAndSaveMeasures(id, "classpath:db-load/" + abbr + "/districtingMeasures.json");
                districting.setMeasures(measures);
                districtingRepo.save(districting);
            });
            state.setDistrictings(districtings);
            this.stateRepo.save(state);
            System.out.println("Done with districtings for " + abbr);
            Map<String, County> counties = loadAndSaveCounties(abbr);
            Map<String, Precinct> precincts = loadAndSavePrecincts(abbr);
            System.out.println("Done with precincts for " + abbr);
        });

        // Resource districtNumCensusBlockResource = resourceLoader.getResource("classpath:db-load/" + abbr + "/districtnum-cb.json");

        // List<List<Districting>> districtingList = new ArrayList<>();
        // List<Map<String, County>> countiesList = new ArrayList<>();
        // List<Map<String, Precinct>> precinctsList = new ArrayList<>();

        // // load and save everything except census blocks
        // for (State state : states) {
        //     // save state election and demographic data
        //     String abbr = state.getStateAbbr();
        //     Resource stateResource = resourceLoader.getResource("classpath:db-load/" + abbr + "/state.json");
        //     try {
        //         JsonNode root = mapper.readTree(stateResource.getFile());
        //         state.setElections(loadAndSaveElections(root));
        //         state.setDemographics(loadAndSaveDemographics(root));
        //     } catch (JsonProcessingException e) {
        //         e.printStackTrace();
        //     } catch (IOException e) {
        //         e.printStackTrace();
        //     }
        //     // save districtings with non-nested data
        //     List<Districting> districtings = loadAndSaveDistrictings(abbr);
        //     for (Districting districting : districtings) {
        //         int id = districting.getCandidateId();
        //         Set<District> districts = loadAndSaveDistricts(abbr, id);
        //         districting.setDistricts(districts);
        //         Measures measures = loadAndSaveMeasures(id, "classpath:db-load/" + abbr + "/districtingMeasures.json");
        //         districting.setMeasures(measures);
        //         districtingRepo.save(districting);
        //     }
        //     districtingList.add(districtings);
        //     state.setDistrictings(districtings);
        //     this.stateRepo.save(state);
        //     System.out.println("Done with districtings for " + abbr);
        //     Map<String, County> counties = loadAndSaveCounties(abbr);
        //     countiesList.add(counties);
        //     Map<String, Precinct> precincts = loadAndSavePrecincts(abbr);
        //     precinctsList.add(precincts);
        //     System.out.println("Done with precincts for " + abbr);
        // }


        // save census blocks, precincts, counties, and assign precinct and county to each census block
        // Map<String, CensusBlock> censusBlocks = loadAndSaveCensusBlocks(abbr);
        
        // censusBlocks.values().forEach(block -> {
        //     block.setPrecinct(precincts.get(block.getPrecinctName()));
        //     block.setCounty(counties.get(block.getCountyName()));
        //     censusRepo.save(block);
        // });

        // assign set of census blocks to each district
        // districts.forEach(district -> {
        //     try {
        //         String idString = Integer.toString(id);
        //         String districtNumString = Integer.toString(district.getDistrictNumber());
        //         JsonNode districtNode = mapper.readTree(districtNumCensusBlockResource.getFile()).get(idString).get(districtNumString);
        //         districtNode.forEach(censusNode -> {
        //             district.getCensusBlocks().add(censusBlocks.get(censusNode.get("geo_id").asText()));
        //         });
        //         districtRepo.save(district);
        //     } catch (JsonProcessingException e) {
        //         e.printStackTrace();
        //     } catch (IOException e) {
        //         e.printStackTrace();
        //     }
        // });
    }

    /**
     * 
     *  ENTITY LOADING METHODS
     * 
     */


    public State loadAndSaveState(String stateAbbr, String longName, int numDistricts, double latitude, 
        double longitude, double mapZoom) {
        
        String countiesGeoJson = loadResourceAsString("classpath:db-load/" + stateAbbr + "/counties.json");
        String boxWhiskerData = loadResourceAsString("classpath:db-load/" + stateAbbr + "/boxWhisker.json");
        
        State s = State.builder()
            .stateAbbr(stateAbbr)
            .longName(longName)
            .numDistricts(numDistricts)
            .countiesGeoJson(countiesGeoJson)
            .boxWhiskerData(boxWhiskerData)
            .latitude(latitude)
            .longitude(longitude)
            .mapZoom(mapZoom)
            .build();
        return stateRepo.save(s);
    }


    public Map<ElectionType, Election> loadAndSaveElections(JsonNode node) {
        Map<ElectionType, Election> elections = new HashMap<>();
        for (ElectionType elType : ElectionType.values()) {
            elections.put(elType, Election.builder().votes(new HashMap<PartyType, Integer>()).build());
            for (PartyType pType : PartyType.values()) {
                JsonNode votes;
                if (pType == PartyType.DEMOCRATIC_PARTY) {
                    votes = node.get(elType.toString() + "D");
                } else {
                    votes = node.get(elType.toString() + "R");
                }
                if (votes != null) {
                    elections.get(elType).getVotes().put(pType, votes.asInt());
                } else {
                    elections.get(elType).getVotes().put(pType, null); // happens for USS18 and USS20
                }
            }
        }
        electionsRepo.saveAll(elections.values());
        return elections;
    }

    public Map<ElectionType, Election> loadAndSaveElections(String path) {
        Resource r = resourceLoader.getResource(path);
        Map<ElectionType, Election> elections = new HashMap<>();
        try {
            JsonNode root = mapper.readTree(r.getFile());
            for (ElectionType elType : ElectionType.values()) {
                elections.put(elType, Election.builder().votes(new HashMap<PartyType, Integer>()).build());
                for (PartyType pType : PartyType.values()) {
                    JsonNode votes;
                    if (pType == PartyType.DEMOCRATIC_PARTY) {
                        votes = root.get(elType.toString() + "D");
                    } else {
                        votes = root.get(elType.toString() + "R");
                    }
                    if (votes != null) {
                        elections.get(elType).getVotes().put(pType, votes.asInt());
                    } else {
                        elections.get(elType).getVotes().put(pType, null); // happens for USS18 and USS20
                    }
                }
            }
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        electionsRepo.saveAll(elections.values());
        return elections;
    }


    public Map<PopulationType, Demographics> loadAndSaveDemographics(JsonNode node) {
        Map<PopulationType, Demographics> demographics = new HashMap<>();
        for (PopulationType pType : PopulationType.values()) {
            demographics.put(pType, Demographics.builder().populations(new HashMap<RacialType, Integer>()).build());
            for (RacialType rType : RacialType.values()) {
                JsonNode pop = node.get(Constants.popKeys.get(pType) + Constants.raceKeysAlt.get(rType));
                if (pop != null) {
                    demographics.get(pType).getPopulations().put(rType, pop.asInt());
                } else {
                    demographics.get(pType).getPopulations().put(rType, null);
                }
            }
        }
        demographicsRepo.saveAll(demographics.values());
        return demographics;
    }

    public Map<PopulationType, Demographics> loadAndSaveDemographics(String path) {
        Resource r = resourceLoader.getResource(path);
        Map<PopulationType, Demographics> demographics = new HashMap<>();
        try {
            JsonNode root = mapper.readTree(r.getFile());
            for (PopulationType pType : PopulationType.values()) {
                demographics.put(pType, Demographics.builder().populations(new HashMap<RacialType, Integer>()).build());
                for (RacialType rType : RacialType.values()) {
                    JsonNode pop = root.get(Constants.popKeys.get(pType) + Constants.raceKeysAlt.get(rType));
                    if (pop != null) {
                        demographics.get(pType).getPopulations().put(rType, pop.asInt());
                    } else {
                        demographics.get(pType).getPopulations().put(rType, null);
                    }
                }
            }
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        demographicsRepo.saveAll(demographics.values());
        return demographics;
    }


    public List<Districting> loadAndSaveDistrictings(String stateAbbr) {
        List<Districting> districtings = new ArrayList<>();
        try {
            Resource[] geoJsonResources = ResourcePatternUtils
                .getResourcePatternResolver(resourceLoader)
                .getResources("classpath:db-load/" + stateAbbr + "/districtings/*.json");
            Arrays.stream(geoJsonResources)
                .sorted(new ResComparator()) // make sure sorted by candidate id
                .forEach(r -> {
                    String id = r.getFilename().split("-")[0]; // files should be named like "1-district.json"
                    Districting d = Districting.builder()
                        .stateAbbr(stateAbbr)
                        .candidateId(Integer.parseInt(id))
                        .build();
                    districtings.add(d);
                });
        } catch (IOException e) {
            e.printStackTrace();
        }
        districtingRepo.saveAll(districtings);
        return districtings;
    }


    public Set<District> loadAndSaveDistricts(String stateAbbr, int candidateId) {
        Set<District> districts = new HashSet<>();
        String id = Integer.toString(candidateId);
        String districtJsonPath = String.format("classpath:db-load/%s/districtings/%s-districts.json", stateAbbr, id);
        String districtingMeasuresPath = String.format("classpath:db-load/%s/districtingMeasures.json", stateAbbr);
        Resource districtJson = resourceLoader.getResource(districtJsonPath);
        Resource districtingMeasures = resourceLoader.getResource(districtingMeasuresPath);
        try {
            JsonNode features = mapper.readTree(districtJson.getFile()).get("features");
            JsonNode candidateMeasures = mapper.readTree(districtingMeasures.getFile()).get(id);
            Map<String, Set<Integer>> countyDistricts = new HashMap<>();
            for (JsonNode districtNode : features) {
                JsonNode properties = districtNode.get("properties");
                int districtNum = properties.get("District").asInt();
                String districtNumString = Integer.toString(districtNum);
                double graphCompactness = candidateMeasures.get("GTC_BY_DISTRICT").get(districtNumString).asDouble();
                double polsbyPopper = candidateMeasures.get("POL_POP_BY_DISTRICT").get(districtNumString).asDouble();
                // use counties to populate countyDistricts, which is used later to calculate numSplitCounties for each district
                JsonNode counties = candidateMeasures.get("COUNTIES_IN_DISTRICTS").get(districtNumString); 
                counties.forEach(county -> {
                    if (countyDistricts.keySet().contains(county.asText())) {
                        countyDistricts.get(county.asText()).add(districtNum);
                    } else {
                        countyDistricts.put(county.asText(), new HashSet<Integer>());
                    }
                });
                JsonNode opportunityRacesNode = candidateMeasures.get("OPPOR_DIST").get(Integer.toString(districtNum));
                List<String> opportunityRaces = new ArrayList<>();
                for (JsonNode race : opportunityRacesNode) {
                    if (!race.asText().equals("WHITE")) { opportunityRaces.add(race.asText()); }
                }
                District d = District.builder()
                    .stateAbbr(stateAbbr)
                    .candidateId(candidateId)
                    .districtNumber(districtNum)
                    .demographics(loadAndSaveDemographics(properties))
                    .elections(loadAndSaveElections(properties))
                    .graphCompactness(graphCompactness)
                    .polsbyPopper(polsbyPopper)
                    .opportunityRaces(opportunityRaces)
                    .build();
                districts.add(d);
            }
            // Now calculate numSplitCounties with the countyDistricts map we populated above
            districts.forEach(district -> {
                int numSplitCounties = 0;
                for (Set<Integer> set : countyDistricts.values()) {
                    if (set.contains(district.getDistrictNumber())) {
                        numSplitCounties++;
                    }
                }
                district.setNumSplitCounties(numSplitCounties);
            });
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        districtRepo.saveAll(districts);
        return districts;
    }


    public Map<String, County> loadAndSaveCounties(String stateAbbr) {
        Map<String, County> counties = new HashMap<>(); 
        Resource r = resourceLoader.getResource("classpath:db-load/" + stateAbbr + "/counties.json");
        try {
            JsonNode features = mapper.readTree(r.getFile()).get("features");
            features.forEach(feature -> {
                String countyName = feature.get("properties").get("NAME").asText();
                County county = County.builder()
                    .countyName(countyName)
                    .stateAbbr(stateAbbr)
                    .build();
                counties.put(countyName, county);
            });
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        countyRepo.saveAll(counties.values());
        return counties;
    }


    public Measures loadAndSaveMeasures(int candidateId, String path) {
        Resource r = resourceLoader.getResource(path);
        Measures measures = new Measures();
        List<Map<ElectionType, Double>> politicalDeviationsFromEnacted;
        String id = Integer.toString(candidateId);
        try {
            JsonNode candidateNode = mapper.readTree(r.getFile()).get(id);
            politicalDeviationsFromEnacted = loadPoliticalDevsFromEnacted(candidateNode);
            measures = Measures.builder()
                .districtingMeasures(loadDistrictingMeasures(candidateNode))
                .efficiencyGap(loadEfficiencyGap(candidateNode))
                .racialDevFromEnacted(loadRacialDevFromEnacted(candidateNode))
                .politicalDevFromEnactedD(politicalDeviationsFromEnacted.get(0))
                .politicalDevFromEnactedR(politicalDeviationsFromEnacted.get(1))
                .build();
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        measuresRepo.save(measures);
        return measures;
    }

    public Map<String, CensusBlock> loadAndSaveCensusBlocks(String stateAbbr) {
        Map<String, CensusBlock> censusBlocks = new HashMap<>();
        Map<Integer, CensusBlock> blocksByGraphId = new HashMap<>();
        Resource geoJsonFileResource = resourceLoader.getResource("classpath:db-load/" + stateAbbr + "/censusBlocks.json");
        Resource graphFileResource = resourceLoader.getResource("classpath:db-load/" + stateAbbr + "/censusBlocks-graph.json");
        try {
            JsonNode nodes = mapper.readTree(graphFileResource.getFile()).get("nodes");
            JsonNode features = mapper.readTree(geoJsonFileResource.getFile()).get("features");
            for (int i = 0; i < nodes.size(); i++) {
                if (i == (nodes.size() / 2)) { System.out.println("Halfway done with neighborless census blocks"); }
                JsonNode node = nodes.get(i);
                JsonNode feature = features.get(i);
                String geoId = node.get("GEOID20").asText();
                String precinctName = node.get("PCTNUM").asText();
                String countyName = node.get("COUNTY").asText();
                int graphId = node.get("id").asInt();
                String geoJson = feature.get("geometry").toString();
                Set<CensusBlock> neighbors = new HashSet<>();
                CensusBlock block = CensusBlock.builder()
                    .geoId(geoId)
                    .stateAbbr(stateAbbr)
                    .geoJson(geoJson)
                    .demographics(loadAndSaveDemographics(node))
                    .neighbors(neighbors)
                    .precinctName(precinctName) // link to precincts later
                    .countyName(countyName)
                    .graphId(graphId)
                    .build();
                censusBlocks.put(geoId, block);
                blocksByGraphId.put(graphId, block);
                censusRepo.save(block);
            }
            System.out.println("Done with neighborless census blocks");
            // Now populate neighbors
            JsonNode adjacency = mapper.readTree(graphFileResource.getFile()).get("adjacency");
            censusBlocks.values().forEach(block -> {
                JsonNode neighborNodes = adjacency.get(block.getGraphId());
                neighborNodes.forEach(node -> {
                    block.getNeighbors().add(blocksByGraphId.get(node.get("id").asInt()));
                });
                censusRepo.save(block);
            });
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return censusBlocks;
    }


   /**
    * 
    * @param stateAbbr
    * @param batchSize Number of census blocks to save to db
    */
    public void loadAndSaveCensusBlockBatch(String stateAbbr, int batchSize) {
        
    }


    public Map<String, Precinct> loadAndSavePrecincts(String stateAbbr) {
        Map<String, Precinct> precincts = new HashMap<>();
        Resource r = resourceLoader.getResource("classpath:/precincts-geojson/" + stateAbbr + ".json");
        try {
            JsonNode features = mapper.readTree(r.getFile()).get("features");
            features.forEach(feature -> {
                JsonNode properties = feature.get("properties");
                String precinctName = properties.get("PCTNUM").asText();
                Precinct precinct = Precinct.builder()
                    .precinctName(precinctName)
                    .stateAbbr(stateAbbr)
                    .elections(loadAndSaveElections(properties))
                    .build();
                precincts.put(precinctName, precinct);
                precinctRepo.save(precinct);
            });
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return precincts;
    }



    /**
     * 
     *  EMBEDDED AND OTHER LOADING METHODS
     * 
     */



    public Map<MeasureType, Double> loadDistrictingMeasures(JsonNode candidateNode) {
        Map<MeasureType, Double> districtingMeasures = new HashMap<>();
        for (MeasureType mType : MeasureType.values()) {
            double value = 0.0;
            if (mType == MeasureType.NUM_OPPORTUNITY_DISTRICTS) {
                int numOpportunityDistricts = 0;
                JsonNode potentialOpportunityDistricts = candidateNode.get(Constants.measureKeys.get(mType));
                for (JsonNode racialGroups : potentialOpportunityDistricts) { // racialGroups is array that might look like ["BLACK", "WHITE"]
                    Boolean isOpportunityGroup = false;
                    for (JsonNode race : racialGroups) {
                        if (!race.asText().equals("WHITE")) { isOpportunityGroup = true; }
                    }
                    if (isOpportunityGroup) { numOpportunityDistricts++; }
                }
                value = (double) numOpportunityDistricts;
            } else {
                value = candidateNode.get(Constants.measureKeys.get(mType)).asDouble();
            }
            districtingMeasures.put(mType, value);
        }
        return districtingMeasures;
    }


    public Map<ElectionType, Double> loadEfficiencyGap(JsonNode candidateNode) {
        Map<ElectionType, Double> efficiencyGap = new HashMap<>();
        for (ElectionType elType : ElectionType.values()) {
            double effGap = candidateNode.get("EFF_GAP_" + elType.toString()).asDouble();
            String favoredParty = candidateNode.get("EFF_GAP_" + elType.toString() + "_FAVORS").asText();
            if (favoredParty.equals("D")) { effGap *= -1.0; }
            if (favoredParty.equals("tie")) { effGap += 1.0; }
            efficiencyGap.put(elType, effGap);
        }
        return efficiencyGap;
    }

    public Map<RacialType, Double> loadRacialDevFromEnacted(JsonNode candidateNode) {
        // only for Total Population
        Map<RacialType, Double> racialDevFromEnacted = new HashMap<>();
        for (RacialType rType : RacialType.values()) {
            racialDevFromEnacted.put(rType, candidateNode.get("DEV_ENACTED_" + Constants.raceKeys.get(rType)).asDouble());
        }
        return racialDevFromEnacted;
    }


    public List<Map<ElectionType, Double>> loadPoliticalDevsFromEnacted(JsonNode candidateNode) {
        Map<ElectionType, Double> politicalDevFromEnactedD = new HashMap<>();
        Map<ElectionType, Double> politicalDevFromEnactedR = new HashMap<>();
        for (ElectionType elType : ElectionType.values()) {
            for (PartyType pType : PartyType.values()) {
                if (pType == PartyType.DEMOCRATIC_PARTY) {
                    politicalDevFromEnactedD.put(elType, candidateNode.get("DEV_ENACTED_" + elType.toString() + "D").asDouble());
                } else {
                    politicalDevFromEnactedR.put(elType, candidateNode.get("DEV_ENACTED_" + elType.toString() + "R").asDouble());
                }
            }
        }
        return List.of(politicalDevFromEnactedD, politicalDevFromEnactedR);
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

    
    // Comparator for sorting resources by candidate id
    // filenames of form '1-*', '2-*', etc.
    // This is NOT the same ResComparator as the one in StateService.java
    class ResComparator implements Comparator<Resource> {

        @Override
        public int compare(Resource r1, Resource r2) {
            int id1 = getIdFromFilename(r1.getFilename());
            int id2 = getIdFromFilename(r2.getFilename());
            return id1 - id2;
        }

        private int getIdFromFilename(String fn) {
            String idString = fn.split("-")[0];
            return Integer.parseInt(idString);
        }
    }

}