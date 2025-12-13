package net.zorphy.backend.main.player.repository;

import net.zorphy.backend.main.player.dto.PlayerDetails;
import net.zorphy.backend.main.player.entity.Player;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public abstract class PlayerMapper {
    public abstract PlayerDetails playerToPlayerDetails(Player player);

    public abstract Player playerDetailsToPlayer(PlayerDetails playerDetails);
}
