package hornets.app.model;

// split off pop from dem
public enum PopulationType {
    TOTAL_POP(0),
    VAP(1), // Voting Age Population
    CVAP(2); // Citizen Voting Age Population

    private final int value;

    private PopulationType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}
