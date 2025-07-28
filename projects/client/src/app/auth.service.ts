import { Injectable } from '@angular/core';
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';
import { BehaviorSubject, filter, map } from 'rxjs';
import { authConfig } from './auth-config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject$ = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject$.asObservable();

  private isDoneLoadingSubject$ = new BehaviorSubject<boolean>(false);
  public isDoneLoading$ = this.isDoneLoadingSubject$.asObservable();

  /**
   * Publishes `true` if and only if (a) all the asynchronous initial
   * login calls have completed or errorred, and (b) the user ended up
   * being authenticated.
   *
   * In essence, it combines:
   *
   * - the latest known state of whether the user is authorized
   * - whether the ajax calls for initial log in have all been done
   */
  public canActivateProtectedRoutes$ = this.isDoneLoading$.pipe(
    filter(isDone => isDone),
    map(() => this.isAuthenticated)
  );

  constructor(private oauthService: OAuthService) {
    // Useful for debugging:
    this.oauthService.events.subscribe(event => {
      if (event.type === 'discovery_document_loaded') {
        console.log('Discovery document loaded');
      }
      if (event.type === 'token_received') {
        console.log('Token received');
        this.isAuthenticatedSubject$.next(this.isAuthenticated);
      }
      if (event.type === 'token_expires') {
        console.log('Token expires');
      }
    });

    // This is tricky, as it might cause race conditions (where access_token is set in another
    // tab before everything is said and done there.
    // TODO: Improve this setup. See: https://github.com/jeroenheijmans/sample-angular-oauth2-oidc-with-auth-guards/issues/2
    window.addEventListener('storage', (event) => {
      // The `key` is `null` when the event was caused by `.clear()`
      if (event.key !== 'access_token' && event.key !== null) {
        return;
      }

      console.warn('Noticed changes to access_token (most likely from another tab), updating isAuthenticated');
      this.isAuthenticatedSubject$.next(this.isAuthenticated);
    });

    this.isAuthenticatedSubject$.next(this.isAuthenticated);
  }

  public runInitialLoginSequence(): Promise<void> {
    if (location.hash) {
      console.log('Encountered hash fragment, plotting as table...');
      console.table(location.hash.substr(1).split('&').map(kvp => kvp.split('=')));
    }

    // 0. LOAD CONFIG:
    // First we have to check to see how the IdServer is
    // currently configured:
    return this.oauthService.loadDiscoveryDocument()

      // 1. HASH LOGIN:
      // Try to log in via hash fragment after redirect back
      // from Identity Provider; uses the hash fragment
      // that results from the redirect (callback)
      .then(() => this.oauthService.tryLogin())

      // 2. SILENT REFRESH:
      // Try to get a new token via a refresh token
      // if we still have one; this should work here
      // if we had the token-refresh-iframe-setup working
      .then(() => {
        if (this.oauthService.hasValidAccessToken()) {
          return Promise.resolve();
        }

        // If we get here, we don't have a token or it's invalid.
        // If silent refresh is enabled, try to get a new token silently
        if (this.oauthService.silentRefreshRedirectUri) {
          return this.oauthService.silentRefresh()
            .then(() => Promise.resolve())
            .catch(result => {
              // Subset of situations from https://openid.net/specs/openid-connect-implicit-1_0.html#ErrorHandling
              // Only the ones where it's reasonably sure that sending the
              // user to the IdServer will help.
              const errorResponsesRequiringUserInteraction = [
                'interaction_required',
                'login_required',
                'account_selection_required',
                'consent_required',
              ];

              if (result
                && result.reason
                && errorResponsesRequiringUserInteraction.indexOf(result.reason.error) >= 0) {

                // At this point we know for sure that we have to ask the
                // user to log in, so we redirect them to the IdServer to
                // enter credentials.
                //
                // Enable this to ALWAYS force a user to login.
                // this.login();
                //
                // Instead, we'll now do this:
                console.warn('User interaction is required to log in, we will wait for the user to manually log in.');
                return Promise.resolve();
              }

              // We can't handle the truth, just pass on the problem to the
              // next handler.
              return Promise.reject(result);
            });
        } else {
          // CASE: not using silent refresh, which means if we get here we have to ask the
          // user to log in manually.
          return Promise.resolve();
        }
      })

      .then(() => {
        this.isDoneLoadingSubject$.next(true);

        // Check for the strings 'undefined' and 'null' just to be sure. Our current
        // login(...) should never have this, but in case someone ever calls
        // initImplicitFlow(undefined | null) this could happen.
        if (this.oauthService.state && this.oauthService.state !== 'undefined' && this.oauthService.state !== 'null') {
          console.log('There was state of: ' + this.oauthService.state + '. Navigating to: ' + this.oauthService.state);
          // this.router.navigateByUrl(this.oauthService.state);
        }
      })
      .catch(() => this.isDoneLoadingSubject$.next(true));
  }

  public login(targetUrl?: string): void {
    // Note: before version 9.1.0 of the library you needed to
    // call encodeURIComponent on the argument to the method.
    this.oauthService.initLoginFlow(targetUrl || this.defaultTarget);
  }

  private get defaultTarget(): string {
    return '/';
  }

  public logout(): void {
    this.oauthService.logOut()
  }

  public refresh(): void {
    this.oauthService.silentRefresh();
  }

  public hasValidToken(): boolean {
    return this.oauthService.hasValidAccessToken();
  }


  // for debugging it makes sense.
  public get accessToken(): string {
    return this.oauthService.getAccessToken();
  }

  public get refreshToken(): string {
    return this.oauthService.getRefreshToken();
  }

  public get identityClaims(): object {
    return this.oauthService.getIdentityClaims() || {};
  }

  public get idToken(): string {
    return this.oauthService.getIdToken();
  }

  public get logoutUrl(): string {
    return this.oauthService.logoutUrl ?? '';
  }

  public get isAuthenticated(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  // Method to configure OAuth service
  public configure(): void {
    this.oauthService.configure(authConfig);
  }
}
