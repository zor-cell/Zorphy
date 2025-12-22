import {AfterViewInit, Component, computed, inject, signal, viewChild,} from '@angular/core';
import {GameService} from "../../game.service";
import {GameDetails} from "../../dto/GameDetails";
import {ActivatedRoute} from "@angular/router";
import {DatePipe, Location, NgComponentOutlet} from "@angular/common";
import {MainHeaderComponent} from "../../../core/components/main-header/main-header.component";
import {DurationPipe} from "../../../core/pipes/DurationPipe";
import {AuthService} from "../../../core/services/auth.service";
import {DeletePopupComponent} from "../delete-popup/delete-popup.component";
import {GameComponentRegistryService} from "../../../core/services/game-component-registry.service";
import {LightboxDirective} from "ng-gallery/lightbox";
import {Gallery, ImageItem} from "ng-gallery";

@Component({
    
    selector: 'game-info',
    imports: [
        MainHeaderComponent,
        DurationPipe,
        DatePipe,
        DeletePopupComponent,
        NgComponentOutlet,
        LightboxDirective
    ],
    templateUrl: './game-info.component.html',
    styleUrl: './game-info.component.css'
})
export class GameInfoComponent implements AfterViewInit {
    protected authService = inject(AuthService);
    protected location = inject(Location);
    private route = inject(ActivatedRoute);
    private gameService = inject(GameService);
    private componentRegistry = inject(GameComponentRegistryService);
    private gallery = inject(Gallery);

    protected deletePopup = viewChild.required<DeletePopupComponent>('deletePopup');

    protected game = signal<GameDetails | null>(null);
    protected gameInfoComponent = computed(() => {
        const game = this.game();
        return game ? this.componentRegistry.getInfoComponent(game.metadata.gameType) : null;
    })

    protected readonly galleryName = 'gameInfoGallery';

    ngAfterViewInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.getGame(id);
        }
    }

    protected openDeletePopup() {
        this.deletePopup().openPopup();
    }

    protected deleteGame() {
        const game = this.game();
        if(!game?.metadata) return;

        this.gameService.deleteGame(game.metadata.id).subscribe(res => {
            this.location.back();
        });
    }

    private getGame(id: string) {
        this.gameService.getGame(id).subscribe(res => {
            this.game.set(res);

            //load into gallery
            const galleryRef = this.gallery.ref(this.galleryName);
            galleryRef.setConfig({
                thumbs: false
            });
            galleryRef.load([new ImageItem({
                src: res.metadata.imageUrl,
                thumb: res.metadata.imageUrl
            })]);
        });
    }
}
