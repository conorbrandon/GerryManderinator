package hornets.app.model;

import java.util.Map;
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

@Entity
@Builder(toBuilder = true)
@Getter 
@Setter 
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Demographics")
public class Demographics {

    @Id
    @GeneratedValue
    Long id;
    @ElementCollection
    @MapKeyEnumerated(EnumType.STRING)
    private Map<RacialType, Integer> populations;

    public int getPopulationbyRace(RacialType type) {
        return this.populations.get(type);
    }

}
