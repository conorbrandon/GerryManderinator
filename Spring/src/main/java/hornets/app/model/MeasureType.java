package hornets.app.model;

public enum MeasureType {
    EQUAL_POPULATION_VARIANCE(0),
    NUM_OPPORTUNITY_DISTRICTS(1),
    POLSBY_POPPER(2),
    GRAPH_COMPACTNESS(3),
    SPLIT_COUNTIES_SCORE(4),
    NUM_SPLIT_COUNTIES(5),
    DEVIATION_FROM_ENACTED_AREA(6),
    OBJ_FUNC(7);

    private final int value;

    private MeasureType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}
