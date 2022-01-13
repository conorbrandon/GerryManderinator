package hornets.app.util;

import hornets.app.model.PopulationType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter 
@NoArgsConstructor
public class UserParams {
    private long timeout; //in ms
    private double eqPopThresh;
    private String stateAbbr;
    private int candidateId;
    private PopulationType popType;
    // may be more threshold values here...

    private static boolean isValidTimeout(long timeout) {
        return timeout > 0;
    }

    private static boolean isValidEqPopthresh(double eqPopThresh) {
        return eqPopThresh > 0;
    }

    private static boolean isValidPopType(String popString) {
        return Constants.POP_MAP.containsKey(popString);
    }

    public static boolean isValidParams(long timeout, double eqPopThresh, String popString) {
        return isValidTimeout(timeout) && isValidEqPopthresh(eqPopThresh) && isValidPopType(popString);
    }

    public UserParams(long timeout, double eqPopThresh, String stateAbbr, int candidateId, String popString) throws Exception {
        if (isValidParams(timeout, eqPopThresh, popString)) {
            this.timeout = timeout;
            this.eqPopThresh = eqPopThresh;
            this.stateAbbr = stateAbbr;
            this.candidateId = candidateId;
            this.popType = Constants.POP_MAP.get(popString);
        }
        else {
            throw new Exception("Invalid user parameters");
        }
    }

    public void setTimeout(long timeout) throws Exception {
        if (isValidTimeout(timeout)) {
            this.timeout = timeout;
        }
        else {
            throw new Exception("Invalid user parameters");
        }
    }

    public void setEqPopThresh(double eqPopThresh) throws Exception {
        if (isValidEqPopthresh(eqPopThresh)) {
            this.eqPopThresh = eqPopThresh;
        }
        else {
            throw new Exception("Invalid user parameters");
        }
    }

    public void setPopType(String popString) throws Exception {
        if (isValidPopType(popString)) {
            this.popType = Constants.POP_MAP.get(popString);
        }
        else {
            throw new Exception("Invalid user parameters");
        }
    }

    public String toString() {
        return "{\n\t\"stateAbbr\":\"" + stateAbbr + "\",\n\t\"candidateId\":" + candidateId 
            + ",\n\t\"timeout\":" + timeout + ",\n\t\"eqPopTresh\":" + eqPopThresh + ",\n\t\"PopType\":" 
            + popType + "\n}";
    }

    public String getStateAbbr() {
        return this.stateAbbr;
    }
}
