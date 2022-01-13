package hornets.app.util;

public enum AlgorithmStatus {
    RUNNING(0),
    PAUSED(1),
    STOPPED(2),
    COMPLETED(3);

    private final int value;

    private AlgorithmStatus(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}
