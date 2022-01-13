package hornets.app.util;

import java.util.Map;

import hornets.app.model.ElectionType;
import hornets.app.model.MeasureType;
import hornets.app.model.PopulationType;
import hornets.app.model.RacialType;

public class Constants {
    public static final int NUM_CENSUS_MOVES = 20;
    public static final int NUM_NO_IMPROVEMENT_ALLOWED = 1500;
    public static final int NUM_STATES = 3;
    public static final Map<String, PopulationType> POP_MAP = Map.of(
        "TOTAL_POP", PopulationType.TOTAL_POP,
        "VAP", PopulationType.VAP,
        "CVAP", PopulationType.CVAP
    );
    public static final Map<PopulationType, String> popKeys = Map.of(
        PopulationType.TOTAL_POP, "TOTAL_",
        PopulationType.VAP, "VAP_TOTAL_",
        PopulationType.CVAP, "CVAP_TOTAL_"
    );
    public static final Map<RacialType, String> raceKeys = Map.of(
        RacialType.WHITE, "WHITE",
        RacialType.BLACK_OR_AFRICAN_AMERICAN, "BLACK",
        RacialType.AMERICAN_INDIAN_AND_ALASKA_NATIVE, "INDIAN",
        RacialType.ASIAN, "ASIAN",
        RacialType.NATIVE_HAWAIIAN_AND_OTHER_PACIFIC_ISLANDER, "PACIFIC",
        RacialType.SOME_OTHER_RACE, "OTHER",
        RacialType.TWO_OR_MORE_RACES, "MIXED",
        RacialType.HISPANIC, "HISPANIC",
        RacialType.ALL, "TOTAL_POP"
    );
    public static final Map<RacialType, String> raceKeysAlt = Map.of(
        RacialType.WHITE, "ONE_WHITE",
        RacialType.BLACK_OR_AFRICAN_AMERICAN, "ONE_BLACK",
        RacialType.AMERICAN_INDIAN_AND_ALASKA_NATIVE, "ONE_INDIAN",
        RacialType.ASIAN, "ONE_ASIAN",
        RacialType.NATIVE_HAWAIIAN_AND_OTHER_PACIFIC_ISLANDER, "ONE_PACIFIC",
        RacialType.SOME_OTHER_RACE, "ONE_OTHER",
        RacialType.TWO_OR_MORE_RACES, "MIXED",
        RacialType.HISPANIC, "HISPANIC",
        RacialType.ALL, "POP"
    );
    public static final Map<MeasureType, String> measureKeys = Map.of(
        MeasureType.EQUAL_POPULATION_VARIANCE, "EQUAL_POP",
        MeasureType.DEVIATION_FROM_ENACTED_AREA, "DEV_ENACTED_AREA",
        MeasureType.GRAPH_COMPACTNESS, "GTC",
        MeasureType.NUM_OPPORTUNITY_DISTRICTS, "OPPOR_DIST",
        MeasureType.NUM_SPLIT_COUNTIES, "TOTAL_SPLIT_COUNTIES",
        MeasureType.POLSBY_POPPER, "POL_POP",
        MeasureType.SPLIT_COUNTIES_SCORE, "SPLIT_CO",
        MeasureType.OBJ_FUNC, "OBJ_FUNC"
    );
    public static final Map<String, Integer> NUM_CENSUS_BLOCKS = Map.of(
        "AZ", 155444,
        "NV", 57409,
        "GA", 232717
    );
    public static final Map<String, ElectionType> ELECTION_TYPE_MAP = Map.of(
        "HOU20", ElectionType.HOU20,
        "PRE20", ElectionType.PRE20,
        "USS20", ElectionType.USS20,
        "USS18", ElectionType.USS18,
        "ATG18", ElectionType.ATG18
    );
    //Maybe have folder paths for where certain scripts are located or where we fetch certain information
}


// dummy census block
// Map<RacialType, Integer> pops = Map.of(
        //     RacialType.ALL, -1,
        //     RacialType.AMERICAN_INDIAN_AND_ALASKA_NATIVE, -1,
        //     RacialType.ASIAN, -1,
        //     RacialType.BLACK_OR_AFRICAN_AMERICAN, -1,
        //     RacialType.HISPANIC, -1, 
        //     RacialType.NATIVE_HAWAIIAN_AND_OTHER_PACIFIC_ISLANDER, -1, 
        //     RacialType.SOME_OTHER_RACE, -1, 
        //     RacialType.TWO_OR_MORE_RACES, -1, 
        //     RacialType.WHITE, -1
        // );
        // Map<PopulationType, Demographics> dem = Map.of(
        //     PopulationType.TOTAL_POP, demographicsRepo.save(Demographics.builder().populations(pops).build()),
        //     PopulationType.CVAP, demographicsRepo.save(Demographics.builder().populations(pops).build()),
        //     PopulationType.VAP, demographicsRepo.save(Demographics.builder().populations(pops).build())
        // );
        // CensusBlock cb = CensusBlock.builder()
        //     .geoId("dummy")
        //     .stateAbbr("AAA")
        //     .demographics(dem)
        //     .build();
        // censusRepo.save(cb);