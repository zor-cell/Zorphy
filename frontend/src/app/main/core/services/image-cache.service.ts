import {Injectable} from '@angular/core';
import {map, Observable, shareReplay} from "rxjs";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {HttpClient} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class ImageCacheService {
    private cache: Map<string, Observable<SafeHtml>> = new Map();

    constructor(private http: HttpClient, private sanitizer: DomSanitizer) {
    }

    clear() {
        this.cache.clear();
    }

    getSVG(url: string, color: string, width: number, height: number): Observable<SafeHtml> {
        const key = `${url}|${color}|${width}x${height}`;

        if (this.cache.has(key)) {
            return this.cache.get(key)!;
        }

        const svg = this.http
            .get(url, {responseType: 'text'})
            .pipe(
                map(svg => {
                    svg = svg
                        .replace(/fill="[^"]*"/g, `fill="${color}"`)
                        .replace(/width="[^"]*"/, `width="${width}"`)
                        .replace(/height="[^"]*"/, `height="${height}"`);

                    return this.sanitizer.bypassSecurityTrustHtml(svg);
                }),
                shareReplay(1) // cache the response for future subscribers
            );

        this.cache.set(key, svg);
        return svg;
    }
}
