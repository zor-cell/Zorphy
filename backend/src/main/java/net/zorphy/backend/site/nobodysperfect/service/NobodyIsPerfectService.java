package net.zorphy.backend.site.nobodysperfect.service;

import net.zorphy.backend.site.connect4.exception.InvalidOperationException;
import net.zorphy.backend.site.core.ws.dto.GameRoomMember;
import net.zorphy.backend.site.core.ws.exception.FatalWebsocketException;
import net.zorphy.backend.site.core.ws.service.GameRoomBaseService;
import net.zorphy.backend.site.nobodysperfect.dto.*;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
public class NobodyIsPerfectService implements GameRoomBaseService<GameRoom, GameRoomState> {
    public NobodyIsPerfectService() { }

    @Override
    public GameRoomState createRoom(String username) {
        String roomId = UUID.randomUUID().toString().substring(0, 6);

        var member = new GameRoomMember(username);
        GameRoom room = new GameRoom(
                Instant.now(),
                roomId,
                new ArrayList<>(List.of(member)),
                member
        );

        return new GameRoomState(
                room,
                member,
                new ArrayList<>()
        );
    }

    @Override
    public GameRoomState joinRoom(GameRoomState state, String username) {
        List<GameRoomMember> members = new ArrayList<>(state.room().members());
        var member = new GameRoomMember(username);

        if(state.room().members().contains(member)) {
            throw new FatalWebsocketException("Another room member with this username already exists");
        }

        //reassign host and game master if room was empty
        var host = state.room().host();
        var gameMaster = state.gameMaster();
        if(members.isEmpty()) {
            host = member;
            gameMaster = member;
        }

        members.add(member);

        return new GameRoomState(
                new GameRoom(
                        state.room().createdAt(),
                        state.room().roomId(),
                        members,
                        host
                ),
                gameMaster,
                state.rounds()
        );
    }

    @Override
    public GameRoomState leaveRoom(GameRoomState state, String username) {
        List<GameRoomMember> members = new ArrayList<>(state.room().members());
        var member = new GameRoomMember(username);

        members.remove(member);

        //pick new host after host leaves the room
        var host = state.room().host();
        if(host.equals(member)) {
            if(members.isEmpty()) {
                host = null;
            } else {
                host = members.getFirst();
            }
        }

        //pick new game master after game master leaves the room
        var gameMaster = state.gameMaster();
        if(gameMaster.equals(member)) {
            if(members.isEmpty()) {
                gameMaster = null;
            } else {
                gameMaster = members.getFirst();
            }
        }

        return new GameRoomState(
                new GameRoom(
                        state.room().createdAt(),
                        state.room().roomId(),
                        members,
                        host
                ),
                gameMaster,
                state.rounds()
        );
    }

    @Override
    public GameRoomState updateMembers(GameRoomState state, String username, List<GameRoomMember> members) {
        if(!state.room().host().username().equals(username)) {
            throw new InvalidOperationException("Only the host can update room members");
        }

        state.room().members().clear();
        state.room().members().addAll(members);

        return state;
    }

    public GameRoomState startRound(GameRoomState state, String username) {
        if(!state.gameMaster().username().equals(username)) {
            throw new InvalidOperationException("Only the game master can start a round");
        }

        Round round = new Round(
                Instant.now(),
                RoundPhase.PROMPTING,
                new ArrayList<>()
        );
        state.rounds().add(round);

        return state;
    }

    public GameRoomState submitPrompt(GameRoomState state, String username, String message) {
        if(state.rounds().isEmpty()) {
            throw new InvalidOperationException("No round was started");
        }

        GameRoomMember member = new GameRoomMember(username);

        var currentRound = state.rounds().getLast();
        if(currentRound.prompts().stream().anyMatch(p -> username.equals(p.author().username()))) {
            throw new InvalidOperationException("Member already submitted a prompt in this round");
        }

        boolean isTruth = false;
        if(member.username().equals(state.gameMaster().username())) {
            //if another prompt is already the truth, the game master left the room after submit
            //in that case the prompt should be labeled false
            isTruth = currentRound.prompts().stream().noneMatch(Prompt::isTruth);
        }

        Prompt prompt = new Prompt(
                Instant.now(),
                message,
                member,
                isTruth
        );
        currentRound.prompts().add(prompt);

        return state;
    }

    public GameRoomState showPrompts(GameRoomState state, String username) {
        if(!state.gameMaster().username().equals(username)) {
            throw new InvalidOperationException("Only the game master can start the guess round");
        } else if(state.rounds().isEmpty()) {
            throw new InvalidOperationException("No round was started");
        }

        //update phase in current round
        List<Round> rounds = new ArrayList<>(state.rounds());
        var currentRound = rounds.getLast();

        if(currentRound.prompts().size() < state.room().members().size()) {
            throw new InvalidOperationException("Prompts can only be shown after all members submitted");
        }

        List<Prompt> prompts = new ArrayList<>(currentRound.prompts());
        Collections.shuffle(prompts);

        rounds.set(rounds.size() - 1, new Round(
           currentRound.startedAt(),
           RoundPhase.GUESSING,
           prompts
        ));

        return new GameRoomState(
                state.room(),
                state.gameMaster(),
                rounds
        );
    }

    public GameRoomState revealRoundResults(GameRoomState state, String username) {
        if(!state.gameMaster().username().equals(username)) {
            throw new InvalidOperationException("Only the game master can start the reveal round");
        } else if(state.rounds().isEmpty()) {
            throw new InvalidOperationException("No round was started");
        }

        //update phase in current round
        List<Round> rounds = new ArrayList<>(state.rounds());
        var currentRound = rounds.getLast();

        rounds.set(rounds.size() - 1, new Round(
                currentRound.startedAt(),
                RoundPhase.REVEAL,
                currentRound.prompts()
        ));

        return new GameRoomState(
                state.room(),
                state.gameMaster(),
                rounds
        );
    }

    public GameRoomState finishRound(GameRoomState state, String username) {
        if(!state.gameMaster().username().equals(username)) {
            throw new InvalidOperationException("Only the game master can finish the round");
        } else if(state.rounds().isEmpty()) {
            throw new InvalidOperationException("No round was started");
        }

        //update game master
        int gameMasterIndex = state.room().members().indexOf(state.gameMaster());
        int newGameMasterIndex = (gameMasterIndex + 1) % state.room().members().size();
        GameRoomMember gameMaster = state.room().members().get(newGameMasterIndex);

        //update phase in current round
        List<Round> rounds = new ArrayList<>(state.rounds());
        var currentRound = rounds.getLast();

        rounds.set(rounds.size() - 1, new Round(
                currentRound.startedAt(),
                RoundPhase.FINISHED,
                currentRound.prompts()
        ));

        return new GameRoomState(
                state.room(),
                gameMaster,
                rounds
        );
    }
}
