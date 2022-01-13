package hornets.app.service;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import hornets.app.repository.DistrictingRepository;
import hornets.app.repository.PrecinctRepository;
import hornets.app.util.AlgorithmStatus;
import hornets.app.util.Constants;
import hornets.app.util.ServerAlgorithm;
import hornets.app.util.ServerSummary;
import hornets.app.util.UserParams;
import hornets.app.model.CensusBlock;
import hornets.app.model.Demographics;
import hornets.app.model.District;
import hornets.app.model.Districting;
import hornets.app.model.Election;
import hornets.app.model.ElectionType;
import hornets.app.model.PartyType;
import hornets.app.model.PopulationType;
import hornets.app.model.Precinct;
import hornets.app.model.RacialType;

@Service
public class ServerAlgorithmService {

    private ServerAlgorithm sa;
    private final DistrictingRepository dr;
    private final ObjectMapper mapper;
    private final ResourceLoader resourceLoader;

    @Autowired
    public ServerAlgorithmService(DistrictingRepository dr,
        ObjectMapper mapper,
        ResourceLoader resourceLoader,
        PrecinctRepository precinctRepo) { 
        this.sa = null; 
        this.dr = dr;
        this.mapper = mapper;
        this.resourceLoader = resourceLoader;
    }

    public boolean setAlgorithmStatus(AlgorithmStatus status) {
        if (sa == null) {
            return false;
        }
        if (sa.getStatus() == AlgorithmStatus.COMPLETED || sa.getStatus() == AlgorithmStatus.STOPPED) return false;
        sa.setStatus(status);
        return true;
    }

    public boolean isValidUserParams(String paramString) {
		System.out.println("{params}=" + paramString);
        try { 
            UserParams params = mapper.readValue(paramString, UserParams.class); //Can throw JsonProcessingException
            System.out.println("In object form:\n" + params);
            //We need to have these lines commented out until the database will have proper information
            Districting d = dr.findFirstByCandidateIdAndStateAbbr(params.getCandidateId(), params.getStateAbbr());
            // load census blocks and assign to districts
            Map<String, CensusBlock> blocks = loadCensusBlocks(params.getStateAbbr()); // geoid to block
            Resource districtNumCensusBlockResource = resourceLoader.getResource("classpath:db-load/" + params.getStateAbbr() + "/districtnum-cb.json");
            d.getDistricts().forEach(district -> {
                try {
                    String idString = Integer.toString(params.getCandidateId());
                    String districtNumString = Integer.toString(district.getDistrictNumber());
                    JsonNode districtNode = mapper.readTree(districtNumCensusBlockResource.getFile()).get(idString).get(districtNumString);
                    districtNode.forEach(censusNode -> {
                        CensusBlock block = blocks.get(censusNode.get("geo_id").asText());
                        block.setDistrictNum(district.getDistrictNumber());
                        block.setBoundaryNode(censusNode.get("is_boundary_node").asBoolean());
                        district.getCensusBlocks().add(blocks.get(censusNode.get("geo_id").asText()));
                    });
                    // districtRepo.save(district);
                } catch (JsonProcessingException e) {
                    e.printStackTrace();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            });
            int totalPop = 0;
            int cbPop;
            Map<String, CensusBlock> borderCensusBlocks = new HashMap<>();
            int[] pops = new int[d.getDistricts().size()];
            for (District district : d.getDistricts()) {
                for (CensusBlock cb : district.getCensusBlocks()) {
                    cbPop = cb.getDemographics().get(params.getPopType()).getPopulationbyRace(RacialType.ALL);
                    pops[cb.getDistrictNum()-1] += cbPop;
                    totalPop += cbPop;
                    if (cb.isBoundaryNode()) {
                        borderCensusBlocks.put(cb.getGeoId(), cb);
                    }
                }
            }
            System.out.println("Populations from censusblocks: " + Arrays.toString(pops));
            System.out.println("Creating Server Algorithm object");
            sa = new ServerAlgorithm(params, d, totalPop, borderCensusBlocks, pops);
            return true;
        } catch (Exception e) {
            System.out.println(e);
            return false;
        }
	}

    public boolean startAlgorithm() {
        if (sa == null) {
            return false;
        }
        sa.runAlgorithm();
        return true;
    }

    public String getUpdatedAlgorithmStatus() {
        if (sa == null) {
            return null;
        }
        ServerSummary sum = new ServerSummary(sa);
        try {
            return mapper.writeValueAsString(sum);
        } catch (JsonProcessingException e) {
            return null;
        }
    }

    public String getFinalAlgorithmStatus() {
        if (sa == null) {
            return null;
        }
        ServerSummary sum = new ServerSummary(sa);
        if (sum.getStatus() == AlgorithmStatus.COMPLETED) {
            sum.addFinalInformation(sa);
            sa = null; //Algorithm is finished, remove information from server
        }
        try {
            return mapper.writeValueAsString(sum);
        } catch (JsonProcessingException e) {
            return null;
        }
    }


    public Map<String, CensusBlock> loadCensusBlocks(String stateAbbr) {
        Map<String, CensusBlock> censusBlocks = new HashMap<>();
        Map<Integer, CensusBlock> blocksByGraphId = new HashMap<>();
        Resource geoJsonFileResource = resourceLoader.getResource("classpath:db-load/" + stateAbbr + "/censusBlocks.json");
        Resource graphFileResource = resourceLoader.getResource("classpath:db-load/" + stateAbbr + "/censusBlocks-graph.json");
        Map<String, Precinct> precincts = loadPrecincts(stateAbbr);
        try {
            JsonNode nodes = mapper.readTree(graphFileResource.getFile()).get("nodes");
            JsonNode features = mapper.readTree(geoJsonFileResource.getFile()).get("features");
            for (int i = 0; i < nodes.size(); i++) {
                if (i == (nodes.size() / 2)) { System.out.println("Halfway done with neighborless census blocks"); }
                JsonNode node = nodes.get(i);
                JsonNode feature = features.get(i);
                String geoId = node.get("GEOID20").asText();
                String precinctName = node.get("PCTNUM").asText();
                Precinct precinct = precincts.get(precinctName);
                String countyName = node.get("COUNTY").asText();
                int graphId = node.get("id").asInt();
                String geoJson = feature.toString();
                Set<CensusBlock> neighbors = new HashSet<>();
                CensusBlock block = CensusBlock.builder()
                    .geoId(geoId)
                    .stateAbbr(stateAbbr)
                    .geoJson(geoJson)
                    .demographics(loadDemographics(node))
                    .neighbors(neighbors)
                    .precinctName(precinctName) // link to precincts later
                    .precinct(precinct)
                    .countyName(countyName)
                    .graphId(graphId)
                    .build();
                censusBlocks.put(geoId, block);
                blocksByGraphId.put(graphId, block);
            }
            System.out.println("Done with neighborless census blocks");
            // Now populate neighbors
            JsonNode adjacency = mapper.readTree(graphFileResource.getFile()).get("adjacency");
            censusBlocks.values().forEach(block -> {
                JsonNode neighborNodes = adjacency.get(block.getGraphId());
                neighborNodes.forEach(node -> {
                    block.getNeighbors().add(blocksByGraphId.get(node.get("id").asInt()));
                });
            });
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return censusBlocks;
    }

    public Map<PopulationType, Demographics> loadDemographics(JsonNode node) {
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
        return demographics;
    }

    public Map<String, Precinct> loadPrecincts(String stateAbbr) {
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
                    .elections(loadElections(properties))
                    .build();
                precincts.put(precinctName, precinct);
            });
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return precincts;
    }

    public Map<ElectionType, Election> loadElections(JsonNode node) {
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
        return elections;
    }
}
