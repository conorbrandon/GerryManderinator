package hornets.app.model;

public enum RacialType {
    WHITE(0),
    BLACK_OR_AFRICAN_AMERICAN(1),
    AMERICAN_INDIAN_AND_ALASKA_NATIVE(2),
    ASIAN(3),
    NATIVE_HAWAIIAN_AND_OTHER_PACIFIC_ISLANDER(4),
    SOME_OTHER_RACE(5),
    TWO_OR_MORE_RACES(6),
    HISPANIC(7),
    ALL(8);

    private final int value;

    private RacialType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    // https://www.census.gov/quickfacts/fact/note/US/RHI625219 official census designations
}
