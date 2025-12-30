package net.zorphy.backend.site.catan.service;

import net.zorphy.backend.main.game.dto.GameDetails;
import net.zorphy.backend.main.game.dto.GameType;
import net.zorphy.backend.site.core.http.dto.TeamDetails;
import net.zorphy.backend.main.game.service.GameService;
import net.zorphy.backend.site.core.http.dto.ResultState;
import net.zorphy.backend.site.catan.dto.DicePair;
import net.zorphy.backend.site.catan.dto.DiceRoll;
import net.zorphy.backend.site.catan.dto.enums.GameMode;
import net.zorphy.backend.site.catan.dto.game.GameConfig;
import net.zorphy.backend.site.catan.dto.game.GameState;
import net.zorphy.backend.site.connect4.exception.InvalidOperationException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.*;

@Service
public class CatanServiceImpl implements CatanService {
    private final List<Character> possibleEvents = new ArrayList<>(Arrays.asList('e', 'e', 'e', 'y', 'b', 'g'));
    private final Random rand = new Random();

    private final GameService gameService;

    public CatanServiceImpl(GameService gameService) {
        this.gameService = gameService;
    }

    private List<DicePair> initClassicCards() {
        List<DicePair> classicCards = new ArrayList<>(Arrays.asList(
                new DicePair(1, 1, "Each player receives 1 resource of their choice"),

                new DicePair(1, 2, "The player with the most knight cards or the “Largest Army” may steal a card from another player"),
                new DicePair(2, 1, "No Event"),

                new DicePair(1, 3, "The robber is moved back to the desert"),
                new DicePair(2, 2, "The robber is moved back to the desert"),
                new DicePair(3, 1, "No Event"),

                new DicePair(1, 4, "The player with the “Longest Road” may steal a resource from another player"),
                new DicePair(2, 3, "The player with the most knight cards receives 1 resource of their choice"),
                new DicePair(3, 2, "No Event"),
                new DicePair(4, 1, "No Event"),

                new DicePair(1, 5, "Each player gives one resource to their left-hand neighbor"),
                new DicePair(2, 4, "An earthquake destroys one road of each player, which must be repaired at normal road-building cost before new roads can be built"),
                new DicePair(3, 3, "Players receive only 1 resource per city"),
                new DicePair(4, 2, "No Event"),
                new DicePair(5, 1, "No Event"),

                new DicePair(1, 6, "Robber"),
                new DicePair(2, 5, "Robber"),
                new DicePair(3, 4, "Robber"),
                new DicePair(4, 3, "Robber"),
                new DicePair(5, 2, "Robber"),
                new DicePair(6, 1, "Robber"),

                new DicePair(2, 6, "Players receive only 1 resource per city"),
                new DicePair(3, 5, "No Event"),
                new DicePair(4, 4, "No Event"),
                new DicePair(5, 3, "No Event"),
                new DicePair(6, 2, "No Event"),

                new DicePair(3, 6, "Players with the most harbors receive 1 resource of their choice"),
                new DicePair(4, 5, "No Event"),
                new DicePair(5, 4, "No Event"),
                new DicePair(6, 3, "No Event"),

                new DicePair(4, 6, "The player(s) with the most victory points must give one resource to another player"),
                new DicePair(5, 5, "No Event"),
                new DicePair(6, 4, "No Event"),

                new DicePair(5, 6, "The player(s) with the most victory points must give one resource to another player"),
                new DicePair(6, 5, "No Event"),

                new DicePair(6, 6, "Players with the most harbors receive 1 resource of their choice")
        ));

        Collections.shuffle(classicCards);
        return classicCards;
    }

    private List<Character> initEventCards() {
        List<Character> shuffled = new ArrayList<>(possibleEvents);
        Collections.shuffle(shuffled);
        return shuffled;
    }

    @Override
    public GameState createSession(GameConfig gameConfig) {
        //shuffle balanced classic dice deck
        List<DicePair> classicCards = null;
        if (gameConfig.classicDice().isBalanced()) {
            classicCards = initClassicCards();
        }

        //shuffle balance event cards
        List<Character> eventCards = null;
        if (gameConfig.gameMode() == GameMode.CITIES_AND_KNIGHTS) {
            if (gameConfig.eventDice().isBalanced()) {
                eventCards = initEventCards();
            }
        }

        return new GameState(
                Instant.now(),
                gameConfig,
                0,
                0,
                classicCards,
                eventCards,
                new ArrayList<>()
        );
    }

    @Override
    public GameState updateSession(GameState oldState, GameConfig gameConfig) {
        //update turns if players changed
        int currentPlayerTurn = oldState.currentPlayerTurn() % gameConfig.teams().size();
        int currentShipTurn = oldState.currentShipTurn() % gameConfig.maxShipTurns();

        //update classic cards
        List<DicePair> classicCards = null;
        if (gameConfig.classicDice().isBalanced()) {
            if (oldState.gameConfig().classicDice().isBalanced()) {
                //reuse cards from old config if still balanced
                classicCards = oldState.classicCards();
            } else {
                //shuffle cards if changing to balanced
                classicCards = initClassicCards();
            }
        }

        //update event cards
        List<Character> eventCards = null;
        if (gameConfig.gameMode() == GameMode.CITIES_AND_KNIGHTS) {
            if (gameConfig.eventDice().isBalanced()) {
                if (oldState.gameConfig().eventDice().isBalanced()) {
                    eventCards = oldState.eventCards();
                } else {
                    eventCards = initEventCards();
                }
            }
        }

        return new GameState(
                oldState.startTime(),
                gameConfig,
                currentPlayerTurn,
                currentShipTurn,
                classicCards,
                eventCards,
                oldState.diceRolls()
        );
    }

    @Override
    public GameDetails saveSession(GameState gameState, ResultState resultState, MultipartFile image) {
        return gameService.saveGame(
                GameType.CATAN,
                gameState,
                resultState,
                image,
                gameState.gameConfig().teams()
        );
    }

    @Override
    public GameState undoRoll(GameState oldState) {
        int currentTeamTurn = oldState.currentPlayerTurn();
        int currentShipTurn = oldState.currentShipTurn();
        List<DicePair> classicCards = oldState.classicCards() == null ? null : new ArrayList<>(oldState.classicCards());
        List<Character> eventCards = oldState.eventCards() == null ? null : new ArrayList<>(oldState.eventCards());
        List<DiceRoll> diceRolls = new ArrayList<>(oldState.diceRolls());

        if(diceRolls.isEmpty()) {
            throw new InvalidOperationException("At least one dice roll is required");
        }

        DiceRoll last = diceRolls.removeLast();
        if(classicCards != null) {
            //readd dice if deck isnt full and it wasnt alchemist
            if(classicCards.size() < 36 && last.dicePair().sum() > 0) {
                classicCards.add(last.dicePair());
            }
            Collections.shuffle(classicCards);
        }
        if(eventCards != null) {
            if(eventCards.size() < 6) {
                eventCards.add(last.diceEvent());
            }
            Collections.shuffle(eventCards);

            int shipBack = 0;
            //undo ship turn if it occurred
            if(last.diceEvent().equals('e')) {
                shipBack++;

                //ship is automatically moved after charge, so we have to move one more if we are at the start
                if(currentShipTurn == 1) {
                    shipBack++;
                }
            } else {
                //ship is automatically moved after charge, so we have to move one more
                if(currentShipTurn == 0) {
                    shipBack++;
                }
            }

            //ship starts at position 0 when no dice were rolled
            if(diceRolls.isEmpty()) {
                shipBack--;
            }

            currentShipTurn = (currentShipTurn - shipBack + oldState.gameConfig().maxShipTurns()) % oldState.gameConfig().maxShipTurns();
        }

        currentTeamTurn = (currentTeamTurn - 1 + oldState.gameConfig().teams().size()) % oldState.gameConfig().teams().size();

        return new GameState(
                oldState.startTime(),
                oldState.gameConfig(),
                currentTeamTurn,
                currentShipTurn,
                classicCards,
                eventCards,
                diceRolls
        );
    }

    @Override
    public GameState rollDice(GameState oldState, boolean isAlchemist) {
        int currentTeamTurn = oldState.currentPlayerTurn();
        int currentShipTurn = oldState.currentShipTurn();
        List<DicePair> classicCards = oldState.classicCards() == null ? null : new ArrayList<>(oldState.classicCards());
        List<Character> eventCards = oldState.eventCards() == null ? null : new ArrayList<>(oldState.eventCards());
        List<DiceRoll> diceRolls = new ArrayList<>(oldState.diceRolls());

        TeamDetails currentTeam = oldState.gameConfig().teams().get(currentTeamTurn);

        //classic dice roll
        DicePair dicePair;
        if (isAlchemist) {
            //alchemist roll
            dicePair = new DicePair(0, 0, null);
        } else {
            //normal roll
            if (classicCards == null || !oldState.gameConfig().classicDice().isBalanced()) {
                int dice1 = rand.nextInt(6) + 1;
                int dice2 = rand.nextInt(6) + 1;
                dicePair = new DicePair(dice1, dice2, null);
            } else {
                if (classicCards.size() <= oldState.gameConfig().classicDice().shuffleThreshold()) {
                    classicCards = initClassicCards();
                }
                dicePair = classicCards.removeLast();
            }
        }

        //event dice roll
        Character eventDice = null;
        if (oldState.gameConfig().gameMode() == GameMode.CITIES_AND_KNIGHTS) {
            if (eventCards == null || !oldState.gameConfig().eventDice().isBalanced()) {
                int eventIndex = rand.nextInt(possibleEvents.size());
                eventDice = possibleEvents.get(eventIndex);
            } else {
                if (eventCards.size() <= oldState.gameConfig().eventDice().shuffleThreshold()) {
                    eventCards = initEventCards();
                }
                eventDice = eventCards.removeLast();
            }

            //reset ship to start if charge happened last round
            if (currentShipTurn >= oldState.gameConfig().maxShipTurns() - 1) {
                currentShipTurn = 0;
            }

            //update ship
            if (eventDice.equals('e')) {
                currentShipTurn = (currentShipTurn + 1) % oldState.gameConfig().maxShipTurns();
            }
        }

        DiceRoll diceRoll = new DiceRoll(dicePair, eventDice, currentTeam.name(), Instant.now());

        //don't allow 2 same dice rolls after another
        if (oldState.gameConfig().gameMode() == GameMode.ONE_VS_ONE) {
            if (!diceRolls.isEmpty()) {
                DiceRoll lastRoll = diceRolls.getLast();
                if (lastRoll.teamName().equals(currentTeam.name()) && lastRoll.dicePair().sum() == diceRoll.dicePair().sum()) {
                    //if all cards are the same, no choice but to have two in row
                    boolean allSame = classicCards != null && classicCards.stream().allMatch(pair -> pair.sum() == diceRoll.dicePair().sum());

                    //add card back on the bottom of the card deck
                    if (classicCards != null) {
                        classicCards.addFirst(dicePair);
                    }

                    //try to roll again with reshuffled deck
                    if (!allSame) {
                        return rollDice(new GameState(
                                oldState.startTime(),
                                oldState.gameConfig(),
                                oldState.currentPlayerTurn(),
                                oldState.currentShipTurn(),
                                classicCards,
                                oldState.eventCards(),
                                oldState.diceRolls()
                        ), isAlchemist);
                    }
                }
            }
        }

        //update team
        if (oldState.gameConfig().gameMode() == GameMode.ONE_VS_ONE) {
            //only update to next team if team also rolled last roll
            if (!diceRolls.isEmpty()) {
                DiceRoll lastRoll = diceRolls.getLast();
                if (lastRoll.teamName().equals(currentTeam.name())) {
                    currentTeamTurn = (currentTeamTurn + 1) % oldState.gameConfig().teams().size();
                }
            }
        } else {
            currentTeamTurn = (currentTeamTurn + 1) % oldState.gameConfig().teams().size();
        }

        diceRolls.add(diceRoll);

        return new GameState(
                oldState.startTime(),
                oldState.gameConfig(),
                currentTeamTurn,
                currentShipTurn,
                classicCards,
                eventCards,
                diceRolls
        );
    }
}
