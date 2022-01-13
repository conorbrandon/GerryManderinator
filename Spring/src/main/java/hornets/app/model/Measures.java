package hornets.app.model;

import java.util.HashMap;
import java.util.Map;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.MapKeyEnumerated;
import javax.persistence.ElementCollection;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Builder(toBuilder = true)
@Getter 
@Setter 
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Measures {
    @Id
    @GeneratedValue
    Long id;
    @ElementCollection
    @MapKeyEnumerated(EnumType.STRING)
    private Map<MeasureType, Double> districtingMeasures;
    @ElementCollection
    @MapKeyEnumerated(EnumType.STRING)
    private Map<ElectionType, Double> efficiencyGap;
    @ElementCollection
    @MapKeyEnumerated(EnumType.STRING)
    private Map<RacialType, Double> racialDevFromEnacted; // only for Total Population
    @ElementCollection
    @MapKeyEnumerated(EnumType.STRING)
    private Map<ElectionType, Double> politicalDevFromEnactedD;
    @ElementCollection
    @MapKeyEnumerated(EnumType.STRING)
    private Map<ElectionType, Double> politicalDevFromEnactedR;

    public double getDistrictingMeasure(MeasureType type) {
        return this.districtingMeasures.get(type);
    }

    public PartyType getEfficiencyGapFavoredParty(ElectionType type) {
        double gap = this.efficiencyGap.get(type);
        if (gap < 0) {
            return PartyType.DEMOCRATIC_PARTY;
        }
        return PartyType.REPUBLICAN_PARTY;
    }

    public Double getEfficiencyGap(ElectionType type) {
        return Math.abs(this.efficiencyGap.get(type));
    }

    public Measures clone() {
        Measures cloned = new Measures();
        // cloned.districtingMeasures = new HashMap<>();
        // cloned.districtingMeasures.putAll(this.districtingMeasures);
        // cloned.efficiencyGap = new HashMap<>();
        // cloned.efficiencyGap.putAll(this.efficiencyGap);
        // cloned.demographicDevFromEnacted = new HashMap<>();
        // cloned.demographicDevFromEnacted.putAll(this.demographicDevFromEnacted);
        // cloned.politicalDevFromEnacted = new HashMap<>();
        // cloned.politicalDevFromEnacted.putAll(this.politicalDevFromEnacted);
        return cloned;
    }
}
