package net.zorphy.backend.site.catan.component;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.zorphy.backend.main.all.component.CustomObjectMapperComponent;
import net.zorphy.backend.main.game.dto.GameType;
import net.zorphy.backend.main.game.dto.stats.correlation.CorrelationAxisType;
import net.zorphy.backend.main.game.dto.stats.correlation.CorrelationDataPoint;
import net.zorphy.backend.main.game.dto.stats.correlation.CorrelationMetadata;
import net.zorphy.backend.main.game.dto.stats.correlation.CorrelationResult;
import net.zorphy.backend.main.player.dto.PlayerDetails;
import net.zorphy.backend.site.all.http.dto.TeamDetails;
import net.zorphy.backend.main.game.entity.Game;
import net.zorphy.backend.main.game.service.metrics.DurationArithmeticStrategy;
import net.zorphy.backend.main.game.service.metrics.GameStatsMetricAggregator;
import net.zorphy.backend.site.all.shared.service.GameSpecificStatsCalculator;
import net.zorphy.backend.main.game.service.GameStatsUtil;
import net.zorphy.backend.site.all.http.dto.ResultState;
import net.zorphy.backend.site.all.http.dto.ResultTeamState;
import net.zorphy.backend.site.catan.dto.DiceRoll;
import net.zorphy.backend.site.catan.dto.game.GameState;
import net.zorphy.backend.site.catan.dto.game.GameStats;
import org.apache.commons.math3.stat.descriptive.DescriptiveStatistics;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

@Component("CatanGameStatsCalculator")
public class GameStatsCalculator implements GameSpecificStatsCalculator {
    private final ObjectMapper objectMapper;

    public GameStatsCalculator(CustomObjectMapperComponent customObjectMapper) {
        this.objectMapper = customObjectMapper.getMapper();
    }

    @Override
    public GameType supportedType() {
        return GameType.CATAN;
    }

    @Override
    public GameStats compute(PlayerDetails currentPlayer, List<Game> games, List<CorrelationResult> correlations) {
        List<CorrelationDataPoint> robberToScore = new ArrayList<>();

        List<DiceRoll> diceRolls = new ArrayList<>();
        int gameCount = 0;
        double totalLuckMetrics = 0;

        GameStatsMetricAggregator<Duration> rollDurationMetrics = new GameStatsMetricAggregator<>(new DurationArithmeticStrategy());

        for (Game game : games) {
            try {
                GameState gameState = objectMapper.convertValue(game.getGameState(), GameState.class);
                ResultState result = objectMapper.convertValue(game.getResult(), ResultState.class);

                ResultTeamState resultPlayerTeam = GameStatsUtil.getResultTeam(result, currentPlayer.id());
                ResultTeamState winnerTeam = GameStatsUtil.getWinnerTeam(result);
                boolean playerIsWinner = winnerTeam.team().players().stream()
                        .anyMatch(p -> currentPlayer.id().equals(p.id()));

                TeamDetails playerTeam = gameState.gameConfig().teams().stream()
                        .filter(t -> t.players()
                                .stream()
                                .anyMatch(player -> currentPlayer.id().equals(player.id())))
                        .findFirst().orElse(null);

                //compatibility for early games where no player id was saved
                if (playerTeam == null) {
                    playerTeam = gameState.gameConfig().teams().stream()
                            .filter(t -> t.players()
                                    .stream()
                                    .anyMatch(player -> player.name().equals(currentPlayer.name())))
                            .findFirst()
                            .orElse(null);
                }
                assert playerTeam != null;

                int numberOfSevens = 0;
                for (int i = 0;i < gameState.diceRolls().size();i++) {
                    var diceRoll = gameState.diceRolls().get(i);

                    if (!diceRoll.teamName().equals(playerTeam.name())) continue;

                    //dice rolls should all be under player name
                    diceRolls.add(new DiceRoll(
                            diceRoll.dicePair(),
                            diceRoll.diceEvent(),
                            currentPlayer.name(),
                            diceRoll.rollTime()
                    ));

                    if (diceRoll.dicePair().sum() == 7) {
                        numberOfSevens++;
                    }

                    //get roll durations
                    if(i < gameState.diceRolls().size() - 1) {
                        var next = gameState.diceRolls().get(i + 1);
                        if(diceRoll.rollTime() != null && next.rollTime() != null) {
                            Duration curDuration = Duration.between(diceRoll.rollTime(), next.rollTime());
                            rollDurationMetrics.update(game.getId(), curDuration);
                        }
                    }
                }
                double relativeSevens = GameStatsUtil.computeFraction(numberOfSevens, diceRolls.size());
                robberToScore.add(new CorrelationDataPoint(
                        relativeSevens * 100,
                        resultPlayerTeam.score(),
                        playerIsWinner
                ));

                gameCount++;
                totalLuckMetrics += computeLuckMetric(gameState, playerTeam);
            } catch (Exception e) {
                //continue if object mapping to game state failed
                int i = 0;
            }
        }

        //compute correlation
        var robberToScoreCorrelation = GameStatsUtil.computeCorrelation(robberToScore, new CorrelationMetadata(
                "Robbers - Score",
                "Robbers [%]",
                "Score",
                CorrelationAxisType.LINEAR
        ));
        correlations.add(robberToScoreCorrelation);

        return new GameStats(
                gameCount,
                GameStatsUtil.computeFraction(totalLuckMetrics, gameCount),
                rollDurationMetrics.aggregate(),
                diceRolls
        );
    }

    private double computeLuckMetric(GameState gameState, TeamDetails playerTeam) {
        List<DiceRoll> diceRolls = gameState.diceRolls();

        if (gameState.diceRolls().isEmpty()) return 0;

        int playerSevenCount = 0;
        int totalSevenCount = 0;
        DescriptiveStatistics playerStats = new DescriptiveStatistics();
        DescriptiveStatistics totalStats = new DescriptiveStatistics();

        for (DiceRoll diceRoll : diceRolls) {
            int sum = diceRoll.dicePair().sum();

            //add player stats
            if (playerTeam.name().equals(diceRoll.teamName())) {
                if (sum == 7) {
                    playerSevenCount++;
                }
                playerStats.addValue(sum);
            }

            //add total stats
            if (sum == 7) {
                totalSevenCount++;
            }
            totalStats.addValue(sum);
        }

        if(playerStats.getValues().length == 0 || totalStats.getValues().length == 0) return 0;

        double R = totalSevenCount == 0 ? 0 : (double) playerSevenCount / totalSevenCount; //TODO amount of players also important

        double playerVariance = playerStats.getVariance();
        double playerStdDev = playerStats.getStandardDeviation();

        double totalVariance = totalStats.getVariance();
        double totalStdDev = totalStats.getStandardDeviation();

        double V_player = playerVariance > 0 ? Math.min(1.0, playerVariance / (playerVariance + playerStdDev * 2)) : 0;
        double V_total = totalVariance > 0 ? Math.min(1.0, totalVariance / (totalVariance + totalStdDev * 2)) : 0;


        //weights
        final double w_v = 0.4;
        final double w_r = 0.6;

        double luckRaw = w_v * V_player + w_r * R;

        return 10 * luckRaw;
    }
}