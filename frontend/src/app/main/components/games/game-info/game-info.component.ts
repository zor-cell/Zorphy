import {
    AfterViewInit,
    Component,
    inject,
    viewChild,
} from '@angular/core';
import {GameService} from "../../../services/game.service";
import {GameDetails} from "../../../dto/games/GameDetails";
import {ActivatedRoute} from "@angular/router";
import {DatePipe, Location, NgComponentOutlet, NgIf} from "@angular/common";
import {MainHeaderComponent} from "../../all/main-header/main-header.component";
import {DurationPipe} from "../../../pipes/DurationPipe";
import {AuthService} from "../../../services/auth.service";
import {DeletePopupComponent} from "../delete-popup/delete-popup.component";
import {GameComponentRegistryService} from "../../../services/game-component-registry.service";
import {LightboxDirective} from "ng-gallery/lightbox";
import {Gallery, GalleryItem, ImageItem} from "ng-gallery";

@Component({
    
    selector: 'game-info',
    imports: [
        NgIf,
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

    protected game: GameDetails | null = null;
    protected readonly galleryName = 'gameInfoGallery';

    get gameInfoComponent() {
        return this.game ? this.componentRegistry.getInfoComponent(this.game.metadata.gameType) : null;
    }

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
        if(!this.game?.metadata) return;

        this.gameService.deleteGame(this.game?.metadata.id).subscribe(res => {
            this.location.back();
        });
    }

    private getGame(id: string) {
        this.gameService.getGame(id).subscribe(res => {
            this.game = res;

            //load into gallery
            const galleryRef = this.gallery.ref(this.galleryName);
            galleryRef.setConfig({
                thumbs: false
            });
            galleryRef.load([new ImageItem({
                src: this.game.metadata.imageUrl,
                thumb: this.game.metadata.imageUrl
            })]);
        });
    }
}
