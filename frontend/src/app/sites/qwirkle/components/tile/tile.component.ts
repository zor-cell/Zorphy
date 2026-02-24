import {Component, computed, inject, input, Input, OnInit} from '@angular/core';
import {Tile} from "../../dto/tile/Tile";
import {Color} from "../../dto/enums/Color";
import {SafeHtml} from "@angular/platform-browser";
import {AsyncPipe, NgClass} from "@angular/common";
import {ImageCacheService} from "../../../../main/core/services/image-cache.service";
import {Observable} from "rxjs";

@Component({
    selector: 'qwirkle-tile',
    imports: [
    AsyncPipe,
    NgClass
],
    templateUrl: './tile.component.html',
    styleUrl: './tile.component.css'
})
export class QwirkleTileComponent {
    private imageCacheService = inject(ImageCacheService);

    public tile = input.required<Tile>();
    public tileSize = input(40);
    public tileText = input<number | null>(null);
    public isInteractive = input<boolean>(true);
    public isDisabled = input<boolean>(false);

    protected svgContent = computed(() => {
        return this.imageCacheService.getSVG(
          `assets/qwirkle/${this.tile().shape.toLowerCase()}.svg`,
          this.ColorRGBMap[this.tile().color],
          this.tileSize(),
          this.tileSize()
        );
    })

    private readonly ColorRGBMap: Record<Color, string> = {
        [Color.ORANGE]: "rgb(255, 165, 0)",
        [Color.PURPLE]: "rgb(128, 0, 128)",
        [Color.YELLOW]: "rgb(255, 255, 0)",
        [Color.RED]: "rgb(255, 0, 0)",
        [Color.GREEN]: "rgb(0, 128, 0)",
        [Color.BLUE]: "rgb(0, 0, 255)"
    };
}
