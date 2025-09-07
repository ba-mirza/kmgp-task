import {Injectable, signal} from '@angular/core';

interface UserDTO {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY: string = 'auth_token';
  protected authToken = signal<string | null>(
    sessionStorage.getItem(this.STORAGE_KEY)
  )

  public login(credentials: UserDTO) {
    const token = `token_${credentials.email}`;
    this.setToken(token);
    return true;
  }

  public logout() {
    this.setToken(null);
    sessionStorage.removeItem(this.STORAGE_KEY);
  }

  get token() {
    return this.authToken;
  }

  get isAuthenticated() {
    return !!this.authToken();
  }

  protected setToken(token: string | null) {
    if (!token) {
      sessionStorage.removeItem(this.STORAGE_KEY);
      return;
    }
    this.authToken.set(token);
    sessionStorage.setItem(this.STORAGE_KEY, token as string);
  }
}
