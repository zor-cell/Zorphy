import {Component, computed, effect, forwardRef, inject, input, OnInit, signal, viewChild} from '@angular/core';
import {PlayerService} from "../../../services/player.service";
import {PlayerDetails} from "../../../dto/all/PlayerDetails";
import { NgClass } from "@angular/common";
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule} from "@angular/forms";
import {CdkDrag, CdkDragDrop, CdkDragPreview, CdkDropList, moveItemInArray} from "@angular/cdk/drag-drop";
import {Team} from "../../../dto/all/Team";
import {NewPlayerPopupComponent} from "../popups/new-player-popup/new-player-popup.component";
import {AuthService} from "../../../services/auth.service";
import {PlayerCreate} from "../../../dto/all/PlayerCreate";

@Component({
    selector: 'app-player-select',
    imports: [
    FormsModule,
    CdkDrag,
    CdkDropList,
    CdkDragPreview,
    NgClass,
    ReactiveFormsModule,
    NewPlayerPopupComponent,
    NewPlayerPopupComponent
],
    templateUrl: './player-select.component.html',
    
    styleUrl: './player-select.component.css',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PlayerSelectComponent),
            multi: true
        }
    ]
})
export class PlayerSelectComponent implements ControlValueAccessor, OnInit {
    private playerService = inject(PlayerService);
    protected authService = inject(AuthService);

    public playerPopup = viewChild.required<NewPlayerPopupComponent>('playerPopup');
    public minTeams = input<number>(2);
    public maxTeams = input<number>(4);
    public allowTeams = input<boolean>(true);

    public selectedTeams = signal<Team[]>([]);
    public allPlayers = signal<PlayerDetails[]>([]);
    public availablePlayers = computed(() => {
        const all = this.allPlayers();
        const taken = this.selectedTeams().flatMap(t => t.players.map(p => p.id));
        return all.filter(p => !taken.includes(p.id)).sort((a,b) => a.name.localeCompare(b.name));
    });

    public teamHostIndex = signal<number>(-1);
    public currentPlayer = signal<PlayerDetails | null>(null);

    private onChange: (value: Team[]) => void = () => {};

    constructor() {
        effect(() => {
            if(this.availablePlayers()) {
                this.currentPlayer.set(this.availablePlayers()[0]);
            }
        });
    }

    public writeValue(value: Team[]): void {
        this.selectedTeams.set(value.map(team => ({
            name: team.name,
            players: team.players.map(p => ({...p}))
        })))
    }

    public registerOnChange(fn: (value: Team[]) => void): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: () => void): void {

    }

    public setDisabledState?(isDisabled: boolean): void {

    }

    ngOnInit() {
        this.getPlayers();
    }

    protected reorderPlayers() {
        const players = this.selectedTeams();
        const n = players.length;

        if (n <= 1) return;

        const offset = Math.floor(Math.random() * n);

        // rotate array by offset
        const rotated = players.slice(offset).concat(players.slice(0, offset));
        this.selectedTeams.set(rotated);
    }

    protected mergeTeam(teamIndex: number) {
        if (!this.allowTeams()) return;

        const hostIndex = this.teamHostIndex();
        if (hostIndex >= 0) {
            const teams  = this.selectedTeams();
            const hostTeam = teams[hostIndex]
            const memberTeam = this.copy(teams[teamIndex]);

            //merge team
            hostTeam.name = this.generateTeamName([...hostTeam.players, ...memberTeam.players]);
            hostTeam.players.push(...memberTeam.players);

            this.teamHostIndex.set(-1);

            teams.splice(teamIndex, 1);
            this.selectedTeams.set(teams);
            this.onChange(this.selectedTeams());
        }
    }

    //drag and drop reordering logic
    protected drop(event: CdkDragDrop<Team[]>) {
        const teams = [...this.selectedTeams()];
        moveItemInArray(teams, event.previousIndex, event.currentIndex);

        this.selectedTeams.set(teams);
        this.onChange(this.selectedTeams());
    }

    protected addPlayer() {
        const player = this.currentPlayer();
        if (this.selectedTeams().length >= this.maxTeams() || player === null) {
            return;
        }

        const playerToAdd = this.copy(player);

        //add to selected teams
        this.selectedTeams.update(teams => {
            return [...teams, {name: playerToAdd.name, players: [playerToAdd]}]
        })
        this.onChange(this.selectedTeams());
    }

    protected removePlayer(teamIndex: number) {
        const teams = [...this.selectedTeams()];
        teams.splice(teamIndex, 1);

        this.selectedTeams.set(teams);
        this.onChange(this.selectedTeams());
    }

    protected updateCurrentPlayer(event: Event) {
        const selectElement = event.target as HTMLSelectElement;
        const selectedId = selectElement.options[selectElement.selectedIndex].value;

        const found = this.availablePlayers().find(p => p.id === selectedId);
        if (found) {
            this.currentPlayer.set(this.copy(found))
        }
    }

    protected makeHost(teamIndex: number) {
        if (!this.allowTeams()) return;

        this.teamHostIndex.update(index => index === teamIndex ? -1 : teamIndex);
    }

    protected openPlayerPopup() {
        this.playerPopup().openPopup();
    }

    protected createPlayer(player: PlayerCreate) {
        this.playerService.savePlayer(player).subscribe(res => {
            this.getPlayers();
        });
    }

    protected getPlayers() {
        this.playerService.getPlayers().subscribe({
            next: res => {
                this.allPlayers.set(res);
            }
        });
    }

    private generateTeamName(players: PlayerDetails[]): string {
        if (players.length === 0) return '';
        if (players.length === 1) return players[0].name;

        return players.map(player => {
            return player.name.slice(0, 3);
        }).join('');
    }

    private copy<T>(obj: T): T {
        return {...obj};
    }
}
