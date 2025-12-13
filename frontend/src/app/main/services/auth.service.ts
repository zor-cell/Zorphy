import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Globals} from "../classes/globals";
import {Observable, tap} from "rxjs";
import {UserLoginDetails} from "../dto/all/UserLoginDetails";
import {UserDetails} from "../dto/all/UserDetails";
import {Role} from "../dto/all/Role";
import {environment} from "../../../environments/environment";
import {SILENT_ERROR_CONTEXT} from "../classes/interceptors";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly baseUri: string = environment.httpApiUrl;
    private httpClient = inject(HttpClient);

    public user: UserDetails | null = null;

    login(credentials: UserLoginDetails): Observable<void> {
        return this.httpClient.post<void>(this.baseUri + '/login', credentials);
    }

    logout() {
        return this.httpClient.post<void>(this.baseUri + '/logout', null);
    }

    loadUser(): Observable<UserDetails> {
        return this.httpClient.get<UserDetails>(this.baseUri + '/users/me', {
            context: SILENT_ERROR_CONTEXT
        }).pipe(
            tap(user => this.user = user)
        );
    }

    isAdmin(): boolean {
        return this.user?.roles.includes(Role.ADMIN) ?? false;
    }

    isAuthenticated(): boolean {
        return !!this.user;
    }
}
