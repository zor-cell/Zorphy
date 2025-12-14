package net.zorphy.backend.main.game.entity;

import com.vladmihalcea.hibernate.type.json.JsonType;
import jakarta.persistence.*;
import net.zorphy.backend.main.player.entity.Player;
import net.zorphy.backend.site.all.dto.http.GameStateBase;
import net.zorphy.backend.site.all.dto.http.ResultStateBase;
import org.hibernate.annotations.Type;

import java.time.Duration;
import java.time.Instant;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "games")
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private Instant playedAt;

    private Duration duration;

    private String gameType;

    private String imageUrl;

    @Type(JsonType.class)
    @Column(columnDefinition = "jsonb")
    private GameStateBase gameState;

    @Type(JsonType.class)
    @Column(columnDefinition = "jsonb")
    private ResultStateBase result;

    @ManyToMany
    @JoinTable(
            name = "game_player",
            joinColumns = @JoinColumn(name = "game_id"),
            inverseJoinColumns = @JoinColumn(name = "player_id")
    )
    private Set<Player> players;

    public Game() {
    }

    public Game(Instant playedAt, Duration duration, String gameType, String imageUrl, GameStateBase gameState, ResultStateBase result, Set<Player> players) {
        this.playedAt = playedAt;
        this.duration = duration;
        this.gameType = gameType;
        this.imageUrl = imageUrl;
        this.gameState = gameState;
        this.result = result;
        this.players = players;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Instant getPlayedAt() {
        return playedAt;
    }

    public void setPlayedAt(Instant playedAt) {
        this.playedAt = playedAt;
    }

    public Duration getDuration() {
        return duration;
    }

    public void setDuration(Duration duration) {
        this.duration = duration;
    }

    public String getGameType() {
        return gameType;
    }

    public void setGameType(String gameType) {
        this.gameType = gameType;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public GameStateBase getGameState() {
        return gameState;
    }

    public void setGameState(GameStateBase gameState) {
        this.gameState = gameState;
    }

    public ResultStateBase getResult() {
        return result;
    }

    public void setResult(ResultStateBase result) {
        this.result = result;
    }

    public Set<Player> getPlayers() {
        return players;
    }

    public void setPlayers(Set<Player> players) {
        this.players = players;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Game game)) return false;
        return Objects.equals(id, game.id) && Objects.equals(playedAt, game.playedAt) && gameType == game.gameType && Objects.equals(gameState, game.gameState) && Objects.equals(result, game.result) && Objects.equals(players, game.players);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, playedAt, gameType, gameState, result, players);
    }
}
