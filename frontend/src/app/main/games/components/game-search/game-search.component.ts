import {Component, inject, input, OnInit, output, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {GameFilters} from "../../dto/GameFilters";
import {GameType} from "../../dto/GameType";
import {DurationPipe} from "../../../core/pipes/DurationPipe";

import {PlayerService} from "../../../core/services/player.service";
import {PlayerDetails} from "../../../core/dto/PlayerDetails";
import {ActivatedRoute, Router} from "@angular/router";
import {MatMenu, MatMenuTrigger} from "@angular/material/menu";
import {MatNativeDateModule, provideNativeDateAdapter} from "@angular/material/core";

@Component({
  selector: 'game-search',
  providers: [provideNativeDateAdapter()],
  imports: [
    ReactiveFormsModule,
    MatMenu,
    MatMenuTrigger,
    MatNativeDateModule,
  ],
  templateUrl: './game-search.component.html',
  styleUrl: './game-search.component.css'
})
export class GameSearchComponent implements OnInit {
  private fb = inject(FormBuilder);
  private playerService = inject(PlayerService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  public showMultiGameTypes = input<boolean>(true);
  public changeFiltersEvent = output<GameFilters>();

  protected players = signal<PlayerDetails[]>([]);
  protected isPopoverOpen = signal<boolean>(false);
  protected searchForm = this.fb.group({
    text: this.fb.control<string | null>(null),
    dateFrom: this.fb.control<Date | null>(null),
    dateTo: this.fb.control<Date | null>(null),
    minPlayers: this.fb.control<number | null>(null),
    maxPlayers: this.fb.control<number | null>(null),
    minDuration: this.fb.control<string | null>(null),
    maxDuration: this.fb.control<string | null>(null),
    gameTypes: this.fb.control<GameType[] | null>(null),
    players: this.fb.control<string[] | null>(null)
  });
  protected allGameTypes = Object.values(GameType);

  ngOnInit() {
    //add validation on stats search
    if(!this.showMultiGameTypes()) {
      this.searchForm.controls.gameTypes.addValidators(Validators.required);
      this.searchForm.controls.players.addValidators(Validators.required);
    }

    //get query params from route
    const params = this.route.snapshot.queryParams;
    const gameTypes = params['gameTypes'];
    const players = params['players'];
    const filters: any = {
      text: params['text'] ?? null,
      dateFrom: params['dateFrom'] ? params['dateFrom'] : null,
      dateTo: params['dateTo'] ? params['dateTo'] : null,
      minPlayers: params['minPlayers'] ? params['minPlayers'] : null,
      maxPlayers: params['maxPlayers'] ? params['maxPlayers'] : null,
      minDuration: params['minDuration'] ?? null,
      maxDuration: params['maxDuration'] ?? null,
      gameTypes: gameTypes ? (Array.isArray(gameTypes) ? gameTypes : [gameTypes]) : null,
      players: players ? (Array.isArray(players) ? players : [players]) : null,
    };

    this.searchForm.patchValue(filters, {emitEvent: false});
    this.submit();

    //reflect form changes in query params
    this.searchForm.valueChanges.subscribe(filters => {
      const queryParams = filters as GameFilters;

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams,
        queryParamsHandling: "merge",
        replaceUrl: true
      });
    });

    this.getPlayers();
  }

  protected popOverOpen() {
    this.isPopoverOpen.set(true);
  }

  protected popOverClose() {
    this.isPopoverOpen.set(false);
  }

  protected clear() {
    this.searchForm.reset({
      text: this.searchForm.controls.text.value
    });
  }

  protected submit() {
    if(this.searchForm.invalid) return;

    const filters = this.searchForm.getRawValue() as GameFilters;

    //apply ISO standards
    filters.dateFrom = filters.dateFrom ? new Date(filters.dateFrom).toISOString() : null;
    filters.dateTo = filters.dateTo ? new Date(filters.dateTo).toISOString() : null;
    filters.minDuration = filters.minDuration ? DurationPipe.toIsoFormat(filters.minDuration) : null;
    filters.maxDuration = filters.maxDuration ? DurationPipe.toIsoFormat(filters.maxDuration) : null;

    this.changeFiltersEvent.emit(filters);
  }

  private getPlayers() {
    this.playerService.getPlayers().subscribe(res => {
      this.players.set(res);
    })
  }
}
