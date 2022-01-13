package hornets.app.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
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
@Table(name="Counties")
public class County {
    @Id 
    @GeneratedValue 
    private Long id;
    private String stateAbbr;
    private String countyName;
    
}
