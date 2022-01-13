package hornets.app.model;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.Table;
import javax.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import javax.persistence.ManyToOne;
import javax.persistence.MapKeyEnumerated;
import javax.persistence.OneToMany;
import javax.persistence.ManyToMany;

import java.util.Map;
import java.util.Set;

@Entity
@Builder(toBuilder = true)
@Getter 
@Setter 
@NoArgsConstructor
@AllArgsConstructor
@Table(name="CensusBlocks")
public class CensusBlock {
    @Id
    private String geoId;
    private String stateAbbr;
    @Lob // turns out we do need this
    private String geoJson;
    @ManyToOne
    private County county;
    @ManyToOne
    private Precinct precinct;
    @OneToMany(cascade = CascadeType.REMOVE)
    @MapKeyEnumerated(EnumType.STRING)
    private Map<PopulationType, Demographics> demographics;
    @ManyToMany
    private Set<CensusBlock> neighbors;

    @Transient
    private int districtNum;
    @Transient
    private boolean boundaryNode;

    // below are just for db loading purposes
    @Transient
    private String precinctName; 
    @Transient
    private String countyName;
    @Transient
    private int graphId;

    public int getNeighboringDistrict() {
        for (CensusBlock cb : this.neighbors) {
            int otherDistrictNum = cb.getDistrictNum();
             if (otherDistrictNum != this.districtNum) {
                if (otherDistrictNum == 0) {
                    System.out.println(cb);
                }
                 return otherDistrictNum;
             }
        }
        return -1; //on edge of state, no neighboring districts
    }

    public String toString() {
        return "CB " + geoId + ", County: " + countyName + ", District: " + districtNum;
    }
}
