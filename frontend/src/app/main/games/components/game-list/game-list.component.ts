import {Component, inject, OnInit, signal} from '@angular/core';
import {GameService} from "../../game.service";
import {DatePipe} from "@angular/common";
import {DurationPipe} from "../../../core/pipes/DurationPipe";
import {GameMetadata} from "../../dto/GameMetadata";
import {Router} from "@angular/router";
import {MainHeaderComponent} from '../../../core/components/main-header/main-header.component';
import {GameSearchComponent} from "../game-search/game-search.component";
import {GameFilters} from "../../dto/GameFilters";
import {AuthService} from "../../../core/services/auth.service";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {PaginatorComponent} from "../../../core/components/paginator/paginator.component";
import {Pageable} from "../../../core/dto/Pageable";

@Component({
  selector: 'game-list',
  imports: [
    DatePipe,
    DurationPipe,
    MainHeaderComponent,
    GameSearchComponent,
    PaginatorComponent
  ],
  templateUrl: './game-list.component.html',
  styleUrl: './game-list.component.css'
})
export class GameListComponent implements OnInit {
  private router = inject(Router);
  private gameService = inject(GameService);
  protected authService = inject(AuthService);

  protected dateFormat = 'MMM d, yyyy HH:mm';
  protected games = signal<GameMetadata[]>([]);
  protected isLoading = signal<boolean>(false);
  private currentFilters = signal<GameFilters | null>(null);

  //pagination
  protected pageable = signal<Pageable>({page: 0, size: 10, totalItems: 0});

  ngOnInit(): void {
    //adjust date format
    const mql = window.matchMedia('(max-width: 600px)');
    this.updateDateFormat(mql.matches);

    mql.addEventListener('change', (e) => {
      this.updateDateFormat(e.matches);
    });
  }

  protected openGameInfo(id: string) {
    this.router.navigate(['/games', id]);
  }

  protected openGameStats() {
    this.router.navigate(['/games/stats']);
  }

  protected searchFiltersChanged(filters: GameFilters) {
    this.currentFilters.set(filters);
    this.pageable.update(p => ({...p, page: 0}));

    this.searchGames();
  }

  protected pageChanged() {
    this.searchGames();
  }

  private searchGames() {
    this.isLoading.set(true);
    this.gameService.searchGames(this.currentFilters(), this.pageable()).subscribe({
      next: res => {
          this.isLoading.set(false);
          this.games.set(res.content);

          this.pageable.update(p => ({...p, totalItems: res.page.totalElements}))
        },
      error: err => {
        this.isLoading.set(false);
      }});
  }

  private updateDateFormat(isSmallScreen: boolean) {
    this.dateFormat = isSmallScreen ? 'dd.MM.yyyy' : 'MMM d, yyyy HH:mm';
  }
}
