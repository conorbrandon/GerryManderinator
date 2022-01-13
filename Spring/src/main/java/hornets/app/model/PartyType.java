package hornets.app.model;

public enum PartyType {
    DEMOCRATIC_PARTY(0),
    REPUBLICAN_PARTY(1);

    private final int value;

    private PartyType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}
