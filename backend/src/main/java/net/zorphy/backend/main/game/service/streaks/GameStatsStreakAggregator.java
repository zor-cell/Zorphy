package net.zorphy.backend.main.game.service.streaks;

import net.zorphy.backend.main.game.dto.stats.streaks.GameStatsStreak;
import net.zorphy.backend.main.game.dto.stats.streaks.GameStatsStreakResult;

import java.time.Instant;
import java.util.Comparator;
import java.util.TreeSet;

public class GameStatsStreakAggregator {
    private final TreeSet<StreakEvent> events = new TreeSet<>(
            Comparator.comparing(StreakEvent::time)
    );

    public void add(boolean isInStreak, Instant time) {
        var entry = new StreakEvent(
                isInStreak,
                time
        );
        events.add(entry);
    }

    public GameStatsStreakResult calculate() {
        GameStatsStreak currentStreak = new GameStatsStreak(0, null, null);
        GameStatsStreak maxStreak = new GameStatsStreak(0, null, null);

        for(StreakEvent event : events) {
            if(event.isInStreak()) {
                //update current streak
                if(currentStreak.streak() == 0) {
                    currentStreak = new GameStatsStreak(1, event.time(), null);
                } else {
                    currentStreak = new GameStatsStreak(
                            currentStreak.streak() + 1,
                            currentStreak.start(),
                            event.time()
                    );
                }

                //update max streak
                if(currentStreak.streak() > maxStreak.streak()) {
                    maxStreak = currentStreak;
                }
            } else {
                //reset current streak
                currentStreak = new GameStatsStreak(0, null, null);
            }
        }

        return new GameStatsStreakResult(currentStreak, maxStreak);
    }
}
