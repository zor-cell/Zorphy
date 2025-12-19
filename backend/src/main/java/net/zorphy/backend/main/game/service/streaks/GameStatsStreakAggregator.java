package net.zorphy.backend.main.game.service.streaks;

import net.zorphy.backend.main.game.dto.GameDetails;
import net.zorphy.backend.main.game.dto.stats.streaks.GameStatsStreak;
import net.zorphy.backend.main.game.dto.stats.streaks.GameStatsStreakResult;

import java.util.Comparator;
import java.util.TreeSet;
import java.util.UUID;

public class GameStatsStreakAggregator {
    private final TreeSet<StreakEvent> events = new TreeSet<>(
            Comparator.comparing(e -> e.game().metadata().playedAt())
    );

    public void add(boolean isInStreak, GameDetails game, UUID playerId) {
        var entry = new StreakEvent(
                isInStreak,
                game,
                playerId
        );
        events.add(entry);
    }

    public GameStatsStreakResult calculate() {
        GameStatsStreak currentStreak = new GameStatsStreak(0, null, null, null);
        GameStatsStreak maxStreak = new GameStatsStreak(0, null, null, null);

        for(StreakEvent event : events) {
            if(event.isInStreak()) {
                //update current streak
                if(currentStreak.streak() == 0) {
                    currentStreak = new GameStatsStreak(1, event.game(), null, event.playerId());
                } else {
                    currentStreak = new GameStatsStreak(
                            currentStreak.streak() + 1,
                            currentStreak.start(),
                            event.game(),
                            currentStreak.playerId()
                    );
                }

                //update max streak
                if(currentStreak.streak() > maxStreak.streak()) {
                    maxStreak = currentStreak;
                }
            } else {
                //reset current streak
                currentStreak = new GameStatsStreak(0, null, null, null);
            }
        }

        return new GameStatsStreakResult(currentStreak, maxStreak);
    }
}
