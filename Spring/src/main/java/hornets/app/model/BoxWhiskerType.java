package hornets.app.model;

public enum BoxWhiskerType {
    DEMOCRATIC_PARTY(0),
    REPUBLICAN_PARTY(1),
    WHITE(2),
    BLACK_OR_AFRICAN_AMERICAN(3),
    AMERICAN_INDIAN_AND_ALASKA_NATIVE(4),
    ASIAN(5);

    private final int value;

    private BoxWhiskerType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}
