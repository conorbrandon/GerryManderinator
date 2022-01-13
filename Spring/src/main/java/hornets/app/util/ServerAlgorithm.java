package hornets.app.util;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Scanner;
import java.util.Set;
import java.util.Stack;
import hornets.app.model.CensusBlock;
import hornets.app.model.District;
import hornets.app.model.Districting;
import hornets.app.model.ElectionType;
import hornets.app.model.MeasureType;
import hornets.app.model.Measures;
import hornets.app.model.RacialType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.io.File;
import java.io.FileWriter;
import java.io.BufferedReader;
import java.io.FileReader;

import org.jgrapht.Graph;
import org.jgrapht.alg.connectivity.BlockCutpointGraph;
import org.jgrapht.graph.DefaultEdge;
import org.jgrapht.graph.SimpleGraph;

@Getter 
@Setter 
@NoArgsConstructor
public class ServerAlgorithm {
    private Map<String, CensusBlock> borderCensusBlocks; //geoid to cb, we can remove when no longer border
    private UserParams userParams;
    private Districting dist;
    private AlgorithmInfo info;
    private AlgorithmInfo infoInProgress;
    private long timeElapsedMs;
    private AlgorithmStatus status;
    private long numIterations;
    private int idealPop;
    private int numCensusBlocksMoved;
    private int numMovesNoImprovement;

    public ServerAlgorithm(UserParams userParams, Districting dist, int totalPop, Map<String, CensusBlock> borderCensusBlocks, int[] districtPops) {
        this.setInfo(new AlgorithmInfo(dist, userParams, districtPops));
        this.status = AlgorithmStatus.STOPPED;
        this.userParams = userParams;
        this.dist = dist;
        this.timeElapsedMs = 0; //haven't started yet
        this.borderCensusBlocks = borderCensusBlocks;
        this.numIterations = 0;
        int numDistricts = dist.getDistricts().size();
        this.idealPop = totalPop / numDistricts;
        this.numCensusBlocksMoved = 0;
        this.numMovesNoImprovement = 0;
        System.out.println("Server Algorithm object created!");
    }

    public void runAlgorithm() { //TODO: some methods this calls need to be implemented
        System.out.println("Algorithm is running!");
        System.out.println("Starting Equal Pop: " + this.info.getEqualpop());
        this.setStatus(AlgorithmStatus.RUNNING);
        Stack<Move> lastMoves = new Stack<Move>();
        while (this.status == AlgorithmStatus.RUNNING) {
            long startTime = System.currentTimeMillis();
            if (this.stopConditionsMet()) {
                this.status = AlgorithmStatus.STOPPED;
                break;
            }
            this.infoInProgress = this.info.clone(); 
            for (int i = 0; i < Constants.NUM_CENSUS_MOVES; i++) {
                CensusBlock cbb;
                int originalDistrict, newDistrictNum;
                do {
                    cbb = this.selectRandBorderBlock();
                    originalDistrict = cbb.getDistrictNum();
                    newDistrictNum = cbb.getNeighboringDistrict();
                } while(newDistrictNum == -1);
                this.moveBlock(cbb, newDistrictNum);
                lastMoves.push(new Move(cbb, originalDistrict));
                int delta = cbb.getDemographics().get(this.userParams.getPopType()).getPopulations().get(RacialType.ALL);
                this.infoInProgress.updatePopulations(originalDistrict, newDistrictNum, delta);
            }
            this.numIterations++;
            this.calculateEqPop();
            if (this.movesImprovedEquaility()) {
                this.numMovesNoImprovement = 0;
                this.info = infoInProgress; //Use newer info
                lastMoves = new Stack<Move>(); //Discard old moves, we know they helped
                this.numCensusBlocksMoved += Constants.NUM_CENSUS_MOVES;
            }
            else { //Worse, old info stays, revert moves
                this.numMovesNoImprovement++;
                Move m;
                while(!lastMoves.empty()) {
                    m = lastMoves.pop();
                    this.reverseMove(m);
                }
            }
            if (numIterations % 2500 == 0) {
                System.out.println("After " + numIterations + ", EqPop: " + this.info.getEqualpop());
            }
            this.setTimeElapsedMs(timeElapsedMs + (System.currentTimeMillis()-startTime)); 
        }
        if (this.status == AlgorithmStatus.PAUSED) {
            if (this.timeoutMet()) {
                this.status = AlgorithmStatus.STOPPED;
            }
            else {
                System.out.println("Algorithm is paused");
            }
        }
        if (this.status == AlgorithmStatus.STOPPED) { //not else, as a pause may still stop
            this.status = AlgorithmStatus.COMPLETED;
            System.out.println("Algorithm is complete!");
            System.out.println("Number of Iterations: " + this.numIterations);
            System.out.println("Equal Pop: " + this.info.getEqualpop());
            System.out.println("Populations: " + Arrays.toString(this.info.getDistrictPopulations()));
        }
    }

    private void reverseMove(Move move) {
        this.moveBlock(move.getCensusBlock(), move.getOriginalDistrictNum());
    }

    private void moveBlock(CensusBlock cb, int districtNum) {
        cb.setDistrictNum(districtNum);
        assignNewBoundaryBlocks(cb);
    }

    private void assignNewBoundaryBlocks(CensusBlock cb) {
        int newDistrictNum = cb.getDistrictNum();
        boolean isBorder = false;
        for (CensusBlock neighbor : cb.getNeighbors()) {
            if (neighbor.getDistrictNum() != newDistrictNum) {
                isBorder = true;
            } 
            else {
                for (CensusBlock neighbor2 : neighbor.getNeighbors()) { //check neighbors of neighbor
                    if (neighbor2.getDistrictNum() != newDistrictNum) { //touches another district, its a boundary
                        isBorder = true;
                        break;
                    }
                }
            }
            neighbor.setBoundaryNode(isBorder);
            String geoId = neighbor.getGeoId();
            if (isBorder) { 
                this.borderCensusBlocks.put(geoId, neighbor);
            }
            else if (this.borderCensusBlocks.containsKey(geoId)) {
                this.borderCensusBlocks.remove(geoId);
            }
        }
    }

    private void calculateEqPop() {
        int[] distPops = this.infoInProgress.getDistrictPopulations();
        int minPop = distPops[0];
        int maxPop = distPops[0];
        for (int i : distPops) {
            if (i < minPop) {
                minPop = i;
            }
            else if (i > maxPop){
                maxPop = i;
            }
        }
        this.infoInProgress.setEqualpop(((double) (maxPop-minPop))/this.idealPop);
    }

    private CensusBlock selectRandBorderBlock() {
        List<String> keysAsArray = new ArrayList<String>(this.borderCensusBlocks.keySet());
        Random r = new Random();
        boolean isCutPoint = true;
        // CensusBlock randBlock = this.borderCensusBlocks.get(keysAsArray.get(r.nextInt(keysAsArray.size())));
        CensusBlock randBlock = null;
        while (isCutPoint) {
            randBlock = this.borderCensusBlocks.get(keysAsArray.get(r.nextInt(keysAsArray.size())));
            // create an undirected graph consisting just of randBlock and it's neighbors
            Graph<CensusBlock, DefaultEdge> neighborGraph = new SimpleGraph<>(DefaultEdge.class);
            neighborGraph.addVertex(randBlock);
            Set<CensusBlock> neighbors = randBlock.getNeighbors();
            for (CensusBlock neighbor : neighbors) {
                neighborGraph.addVertex(neighbor);
                neighborGraph.addEdge(randBlock, neighbor);
                Set<CensusBlock> neighNeighbors = neighbor.getNeighbors();
                for (CensusBlock neighNeighbor : neighNeighbors) {
                    neighborGraph.addVertex(neighNeighbor);
                    neighborGraph.addEdge(neighbor, neighNeighbor);
                    for (CensusBlock neighNNeighbor : neighNeighbor.getNeighbors()) {
                        if (neighNeighbors.contains(neighNNeighbor))  {
                            neighborGraph.addVertex(neighNNeighbor);
                            neighborGraph.addEdge(neighNeighbor, neighNNeighbor);
                        }
                    }
                }
            }
            // use super OP data structure to find out if randBlock is a cut point
            BlockCutpointGraph<CensusBlock, DefaultEdge> steroidsNeighborGraph = new BlockCutpointGraph<>(neighborGraph);
            isCutPoint = steroidsNeighborGraph.isCutpoint(randBlock);
        }
        return randBlock;
    }

    private boolean movesImprovedEquaility() {
        return this.getInfo().getEqualpop() > this.getInfoInProgress().getEqualpop(); //lower equal pop is better
    }
    
    private Map<String, Boolean> findSplitPrecincts() {
        String cbPrecinctName;
        HashMap<String, Set<Integer>> precinctDistricts = new HashMap<>();
        for (District d : this.dist.getDistricts()) {
            for (CensusBlock cb : d.getCensusBlocks()) {
                cbPrecinctName = cb.getPrecinct().getPrecinctName();
                if (precinctDistricts.containsKey(cbPrecinctName)) {
                    Set<Integer> l = precinctDistricts.get(cbPrecinctName);
                    l.add(cb.getDistrictNum());
                    // precinctDistricts.put(cbPrecinctName, l);
                }
                else {
                    Set<Integer> l = new HashSet<>();
                    l.add(cb.getDistrictNum());
                    precinctDistricts.put(cbPrecinctName, l);
                }
            }
        }
        HashMap<String, Boolean> precincts = new HashMap<>();
        boolean isSplit;
        for (String precinct : precinctDistricts.keySet()) {
            isSplit = precinctDistricts.get(precinct).size() > 1;
            precincts.put(precinct, isSplit);
        }
        return precincts; 
    }

    public List<String> getSplitPrecincts() {
        Map<String, Boolean> precincts = findSplitPrecincts();
        List<String> splitPrecincts = new ArrayList<>();
        for (String precinct : precincts.keySet()) {
            if (precincts.get(precinct)) {
                splitPrecincts.add(precinct);
            }
        }
        return splitPrecincts;
    }

    public int getNumSplitPrecincts() {
        Map<String, Boolean> precincts = findSplitPrecincts();
        int splitPrecincts = 0;
        for (String precinct : precincts.keySet()) {
            if (precincts.get(precinct)) {
                splitPrecincts++;
            }
        }
        return splitPrecincts;
    }

    private boolean stoppedImproving() {
        return this.numMovesNoImprovement > Constants.NUM_NO_IMPROVEMENT_ALLOWED;
    }

    private boolean timeoutMet() {
        return this.timeElapsedMs > this.userParams.getTimeout();
    }

    private boolean eqPopThreshMet() {
        return this.getInfo().getEqualpop() <= this.userParams.getEqPopThresh();
    }

    public boolean stopConditionsMet() {
        return this.timeoutMet() || this.eqPopThreshMet() || this.stoppedImproving();
    }

    public void computeMeasures(ServerSummary ss) {
        Measures measures = new Measures();
        measures.setDistrictingMeasures(new HashMap<>());
        measures.setEfficiencyGap(new HashMap<>());
        try {
            Process p;

            String script = "./serverAlgorithmMeasures/measuresScript.sh " + this.userParams.getStateAbbr().toLowerCase();
            p = Runtime.getRuntime().exec(script); 
            System.out.println("Exit code: ");
            System.out.println(p.waitFor());

            System.out.println("Starting to read measures");
            Scanner scanner = new Scanner(new File("./outMeasures.txt"));
            String[] parts;
            String line;
            int numSplitCounties = 0;
            double epPop = 0;
            double polPop = 0;
            double devEn = 0;
            String[] splitByDis = null;
            String[] oppByDis = null;
            String[] polByDis = null;
            String[] effGap = null;
            String[] effGapFavors = null;
            while (scanner.hasNextLine()) {
                line = scanner.nextLine();
                System.out.println(line);
                parts = line.split(" ");
                if (parts[0].equals("totalSplitCounties")) {
                    numSplitCounties = Integer.parseInt(parts[1]);
                }
                else if (parts[0].equals("splitCountiesByDistrict")) {
                    splitByDis = removeFirstLast(parts[1]).split(",");
                }
                else if (parts[0].equals("equalPopScore")) {
                    epPop = Double.parseDouble(parts[1]);
                }
                else if (parts[0].equals("opportunityDistrictGroups")) {
                    oppByDis = removeFirstLast(parts[1]).split(",");
                }
                else if (parts[0].equals("polsbyPopperByDistrict")) {
                    polByDis = removeFirstLast(parts[1]).split(",");
                }
                else if (parts[0].equals("polsbyPopper")) {
                    polPop = Double.parseDouble(parts[1]);
                }
                else if (parts[0].equals("efficiencyGap")) {
                    effGap = removeFirstLast(parts[1]).split(",");
                }
                else if (parts[0].equals("efficiencyGapFavors")) {
                    effGapFavors = removeFirstLast(parts[1]).split(",");
                }  
                else {
                    devEn = Double.parseDouble(parts[1]);
                }
            }
            measures.getDistrictingMeasures().put(MeasureType.NUM_SPLIT_COUNTIES, (double) numSplitCounties);
            measures.getDistrictingMeasures().put(MeasureType.EQUAL_POPULATION_VARIANCE, epPop);
            measures.getDistrictingMeasures().put(MeasureType.POLSBY_POPPER, polPop);
            measures.getDistrictingMeasures().put(MeasureType.DEVIATION_FROM_ENACTED_AREA, devEn);
            String[] effParts;
            String elec, favor;
            double effVal;
            System.out.println("Obtaining efficiency gap");
            for (int i = 0; i < effGap.length; i++) {
                effParts = effGap[i].split(":");
                if (effParts[1].equals("null")) {
                    effVal = 0;
                }
                else {
                    effVal = Double.parseDouble(effParts[1]);
                }
                elec = removeFirstLast(effParts[0]);
                effParts = effGapFavors[i].split(":");
                favor = removeFirstLast(effParts[1]);
                ElectionType elecT = Constants.ELECTION_TYPE_MAP.get(elec);
                if (favor.equals("tie")) {
                    effVal += 1;
                }
                else if (favor.equals("D")) {
                    effVal *= -1;
                }
                measures.getEfficiencyGap().put(elecT, effVal);
            }
            int totalOpportunity = 0;
            String[] disParts;
            String[] opps;
            String districtMeasures = "{\"Districts\":{";
            for (int i = 0; i < polByDis.length; i++) {
                disParts = splitByDis[i].split(":");
                districtMeasures += disParts[0] + ":{" + "\"numSplitCounties\":" + disParts[1] + ",";
                disParts = polByDis[i].split(":");
                districtMeasures += "\"polsbyPopper\":" + disParts[1] + ",";
                disParts = oppByDis[i].split(":");
                districtMeasures += "\"OPPORTUNITY_DISTRICT_FOR\":" + disParts[1];
                disParts[1] = removeFirstLast(disParts[1]);
                if (disParts[1].length() > 0) {
                    opps = disParts[1].split(",");
                    totalOpportunity += opps.length;
                }
                districtMeasures += "}";
                if (i < polByDis.length-1) {
                    districtMeasures += ",";
                }
            }
            districtMeasures += "}}";
            ss.setDistrictMeasures(districtMeasures);
            measures.getDistrictingMeasures().put(MeasureType.NUM_OPPORTUNITY_DISTRICTS, (double) totalOpportunity);
            scanner.close();
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Error occured in computeMeasures()");
        }
        ss.setMeasures(measures);
    }

    private String removeFirstLast(String s) {
        return s.substring(1, s.length() -1);
    }
    
    public String gatherCbGeoJson() {
        StringBuilder features = new StringBuilder("{\"crs\":{\"type\":\"name\",\"properties\":{\"name\":\"urn:ogc:def:crs:EPSG::4269\"}},\"type\":\"FeatureCollection\", \"features\": [");
        String geoStr, newDistStr;
        for (District d : this.dist.getDistricts()) {
            for (CensusBlock cb : d.getCensusBlocks()) {
                geoStr = cb.getGeoJson();
                newDistStr = "\"District\":\"" + cb.getDistrictNum() + "\"";
                // System.out.println(newDistStr + " " + cb.getGeoId());
                geoStr = geoStr.replaceFirst("\"District\":\\s*\"\\d+\"", newDistStr);
                // System.out.println(geoStr);
                features.append( geoStr + ",\n" );
                //System.out.println(cb.getDistrictNum());
                //System.out.println(cb.getDemographics().get(this.userParams.getPopType()).getPopulations().get(RacialType.ALL));
            }
        }
        String features2 = features.toString().substring(0, features.toString().length() - 2);
        features2 += "]}";
        // System.out.println(features2);
        return features2;
    }

    public String getDissolvedMap() { 
        String filePath = dissolveMap();
        if (filePath == null) {
            return null;
        }
        System.out.println("reading map from: ");
        System.out.println(filePath);
        StringBuilder map = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new FileReader(filePath), 20971520)) {
            String line;
            while ((line = reader.readLine()) != null) {
                map.append(line);
                map.append(System.lineSeparator());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        // System.out.println(map.toString());
        return map.toString();
    }

    public String dissolveMap() {
        String features = gatherCbGeoJson();
        try {
            File myObj = new File("./inDissolve.json");
            if (myObj.createNewFile()) {
                System.out.println("./inDissolve.json created: " + myObj.getName());
            } else {
                System.out.println("./inDissolve.json already exists.");
            }
        } catch (Exception e) {
                e.printStackTrace();
        }
        try {
            File myObj = new File("./outMeasures.txt");
            if (myObj.createNewFile()) {
                System.out.println("./outMeasures.txt created: " + myObj.getName());
            } else {
                System.out.println("./outMeasures.txt already exists.");
            }
        } catch (Exception e) {
                e.printStackTrace();
        }
        try {
            FileWriter myWriter = new FileWriter("./inDissolve.json");
            myWriter.write(features);
            myWriter.close();
            System.out.println("Successfully wrote to the file.");
        } catch (Exception e) {
            e.printStackTrace();
        }
        try {
            FileWriter myWriter = new FileWriter("./outMeasures.txt");
            myWriter.write("");
            myWriter.close();
            System.out.println("Successfully wrote to the file.");
        } catch (Exception e) {
            e.printStackTrace();
        }
        try {
            Process p;
            String script = "./serverAlgorithmMeasures/dissolveScript.sh " + this.userParams.getStateAbbr();;
            p = Runtime.getRuntime().exec(script); 
            System.out.println("Exit code: ");
            System.out.println(p.waitFor());

            String filePath = "./outDissolve.json";
            return filePath;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    //Wrapper getter methods
    public int[] getDistrictPopulations() {
        return this.info.getDistrictPopulations();
    }
}
