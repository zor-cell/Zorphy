import {Routes} from '@angular/router';
import {Connect4Component} from "./sites/connect4/components/connect4.component";
import {ProjectListComponent} from "./main/components/projects/project-list/project-list.component";
import {ProjectInfoComponent} from "./main/components/projects/project-info/project-info.component";
import {CatanGameComponent} from "./sites/catan/components/game/game.component";
import {CatanConfigComponent} from "./sites/catan/components/config/config.component";
import {QwirkleGameComponent} from "./sites/qwirkle/components/game/game.component";
import {GameListComponent} from "./main/components/games/game-list/game-list.component";
import {GameInfoComponent} from "./main/components/games/game-info/game-info.component";
import {QwirkleConfigComponent} from "./sites/qwirkle/components/config/config.component";
import {JollyGameComponent} from "./sites/jolly/components/game/game.component";
import {JollyConfigComponent} from "./sites/jolly/components/config/config.component";
import {RiskSimulationComponent} from "./sites/risk/components/simulation/simulation.component";
import {GameStatsComponent} from "./main/components/games/stats/game-stats/game-stats.component";
import {ScotlandYardGameComponent} from "./sites/scotland-yard/components/game/game.component";
import {ScotlandYardConfigComponent} from "./sites/scotland-yard/components/config/config.component";

export const routes: Routes = [
    //project routing
    {path: '', redirectTo: 'projects', pathMatch: 'full'},
    {path: 'projects', component: ProjectListComponent},
    {path: 'projects/:name/info', component: ProjectInfoComponent},

    //game routing
    {path: 'games', component: GameListComponent},
    {path: 'games/stats', component: GameStatsComponent},
    {path: 'games/:id', component: GameInfoComponent},

    //connect4 routing
    {path: 'projects/connect4', component: Connect4Component},

    //catan routing
    {path: 'projects/catan', redirectTo: 'projects/catan/config', pathMatch: 'full'},
    {path: 'projects/catan/config', component: CatanConfigComponent},
    {path: 'projects/catan/game', component: CatanGameComponent},

    //qwirkle routing
    {path: 'projects/qwirkle', redirectTo: 'projects/qwirkle/config', pathMatch: 'full'},
    {path: 'projects/qwirkle/config', component: QwirkleConfigComponent},
    {path: 'projects/qwirkle/game', component: QwirkleGameComponent},

    //jolly routing
    {path: 'projects/jolly', redirectTo: 'projects/jolly/config', pathMatch: 'full'},
    {path: 'projects/jolly/config', component: JollyConfigComponent},
    {path: 'projects/jolly/game', component: JollyGameComponent},

    //risk routing
    {path: 'projects/risk', redirectTo: 'projects/risk/simulation', pathMatch: 'full'},
    {path: 'projects/risk/simulation', component: RiskSimulationComponent},

    // scotland yard routing
    {path: 'projects/scotland-yard', redirectTo: 'projects/scotland-yard/config', pathMatch: 'full'},
    {path: 'projects/scotland-yard/config', component: ScotlandYardConfigComponent},
    {path: 'projects/scotland-yard/game', component: ScotlandYardGameComponent},
];
