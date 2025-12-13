package net.zorphy.backend.main.player.service;

import net.zorphy.backend.main.player.dto.PlayerDetails;

import java.util.List;

public interface PlayerService {
    List<PlayerDetails> getPlayers();

    PlayerDetails getPlayer(String name);

    PlayerDetails savePlayer(PlayerDetails playerDetails);
}
