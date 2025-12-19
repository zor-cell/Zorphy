package net.zorphy.backend.main.game.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.zorphy.backend.main.game.dto.GameType;
import net.zorphy.backend.main.game.dto.stats.GameSpecificStats;
import net.zorphy.backend.main.game.dto.stats.GameStats;
import net.zorphy.backend.main.game.dto.stats.chart.ChartData;
import net.zorphy.backend.main.game.dto.stats.chart.ChartEntry;
import net.zorphy.backend.main.game.dto.stats.correlation.CorrelationAxisType;
import net.zorphy.backend.main.game.dto.stats.correlation.CorrelationDataPoint;
import net.zorphy.backend.main.game.dto.stats.correlation.CorrelationMetadata;
import net.zorphy.backend.main.game.dto.stats.correlation.CorrelationResult;
import net.zorphy.backend.main.game.service.streaks.GameStatsStreakAggregator;
import net.zorphy.backend.main.player.dto.PlayerDetails;
import net.zorphy.backend.main.game.entity.Game;
import net.zorphy.backend.main.game.repository.GameMapper;
import net.zorphy.backend.main.game.service.metrics.DoubleArithmeticStrategy;
import net.zorphy.backend.main.game.service.metrics.DurationArithmeticStrategy;
import net.zorphy.backend.main.game.service.metrics.GameStatsMetricAggregator;
import net.zorphy.backend.site.all.http.dto.ResultState;
import net.zorphy.backend.site.all.http.dto.ResultTeamState;
import net.zorphy.backend.site.all.shared.service.GameSpecificStatsCalculator;
import org.apache.commons.math3.stat.correlation.PearsonsCorrelation;
import org.apache.commons.math3.stat.regression.SimpleRegression;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.*;
import java.util.function.ToDoubleFunction;

@Component
public class GameStatsUtil {
    private final Map<GameType, GameSpecificStatsCalculator> statsCalculatorMap = new HashMap<>();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final GameMapper gameMapper;

    public GameStatsUtil(List<GameSpecificStatsCalculator> calculators, GameMapper gameMapper) {
        for (var calc : calculators) {
            statsCalculatorMap.put(calc.supportedType(), calc);
        }
        this.gameMapper = gameMapper;
    }

    /**
     * Computes the game stats for a given {@code currentPlayer} and given {@code games}.
     */
    public GameStats computeStats(PlayerDetails currentPlayer, GameType gameType, List<Game> games) {
        Map<PlayerDetails, PlayerInfo> opponentMap = new HashMap<>();
        Map<PlayerDetails, PlayerInfo> teammateMap = new HashMap<>();

        //correlation data
        List<CorrelationResult> correlations = new ArrayList<>();
        List<CorrelationDataPoint> startingPositionToScore = new ArrayList<>();

        //chart data
        List<ChartData> chartData = new ArrayList<>();
        List<ChartEntry> scoreEntries = new ArrayList<>();

        int gamesPlayed = 0;
        int gamesWon = 0;

        //metrics
        GameStatsMetricAggregator<Double> scoreMetrics = new GameStatsMetricAggregator<>(new DoubleArithmeticStrategy());
        GameStatsMetricAggregator<Duration> durationMetrics = new GameStatsMetricAggregator<>(new DurationArithmeticStrategy());

        //streaks
        GameStatsStreakAggregator winStreaks = new GameStatsStreakAggregator();

        for (Game game : games) {
            try {
                ResultState result = objectMapper.convertValue(game.getResult(), ResultState.class);

                //get player team data
                ResultTeamState playerTeam = getResultTeam(result, currentPlayer.id());

                //get winner team data
                ResultTeamState winnerTeam = getWinnerTeam(result);
                boolean playerIsWinner = winnerTeam.team().players().stream()
                        .anyMatch(p -> currentPlayer.id().equals(p.id()));

                //update teammates
                for (PlayerDetails teammate : playerTeam.team().players()) {
                    if (!currentPlayer.id().equals(teammate.id())) {
                        updatePlayerMap(teammateMap, teammate, playerIsWinner);
                    }
                }

                //update opponents
                if (playerIsWinner) {
                    //all players are counted since current player won
                    for (ResultTeamState teamResult : result.teams()) {
                        if (teamResult.equals(playerTeam)) continue;

                        for (PlayerDetails player : teamResult.team().players()) {
                            updatePlayerMap(opponentMap, player, true);
                        }
                    }
                } else {
                    //all players from winning team are counted
                    for (var opponent : winnerTeam.team().players()) {
                        updatePlayerMap(opponentMap, opponent, false);
                    }
                }

                //metrics
                int curScore = playerTeam.score();
                scoreMetrics.update(game.getId(), (double) curScore);

                Duration curDuration = game.getDuration();
                durationMetrics.update(game.getId(), curDuration);

                //streaks
                winStreaks.add(playerIsWinner, gameMapper.gameToGameDetails(game), currentPlayer.id());

                //player specific stats
                gamesPlayed++;
                if (playerIsWinner) gamesWon++;

                //correlation data
                int playerStartPosition = result.teams().indexOf(playerTeam);
                startingPositionToScore.add(new CorrelationDataPoint(
                        playerStartPosition + 1,
                        curScore,
                        playerIsWinner
                ));

                //chart data
                scoreEntries.add(new ChartEntry(
                        game.getPlayedAt(),
                        curScore,
                        playerIsWinner
                ));
            } catch (Exception e) {
                //continue if object mapping to result failed
                int i = 0;
            }
        }

        //player has worst win rate against this opponent
        PlayerDetails nemesis = getExtremePlayer(opponentMap, PlayerInfo::getWinRate, false);

        //player has best win rate against this opponent
        PlayerDetails victim = getExtremePlayer(opponentMap, PlayerInfo::getWinRate, true);

        //player has played most against opponent
        PlayerDetails rival = getExtremePlayer(opponentMap, info -> info.gamesPlayed, true);

        //player has played most with teammate
        PlayerDetails companion = getExtremePlayer(teammateMap, info -> info.gamesPlayed, true);

        //correlation data
        var startPosCorrelation = computeCorrelation(startingPositionToScore, new CorrelationMetadata(
                "Starting Position - Score",
                "Starting Position",
                "Score",
                CorrelationAxisType.CATEGORY
        ));
        correlations.add(startPosCorrelation);

        //chart data
        chartData.add(new ChartData(
                scoreEntries
        ));

        //game specific stats
        GameSpecificStats gameSpecificStats = null;
        GameSpecificStatsCalculator calc = statsCalculatorMap.get(gameType);
        if (calc != null) {
            gameSpecificStats = calc.compute(currentPlayer, games, correlations);
        }

        return new GameStats(
                currentPlayer,
                gamesPlayed,
                computeFraction(gamesWon, gamesPlayed),
                winStreaks.calculate(),
                scoreMetrics.aggregate(),
                durationMetrics.aggregate(),
                nemesis,
                victim,
                rival,
                companion,
                correlations,
                chartData,
                gameSpecificStats
        );
    }

    /**
     * Computes the fraction {@code num} / {@code den}.
     * If {@code den} is 0, 0 is returned.
     */
    public static double computeFraction(double num, double den) {
        if (den == 0) {
            return 0;
        }

        return num / den;
    }

    /**
     * Get the team of the player given with {@code playerId} from the given {@code result}
     */
    public static ResultTeamState getResultTeam(ResultState result, UUID playerId) {
        ResultTeamState playerTeam = result.teams().stream()
                .filter(team -> team.team().players().stream().anyMatch(p -> playerId.equals(p.id())))
                .findFirst()
                .orElse(null);
        assert playerTeam != null;

        return playerTeam;
    }

    /**
     * Get the winning team of a given {@code result}
     */
    public static ResultTeamState getWinnerTeam(ResultState result) {
        ResultTeamState winnerTeam = result.teams().stream()
                .max(Comparator.comparingInt(ResultTeamState::score))
                .orElse(null);
        assert winnerTeam != null;

        return winnerTeam;
    }

    /**
     * Compute the correlation data for the given {@code points}.
     */
    public static CorrelationResult computeCorrelation(List<CorrelationDataPoint> points, CorrelationMetadata metadata) {
        if (points.size() < 2) {
            return new CorrelationResult(
                    metadata,
                    0,
                    0,
                    0,
                    List.of()
            );
        }

        double[] x = points.stream().mapToDouble(CorrelationDataPoint::x).toArray();
        double[] y = points.stream().mapToDouble(CorrelationDataPoint::y).toArray();

        //correlation
        PearsonsCorrelation cor = new PearsonsCorrelation();
        double coefficient = cor.correlation(x, y);

        // simple regression
        SimpleRegression regression = new SimpleRegression();
        for (CorrelationDataPoint point : points) {
            regression.addData(point.x(), point.y());
        }

        double slope = regression.getSlope();
        double intercept = regression.getIntercept();

        return new CorrelationResult(
                metadata,
                coefficient,
                slope,
                intercept,
                points);
    }

    private static void updatePlayerMap(Map<PlayerDetails, PlayerInfo> map, PlayerDetails player, boolean isWinner) {
        int increment = isWinner ? 1 : 0;
        map.compute(player, (p, info) -> {
            if (info == null) {
                return new PlayerInfo(1, increment);
            }

            return new PlayerInfo(info.gamesPlayed + 1, info.gamesWon + increment);
        });
    }

    private static PlayerDetails getExtremePlayer(Map<PlayerDetails, PlayerInfo> map, ToDoubleFunction<PlayerInfo> metric, boolean max) {
        if (max) {
            return map.entrySet().stream()
                    .max(Comparator.comparingDouble(entry -> metric.applyAsDouble(entry.getValue())))
                    .map(Map.Entry::getKey)
                    .orElse(null);
        }

        return map.entrySet().stream()
                .min(Comparator.comparingDouble(entry -> metric.applyAsDouble(entry.getValue())))
                .map(Map.Entry::getKey)
                .orElse(null);
    }

    private static class PlayerInfo {
        //the games the main player has played against the player
        public int gamesPlayed;

        //the games the main player has won against the player
        public int gamesWon;

        public PlayerInfo(int gamesPlayed, int gamesWon) {
            this.gamesPlayed = gamesPlayed;
            this.gamesWon = gamesWon;
        }

        public double getWinRate() {
            if (gamesPlayed == 0) return 0;

            return (double) gamesWon / gamesPlayed;
        }
    }
}
