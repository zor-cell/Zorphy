package net.zorphy.backend.site.qwirkle.service;

import net.zorphy.backend.main.game.dto.GameDetails;
import net.zorphy.backend.main.game.dto.GameType;
import net.zorphy.backend.main.game.service.GameService;
import net.zorphy.backend.site.all.dto.http.ResultState;
import net.zorphy.backend.site.connect4.exception.InvalidOperationException;
import net.zorphy.backend.site.qwirkle.dto.Position;
import net.zorphy.backend.site.qwirkle.dto.PositionInfo;
import net.zorphy.backend.site.qwirkle.dto.SelectionInfo;
import net.zorphy.backend.site.qwirkle.dto.enums.Color;
import net.zorphy.backend.site.qwirkle.dto.enums.Shape;
import net.zorphy.backend.site.qwirkle.dto.game.GameConfig;
import net.zorphy.backend.site.qwirkle.dto.game.GameState;
import net.zorphy.backend.site.qwirkle.dto.move.Move;
import net.zorphy.backend.site.qwirkle.dto.move.MoveGroup;
import net.zorphy.backend.site.qwirkle.dto.move.MoveGroupInfo;
import net.zorphy.backend.site.qwirkle.dto.tile.BoardTile;
import net.zorphy.backend.site.qwirkle.dto.tile.SelectionTile;
import net.zorphy.backend.site.qwirkle.dto.tile.StackTile;
import net.zorphy.backend.site.qwirkle.dto.tile.Tile;
import net.zorphy.backend.site.qwirkle.service.util.*;
import nu.pattern.OpenCV;
import org.opencv.core.Mat;
import org.opencv.core.MatOfByte;
import org.opencv.imgcodecs.Imgcodecs;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class QwirkleServiceImpl implements QwirkleService {
    private final GameService gameService;

    public QwirkleServiceImpl(GameService gameService) {
        this.gameService = gameService;

        OpenCV.loadLocally();
    }

    @Override
    public GameState createSession(GameConfig config) {
        //initialise stack
        List<StackTile> stack = new ArrayList<>();

        Color[] colors = Color.values();
        Shape[] shapes = Shape.values();

        for (int i = 0; i < 6; i++) {
            for (int j = 0; j < 6; j++) {
                //discard none types
                Color color = colors[i];
                Shape shape = shapes[j];
                Tile tile = new Tile(color, shape);

                stack.add(new StackTile(tile, 3));
            }
        }

        return new GameState(
                Instant.now(),
                config,
                0,
                new ArrayList<>(),
                new ArrayList<>(),
                stack,
                new ArrayList<>(),
                new ArrayList<>()
        );
    }

    @Override
    public GameState updateSession(GameState oldState, GameConfig config) {
        return null;
    }

    @Override
    public GameDetails saveSession(GameState gameState, ResultState resultState, MultipartFile image) {
        return gameService.saveGame(
                GameType.QWIRKLE,
                gameState,
                resultState,
                image,
                gameState.gameConfig().teams()
        );
    }

    @Override
    public GameState undoMove(GameState oldState) {
        List<Move> moves = new ArrayList<>(oldState.moves());
        List<StackTile> stack = new ArrayList<>(oldState.stack());
        Map<Position, BoardTile> board = mapFromList(oldState.board());

        if(moves.isEmpty()) {
            throw new InvalidOperationException("Moves are empty");
        }

        Move move = moves.removeLast();
        //remove from board
        for (int tileIndex = 0; tileIndex < move.tiles().size(); tileIndex++) {
            Position position = move.position().stepsInDirection(move.direction(), tileIndex);

            board.remove(position);
        }

        //add to stack
        for(Tile tile : move.tiles()) {
            addTileToStack(tile, stack);
        }

        return new GameState(
                oldState.startTime(),
                oldState.gameConfig(),
                oldState.currentPlayerTurn(),
                moves,
                oldState.hand(),
                stack,
                listFromMap(board),
                getOpenPositions(board)
        );
    }

    @Override
    public SelectionInfo getSelectionInfo(GameState gameState, List<Tile> tiles, boolean fromStack) {
        //check if selected tiles are valid
        if (!QwirkleUtil.isValidTiles(tiles)) {
            throw new InvalidOperationException("Invalid selected tiles");
        }

        //get valid moves for selected tiles
        List<Move> moves = QwirkleUtil.getLegalMoves(mapFromList(gameState.board()), tiles);

        //accumulate move groups to group together moves from the same position (because score is irrelevant)
        Map<Position, MoveGroup> moveGroups = new HashMap<>();
        for (Move move : moves) {
            MoveGroupInfo groupInfo = groupInfoFromMove(move);

            if (moveGroups.containsKey(move.position())) {
                //add group info to group if exists
                MoveGroup found = moveGroups.get(move.position());
                found.groupInfos().add(groupInfo);
            } else {
                //create first group for position
                MoveGroup moveGroup = new MoveGroup(
                        move.position(),
                        move.tiles(),
                        new ArrayList<>(List.of(groupInfo))
                );
                moveGroups.put(move.position(), moveGroup);
            }
        }
        List<MoveGroup> validMoves = moveGroups.values().stream()
                .toList();

        //check which tiles in hand are valid with the selected tiles
        MultiColor color = new MultiColor();
        MultiShape shape = new MultiShape();
        for (Tile tile : tiles) {
            color.addFlag(tile.color());
            shape.addFlag(tile.shape());
        }

        List<SelectionTile> selectionTiles = new ArrayList<>();
        for (Tile tile : gameState.hand()) {
            boolean valid = tile.isCompatible(color, shape) || fromStack; //when selecting from stack always valid
            valid = valid || tiles.isEmpty(); //if empty tiles always valid

            selectionTiles.add(new SelectionTile(tile, valid));
        }

        return new SelectionInfo(
                selectionTiles,
                validMoves
        );
    }

    @Override
    public List<MoveGroup> getBestMoves(GameState gameState, int maxMoves) {
        //find valid subsets of hand tiles
        List<List<Tile>> allSubsets = Combinatorics.getSubsets(gameState.hand());

        List<List<Tile>> validSubsets = new ArrayList<>();
        for (List<Tile> subset : allSubsets) {
            if (subset.isEmpty()) continue;

            MultiColor color = new MultiColor();
            MultiShape shape = new MultiShape();
            for (Tile tile : subset) {
                color.addFlag(tile.color());
                shape.addFlag(tile.shape());
            }

            if (color.isSingle() || shape.isSingle()) {
                //if color and shape are both only one value, subset must be of size 1
                if (color.isSingle() && shape.isSingle() && subset.size() > 1) {
                    continue;
                }

                //add all permutations of a subset
                List<List<Tile>> permutations = Combinatorics.getPermutations(subset);
                validSubsets.addAll(permutations);
            }
        }

        //find best move in all valid permutation subsets
        List<Move> moves = new ArrayList<>();
        for (List<Tile> tiles : validSubsets) {
            List<Move> tileMoves = QwirkleUtil.getLegalMoves(mapFromList(gameState.board()), tiles);
            moves.addAll(tileMoves);
        }

        moves.sort((a, b) -> {
            //descending for score
            int comp = Integer.compare(b.score(), a.score());
            if (comp == 0) {
                //descending according to tile size
                return Integer.compare(b.tiles().size(), a.tiles().size());
            }
            return comp;
        });


        return moves.subList(0, Math.min(maxMoves, moves.size())).stream()
                .map(m -> {
                    MoveGroupInfo groupInfo = groupInfoFromMove(m);
                    return new MoveGroup(m.position(),
                            m.tiles(),
                            List.of(groupInfo)
                    );
                }).toList();
    }

    @Override
    public GameState drawTile(GameState oldState, Tile tile) {
        List<StackTile> stack = new ArrayList<>(oldState.stack());
        List<Tile> hand = new ArrayList<>(oldState.hand());

        //check if tile exists in stack
        Optional<StackTile> found = stack.stream()
                .filter(t -> t.tile().equals(tile))
                .findFirst();
        if (found.isEmpty() || found.get().count() <= 0) {
            throw new InvalidOperationException("Tile is not present in stack");
        }

        //check hand size
        if (hand.size() >= 6) {
            throw new InvalidOperationException("Hand is full");
        }

        //add to hand
        hand.add(tile);

        //update count of stack tile
        StackTile stackTile = found.get();
        StackTile updatedTile = new StackTile(stackTile.tile(), stackTile.count() - 1);

        int index = stack.indexOf(stackTile);
        stack.set(index, updatedTile);

        return new GameState(
                oldState.startTime(),
                oldState.gameConfig(),
                oldState.currentPlayerTurn(),
                oldState.moves(),
                hand,
                stack,
                oldState.board(),
                getOpenPositions(mapFromList(oldState.board()))
        );
    }

    @Override
    public GameState clearHand(GameState oldState) {
        int currentPlayerTurn = oldState.currentPlayerTurn() % oldState.gameConfig().teams().size();
        List<Tile> hand = new ArrayList<>(oldState.hand());
        List<StackTile> stack = new ArrayList<>(oldState.stack());

        //check if tile is in stack
        for (Tile tile : hand) {
            Optional<StackTile> found = stack.stream()
                    .filter(t -> t.tile().equals(tile))
                    .findFirst();
            if (found.isEmpty()) {
                continue;
            }

            //update count of tile in stack
            addTileToStack(tile, stack);
        }

        return new GameState(
                oldState.startTime(),
                oldState.gameConfig(),
                oldState.currentPlayerTurn(),
                oldState.moves(),
                new ArrayList<>(),
                stack,
                oldState.board(),
                getOpenPositions(mapFromList(oldState.board()))
        );
    }

    @Override
    public GameState makeMove(GameState oldState, Move move, boolean fromStack) {
        int currentPlayerTurn = oldState.currentPlayerTurn() % oldState.gameConfig().teams().size();
        List<Move> moves = new ArrayList<>(oldState.moves());
        List<Tile> hand = new ArrayList<>(oldState.hand());
        List<StackTile> stack = new ArrayList<>(oldState.stack());
        Map<Position, BoardTile> board = mapFromList(oldState.board());

        if(fromStack) {
            //check if tiles are present in stack
            boolean allInStack = move.tiles().stream().allMatch(t -> {
                return stack.stream().filter(s -> s.tile().equals(t))
                        .findFirst()
                        .map(s -> s.count() >= 1)
                        .orElse(false);
            });
            if(!allInStack) {
                throw new InvalidOperationException("Stack does not contain all given tiles");
            }
        } else {
            //check if tiles are present in hand
            boolean allInHand = new HashSet<>(hand).containsAll(move.tiles());
            if (!allInHand) {
                throw new InvalidOperationException("Hand does not contain all given tiles");
            }
        }

        //check if all moves are valid
        List<Position> tempPositions = new ArrayList<>();
        boolean valid = true;
        for (int tileIndex = 0; tileIndex < move.tiles().size(); tileIndex++) {
            Position tilePos = move.position().stepsInDirection(move.direction(), tileIndex);
            Tile tile = move.tiles().get(tileIndex);
            BoardTile boardTile = new BoardTile(tilePos, tile);

            if (!QwirkleUtil.isValidMove(board, boardTile)) {
                valid = false;
                break;
            }

            board.put(tilePos, boardTile);
            tempPositions.add(tilePos);
        }
        if (!valid) {
            //remove placed tiles from board again if move is invalid
            for (Position tempPos : tempPositions) {
                board.remove(tempPos);
            }

            throw new InvalidOperationException("Move is invalid");
        }

        for (Tile tile : move.tiles()) {
            if (fromStack) {
                //remove tiles from stack
                drawTileFromStack(tile, stack);
            } else {
                //remove tile from hand
                hand.remove(tile);
            }
        }

        moves.add(move);

        return new GameState(
                oldState.startTime(),
                oldState.gameConfig(),
                currentPlayerTurn,
                moves,
                hand,
                stack,
                listFromMap(board),
                getOpenPositions(board)
        );
    }

    @Override
    public byte[] uploadImage(byte[] file) {
        Mat image = Imgcodecs.imdecode(new MatOfByte(file), Imgcodecs.IMREAD_COLOR);
        Mat processed = OpenCVUtil.parseImage(image);

        MatOfByte buffer = new MatOfByte();
        Imgcodecs.imencode(".png", processed, buffer);

        return buffer.toArray();
    }




    private static void drawTileFromStack(Tile tile, List<StackTile> stack) {
        addOrDrawFromStack(tile, stack, -1);
    }

    private static void addTileToStack(Tile tile, List<StackTile> stack) {
        addOrDrawFromStack(tile, stack, 1);
    }

    private static void addOrDrawFromStack(Tile tile, List<StackTile> stack, int increment) {
        Optional<StackTile> found = stack.stream()
                .filter(st -> st.tile().equals(tile))
                .findFirst();
        if(found.isEmpty()) return;

        StackTile stackTile = found.get();
        StackTile updatedTile = new StackTile(stackTile.tile(), stackTile.count() + increment);

        int index = stack.indexOf(stackTile);
        stack.set(index, updatedTile);
    }

    private static MoveGroupInfo groupInfoFromMove(Move move) {
        List<BoardTile> boardTiles = new ArrayList<>();
        for (int tileIndex = 0; tileIndex < move.tiles().size(); tileIndex++) {
            Position position = move.position().stepsInDirection(move.direction(), tileIndex);
            Tile tile = move.tiles().get(tileIndex);

            BoardTile boardTile = new BoardTile(
                    position,
                    tile
            );

            boardTiles.add(boardTile);
        }

        return new MoveGroupInfo(
                move.direction(),
                move.score(),
                boardTiles
        );
    }

    private static List<PositionInfo> getOpenPositions(Map<Position, BoardTile> board) {
        List<Position> openPositions = QwirkleUtil.getOpenPositions(board);

        return openPositions.stream()
                .map(p -> {
                    boolean isDead = QwirkleUtil.isDeadPosition(board, p);
                    return new PositionInfo(isDead, p);
                })
                .toList();
    }

    private static Map<Position, BoardTile> mapFromList(List<BoardTile> board) {
        return board.stream()
                .collect(Collectors.toMap(
                        BoardTile::position,
                        Function.identity()
                ));
    }

    private static List<BoardTile> listFromMap(Map<Position, BoardTile> board) {
        return board.values().stream()
                .toList();
    }
}
