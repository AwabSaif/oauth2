import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  issuer: 'https://dev.sarsatarabia.com/auth',
  clientId: 'spaclient',
  responseType: 'code',
  redirectUri: window.location.origin + '',
  postLogoutRedirectUri: window.location.origin + '',
  silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html',
  scope: 'openid profile email api offline_access',
  useSilentRefresh: true,
  // silentRefreshTimeout: 5000,
  timeoutFactor: 0.25,
  sessionChecksEnabled: true,
  showDebugInformation: true,
  clearHashAfterLogin: false,
  requireHttps: false,
  nonceStateSeparator: 'semicolon',
};
