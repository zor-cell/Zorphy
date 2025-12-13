package net.zorphy.backend.main.player.service;

import net.zorphy.backend.main.player.dto.PlayerDetails;
import net.zorphy.backend.main.player.entity.Player;
import net.zorphy.backend.main.all.exception.NotFoundException;
import net.zorphy.backend.main.player.repository.PlayerMapper;
import net.zorphy.backend.main.player.repository.PlayerRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PlayerServiceImpl implements PlayerService {
    private final PlayerRepository playerRepository;
    private final PlayerMapper playerMapper;

    public PlayerServiceImpl(PlayerRepository playerRepository, PlayerMapper playerMapper) {
        this.playerRepository = playerRepository;
        this.playerMapper = playerMapper;
    }

    @Override
    public List<PlayerDetails> getPlayers() {
        return playerRepository.findAll()
                .stream()
                .map(playerMapper::playerToPlayerDetails)
                .sorted(Comparator.comparing(PlayerDetails::name))
                .collect(Collectors.toList());
    }

    @Override
    public PlayerDetails getPlayer(String name) {
        Player player = playerRepository.findByName(name);
        if (player == null) {
            throw new NotFoundException(String.format("Player with name %s not found", name));
        }

        return playerMapper.playerToPlayerDetails(player);
    }

    @Override
    public PlayerDetails savePlayer(PlayerDetails playerDetails) {
        Player toSave = playerMapper.playerDetailsToPlayer(playerDetails);
        Player saved = playerRepository.save(toSave);
        return playerMapper.playerToPlayerDetails(saved);
    }
}
