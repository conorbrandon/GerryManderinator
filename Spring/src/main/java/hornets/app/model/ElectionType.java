package hornets.app.model;

public enum ElectionType {
    PRE20(0),
    HOU20(1),
    USS20(2),
    USS18(3),
    ATG18(4);

    private final int value;

    private ElectionType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}
