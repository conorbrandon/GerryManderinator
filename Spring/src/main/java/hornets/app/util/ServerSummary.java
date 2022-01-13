package hornets.app.util;

import hornets.app.model.Measures;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter 
@Setter 
@NoArgsConstructor
public class ServerSummary {
    int[] updatedPopulations;
    AlgorithmStatus status;
    long timeElapsedMs;
    long numIterations;
    int splitPrecincts;
    String optimizedMap = null;
    Measures measures = null;
    String districtMeasures = null;
    double eqPop;
    int numCensusBlocksMoved;

    public ServerSummary(ServerAlgorithm sa) {
        this.updatedPopulations = sa.getDistrictPopulations();
        this.status = sa.getStatus();
        this.timeElapsedMs = sa.getTimeElapsedMs();
        this.numIterations = sa.getNumIterations();
        this.eqPop = sa.getInfo().getEqualpop();
        this.numCensusBlocksMoved = sa.getNumCensusBlocksMoved();
    }

    public void addFinalInformation(ServerAlgorithm sa) {
        this.splitPrecincts = sa.getNumSplitPrecincts();
        this.optimizedMap = sa.getDissolvedMap();
        sa.computeMeasures(this);
        System.out.println("All final information added");
    }
}
