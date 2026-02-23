package net.zorphy.backend.site.nobodysperfect.dto;

import net.zorphy.backend.site.core.ws.dto.GameRoomPrivateStateBase;
import net.zorphy.backend.site.core.ws.dto.GameRoomStateBase;
import net.zorphy.backend.site.core.ws.dto.GameRoomMember;

import java.util.ArrayList;
import java.util.List;

public record GameRoomState(
        GameRoom room,
        GameRoomMember gameMaster,
        List<Round> rounds
) implements GameRoomStateBase {

    @Override
    public GameRoomStateBase toPublicState() {
        if(rounds().isEmpty()) return this;

        var currentRound = rounds().getLast();
        if(currentRound.phase() == RoundPhase.REVEAL || currentRound.phase() == RoundPhase.FINISHED) {
            return this;
        }

        //sanitize sensitive info if prompt infos should not yet be revealed
        List<Prompt> anonymousPrompts = new ArrayList<>(currentRound.prompts().stream()
                .map(p -> new Prompt(null, p.message(), null, null))
                .toList());

        List<Round> safeRounds = new ArrayList<>(rounds());
        safeRounds.set(safeRounds.size() - 1, new Round(
                currentRound.startedAt(),
                currentRound.phase(),
                anonymousPrompts)
        );

        return new GameRoomState(
                room(),
                gameMaster(),
                safeRounds
        );
    }

    @Override
    public GameRoomPrivateStateBase toPrivateState(String username) {
        boolean submittedPrompt = false;

        if(!rounds.isEmpty()) {
            var currentRound = rounds.getLast();

            submittedPrompt = currentRound.prompts()
                    .stream()
                    .anyMatch(p -> username.equals(p.author().username()));
        }

        return new GameRoomPrivateState(
                submittedPrompt
        );
    }
}
