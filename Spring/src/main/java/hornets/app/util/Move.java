package hornets.app.util;

import hornets.app.model.CensusBlock;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter 
@Setter 
@AllArgsConstructor
@NoArgsConstructor
public class Move {
    private CensusBlock censusBlock;
    private int originalDistrictNum;
}