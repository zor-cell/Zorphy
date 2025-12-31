package net.zorphy.backend.site.core.http.dto;

public interface SavableGameState extends GameStateBase {
    boolean isSaved();

    /**
     * Returns a new instance of {@code SavableGameState} with the updated {@code isSaved} flag
     */
    SavableGameState withSaved(boolean saved);
}
