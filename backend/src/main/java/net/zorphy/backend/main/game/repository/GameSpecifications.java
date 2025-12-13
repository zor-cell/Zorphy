package net.zorphy.backend.main.game.repository;

import jakarta.persistence.criteria.*;
import net.zorphy.backend.main.game.dto.GameFilters;
import net.zorphy.backend.main.game.dto.GameType;
import net.zorphy.backend.main.game.entity.Game;
import net.zorphy.backend.main.game.entity.Game_;
import net.zorphy.backend.main.player.entity.Player;
import net.zorphy.backend.main.player.entity.Player_;
import org.springframework.data.jpa.domain.Specification;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class GameSpecifications {
    public static Specification<Game> search(GameFilters gameFilters) {
        return (root, query, cb) -> {
            List<Predicate> wherePredicates = new ArrayList<>();
            List<Predicate> havingPredicates = new ArrayList<>();

            //joins
            Join<Game, Player> playerJoin = root.join(Game_.players, JoinType.LEFT);

            //playedAt
            Path<Instant> playedAt = root.get(Game_.playedAt);
            Predicate playedAtPredicate = null;
            if(gameFilters.dateFrom() != null && gameFilters.dateTo() != null) {
                //from - to
                playedAtPredicate = cb.between(playedAt, gameFilters.dateFrom(), gameFilters.dateTo());
            } else if(gameFilters.dateFrom() != null) {
                //from -
                playedAtPredicate = cb.greaterThanOrEqualTo(playedAt, gameFilters.dateFrom());
            } else if(gameFilters.dateTo() != null) {
                // - to
                playedAtPredicate = cb.lessThanOrEqualTo(playedAt, gameFilters.dateTo());
            }
            if(playedAtPredicate != null) {
                wherePredicates.add(playedAtPredicate);
            }

            //duration (is stored in seconds in db so compare seconds)
            Expression<Long> duration = root.get(Game_.duration).as(Long.class);
            Predicate durationPredicate = null;

            Long minSec = gameFilters.minDuration() != null ? gameFilters.minDuration().getSeconds() : null;
            Long maxSec = gameFilters.maxDuration() != null ? gameFilters.maxDuration().getSeconds() : null;
            if(gameFilters.minDuration() != null && gameFilters.maxDuration() != null) {
                //from - to
                durationPredicate = cb.between(duration, minSec, maxSec);
            } else if(gameFilters.minDuration() != null) {
                //from -
                durationPredicate = cb.greaterThanOrEqualTo(duration, minSec);
            } else if(gameFilters.maxDuration() != null) {
                // - to
                durationPredicate = cb.lessThanOrEqualTo(duration, maxSec);
            }
            if(durationPredicate != null) {
                wherePredicates.add(durationPredicate);
            }

            //game type
            if(gameFilters.gameTypes() != null && !gameFilters.gameTypes().isEmpty()) {
                Path<String> gameType = root.get(Game_.gameType);
                Predicate all = cb.or();
                for(GameType filterGameType : gameFilters.gameTypes()) {
                    Predicate cur = cb.like(cb.lower(gameType), "%" + filterGameType.toString().toLowerCase() + "%");
                    all = cb.or(cur, all);
                }
                wherePredicates.add(all);
            }

            //text
            if(gameFilters.text() != null && !gameFilters.text().isEmpty()) {
                //search game type
                Path<String> gameType = root.get(Game_.gameType);
                Predicate gameTypePredicate = cb.like(cb.lower(gameType), "%" + gameFilters.text().toLowerCase() + "%");

                //jsonb query to recursively check all properties values with regex
                String searchText = gameFilters.text().replace("\"", "\\\"");
                String jsonQuery = "$.** ? (@ like_regex \"" + searchText + "\" flag \"i\")";

                //search game state
                Predicate gameStatePredicate = cb.isTrue(cb.function(
                        "jsonb_path_exists",
                        Boolean.class,
                        root.get(Game_.gameState),
                        cb.literal(jsonQuery)
                ));

                //search result state
                Predicate resultStatePredicate = cb.isTrue(cb.function(
                        "jsonb_path_exists",
                        Boolean.class,
                        root.get(Game_.result),
                        cb.literal(jsonQuery)
                ));

                wherePredicates.add(cb.or(
                        gameTypePredicate,
                        gameStatePredicate,
                        resultStatePredicate
                ));
            }


            //player related (having clause)
            if(gameFilters.minPlayers() != null || gameFilters.maxPlayers() != null || (gameFilters.players() != null && !gameFilters.players().isEmpty())) {
                query.groupBy(root.get(Game_.id));

                //player count
                Expression<Long> playerCount = cb.count(playerJoin.get(Player_.id));
                Predicate playerCountPredicate = null;
                if(gameFilters.minPlayers() != null && gameFilters.maxPlayers() != null) {
                    playerCountPredicate = cb.between(playerCount, gameFilters.minPlayers().longValue(), gameFilters.maxPlayers().longValue());
                } else if(gameFilters.minPlayers() != null) {
                    playerCountPredicate = cb.greaterThanOrEqualTo(playerCount, gameFilters.minPlayers().longValue());
                } else if(gameFilters.maxPlayers() != null) {
                    playerCountPredicate = cb.lessThanOrEqualTo(playerCount, gameFilters.maxPlayers().longValue());
                }
                if(playerCountPredicate != null) {
                    havingPredicates.add(playerCountPredicate);
                }

                //players
                if(gameFilters.players() != null && !gameFilters.players().isEmpty()) {
                    //havingPredicates.add(playerJoin.get(Player_.id).in(gameFilters.players()));
                    Expression<Long> matchingPlayers = cb.count(
                            cb.selectCase()
                                    .when(playerJoin.get(Player_.id).in(gameFilters.players()), 1)
                                    .otherwise((Integer) null)
                    );

                    havingPredicates.add(cb.equal(matchingPlayers, gameFilters.players().size()));
                }
            }

            //set queries having clause
            if (!havingPredicates.isEmpty()) {
                Predicate finalHaving = cb.and(havingPredicates.toArray(new Predicate[0]));
                query.having(finalHaving);
            }

            return cb.and(wherePredicates.toArray(new Predicate[0]));
        };
    }
}
