package hornets.app.model;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.MapKeyEnumerated;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.OneToMany;
import javax.persistence.OneToOne;

import java.util.Map;
import java.util.Set;

@Entity
@Builder(toBuilder = true)
@Getter 
@Setter 
@NoArgsConstructor
@AllArgsConstructor
@Table(name="Districtings")
public class Districting {
    @Id 
    @GeneratedValue 
    private Long id;
    private String stateAbbr;
    private int candidateId;
    @OneToOne
    private Measures measures; 
    @OneToMany 
    private Set<District> districts;

    // public double getDistrictingMeasure(MeasureType type) {
    //     return this.measures.getDistrictingMeasure(type);
    // }

    @Override 
    public String toString() {
        return this.candidateId + ": " + this.stateAbbr + " " + this.candidateId;
    }
}
