import {ApplicationConfig, importProvidersFrom, provideZonelessChangeDetection} from '@angular/core';
import {provideRouter, withComponentInputBinding} from '@angular/router';

import {routes} from './app.routes';
import {provideHttpClient, withInterceptors, withXsrfConfiguration} from "@angular/common/http";
import {provideCharts, withDefaultRegisterables} from 'ng2-charts';
import {credentialInterceptor, errorInterceptor} from "./main/core/interceptors";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {LIGHTBOX_CONFIG, LightboxConfig} from "ng-gallery/lightbox";
import {GALLERY_CONFIG, GalleryConfig} from "ng-gallery";
import {WebSocketService} from "./sites/core/ws/web-socket.service";
import {webSocketConfig} from "./sites/core/ws/web-socket-config";

const galleryProvider: {provide: any, useValue: GalleryConfig} = {
    provide: GALLERY_CONFIG,
    useValue: {
        thumbPosition: 'bottom',
        imageSize: 'contain',
        thumbs: true,
        thumbImageSize: 'cover'
    }
};

const lightBoxProvider: {provide: any, useValue: LightboxConfig} = {
    provide: LIGHTBOX_CONFIG,
    useValue: {
        keyboardShortcuts: false,
        exitAnimationTime: 500
    }
};

export const appConfig: ApplicationConfig = {
    providers: [
        provideZonelessChangeDetection(),
        provideRouter(routes, withComponentInputBinding()),
        provideHttpClient(
          withInterceptors([credentialInterceptor, errorInterceptor]),
          withXsrfConfiguration({
              cookieName: 'XSRF-TOKEN',
              headerName: 'X-XSRF-TOKEN'
        })),
        importProvidersFrom(
            BrowserAnimationsModule
        ),
        provideCharts(withDefaultRegisterables()),
        galleryProvider,
        lightBoxProvider
    ]
};