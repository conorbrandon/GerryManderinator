package hornets.app.model;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.Lob;
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


@Entity
@Builder(toBuilder = true)
@Getter 
@Setter 
@AllArgsConstructor
@NoArgsConstructor
@Table(name="States")
public class State {
    @Id 
    private String stateAbbr;
    private String longName;
    private int numDistricts;
    @OneToMany(fetch = FetchType.EAGER)  // maybe should make these OneToOne for this and elections too, and in other entities
    @MapKeyEnumerated(EnumType.STRING)
    private Map<PopulationType, Demographics> demographics;
    @OneToMany(fetch = FetchType.EAGER)
    @MapKeyEnumerated(EnumType.STRING)
    private Map<ElectionType, Election> elections;
    @OneToMany 
    private List<Districting> districtings;
    @Lob
    private String countiesGeoJson;
    @Lob
    private String boxWhiskerData; 
    private double latitude;
    private double longitude;
    private double mapZoom;

    @Override
    public String toString() {
        return this.longName;
    }

    // public String getBoxAndWhiskerForGroupType(BoxWhiskerType type) {
    //     return this.boxWhiskerData.get(type);
    // }
}
