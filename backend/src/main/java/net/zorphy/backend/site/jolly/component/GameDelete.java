package net.zorphy.backend.site.jolly.component;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.zorphy.backend.main.all.component.CustomObjectMapperComponent;
import net.zorphy.backend.main.game.dto.GameType;
import net.zorphy.backend.main.game.entity.Game;
import net.zorphy.backend.main.file.service.FileStorageService;
import net.zorphy.backend.site.all.service.GameSpecificDelete;
import net.zorphy.backend.site.jolly.dto.RoundInfo;
import net.zorphy.backend.site.jolly.dto.game.GameState;
import org.springframework.stereotype.Component;

@Component("JollyGameDelete")
public class GameDelete implements GameSpecificDelete {
    private final ObjectMapper objectMapper;
    private final FileStorageService fileStorageService;

    public GameDelete(FileStorageService fileStorageService, CustomObjectMapperComponent customObjectMapper) {
        this.fileStorageService = fileStorageService;
        this.objectMapper = customObjectMapper.getMapper();
    }

    @Override
    public GameType supportedType() {
        return GameType.JOLLY;
    }

    @Override
    public void beforeDelete(Game game) {
        //delete image files saved in rounds
        try {
            GameState gameState = objectMapper.convertValue(game.getGameState(), GameState.class);
            for (RoundInfo round : gameState.rounds()) {
                fileStorageService.deleteFile(round.imageUrl());
            }
        } catch(Exception e) {
            //mapping failed
        }
    }
}
