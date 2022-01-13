package hornets.app.util;

import java.util.Arrays;
import hornets.app.model.District;
import hornets.app.model.Districting;
import hornets.app.model.MeasureType;
import hornets.app.model.RacialType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter 
@Setter 
@NoArgsConstructor
public class AlgorithmInfo {
    private int[] districtPopulations;
    private double equalpop;

    public AlgorithmInfo(Districting d, UserParams params, int[] districtPops) {
        this.districtPopulations = districtPops;
        this.equalpop = d.getMeasures().getDistrictingMeasure(MeasureType.EQUAL_POPULATION_VARIANCE);
    }

    public void updatePopulations(int oldDistrictNum, int newDistrictNum, int delta) {
        this.districtPopulations[oldDistrictNum-1] -= delta;
        this.districtPopulations[newDistrictNum-1] += delta;
    }
    
    public AlgorithmInfo clone() {
        AlgorithmInfo cloned = new AlgorithmInfo();
        cloned.districtPopulations = Arrays.copyOf(this.districtPopulations, this.districtPopulations.length);
        cloned.equalpop = this.equalpop;
        return cloned;
    }
}
