import {Injectable, Type} from '@angular/core';
import {GameType} from "../../games/dto/GameType";
import {CatanGameInfoComponent} from "../../../sites/catan/components/game-info/game-info.component";
import {CatanGameStatsComponent} from "../../../sites/catan/components/game-stats/game-stats.component";
import {JollyGameInfoComponent} from "../../../sites/jolly/components/game-info/game-info.component";
import {JollyGameStatsComponent} from "../../../sites/jolly/components/game-stats/game-stats.component";

@Injectable({
  providedIn: 'root'
})
export class GameComponentRegistryService {
  private gameInfoComponents: Partial<Record<GameType, Type<any>>> = {
    [GameType.CATAN]: CatanGameInfoComponent,
    [GameType.JOLLY]: JollyGameInfoComponent
  };

  private gameStatsComponents: Partial<Record<GameType, Type<any>>> = {
    [GameType.CATAN]: CatanGameStatsComponent,
    [GameType.JOLLY]: JollyGameStatsComponent
  };

  getInfoComponent(gameType: GameType) {
    return this.gameInfoComponents[gameType];
  }

  getStatsComponent(gameType: GameType) {
    return this.gameStatsComponents[gameType];
  }
}
