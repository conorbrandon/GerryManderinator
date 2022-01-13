package hornets.app.model;

import java.util.Map;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import javax.persistence.ManyToOne;
import javax.persistence.MapKeyEnumerated;
import javax.persistence.OneToMany;

@Entity
@Builder(toBuilder = true)
@Getter 
@Setter 
@NoArgsConstructor
@AllArgsConstructor
@Table(name="Precincts")
public class Precinct {
    @Id 
    @GeneratedValue 
    private Long id;
    private String stateAbbr;
    private String precinctName;
    @OneToMany
    @MapKeyEnumerated(EnumType.STRING)
    private Map<ElectionType, Election> elections;

}
// https://thorben-janssen.com/many-relationships-additional-properties/