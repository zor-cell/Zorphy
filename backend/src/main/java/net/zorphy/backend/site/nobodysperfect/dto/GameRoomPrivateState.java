package net.zorphy.backend.site.nobodysperfect.dto;

import net.zorphy.backend.site.core.ws.dto.GameRoomPrivateStateBase;

public record GameRoomPrivateState(
        boolean submittedPrompt
) implements GameRoomPrivateStateBase { }
