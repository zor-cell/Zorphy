package net.zorphy.backend.site.core.http.dto;

public interface SavableGameState extends GameStateBase {
    boolean isSaved();
    SavableGameState withSaved(boolean saved);
}
