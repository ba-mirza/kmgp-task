import {Injectable, signal} from '@angular/core';
import {delay} from '../../shared/utils/delay';

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

  async login(credentials: UserDTO): Promise<boolean> {
    await delay(1000);

    if (credentials.email.includes('@') && credentials.password.length >= 3) {
      const token = `token_${credentials.email}_${Date.now()}`;
      this.setToken(token);
      return true;
    }

    return false;
  }

  logout() {
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
