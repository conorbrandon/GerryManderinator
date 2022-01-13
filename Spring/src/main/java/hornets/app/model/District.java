package hornets.app.model;

import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.EnumType;
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
import java.util.List;
import java.util.Map;
import java.util.Set;

@Entity
@Builder(toBuilder = true)
@Getter 
@Setter 
@NoArgsConstructor
@AllArgsConstructor
@Table(name="Districts")
public class District {
    @Id 
    @GeneratedValue 
    private Long id;
    private String stateAbbr;
    private int candidateId;
    private int districtNumber;
    @OneToMany
    @MapKeyEnumerated(EnumType.STRING)
    private Map<PopulationType, Demographics> demographics;
    @OneToMany
    @MapKeyEnumerated(EnumType.STRING)
    private Map<ElectionType, Election> elections;
    private double graphCompactness;
    private double polsbyPopper;
    private int numSplitCounties;
    @OneToMany
    private Set<CensusBlock> censusBlocks;
    @ElementCollection
    private List<String> opportunityRaces;

}
