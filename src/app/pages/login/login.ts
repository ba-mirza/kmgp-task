import {Component, inject, signal} from '@angular/core';
import {InputComponent} from '../../components/ui/input.component';
import {AuthService} from '../../core/auth/auth.service';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {ButtonComponent} from '../../components/ui/button.component';

@Component({
  selector: 'app-login',
  imports: [
    InputComponent,
    ReactiveFormsModule,
    ButtonComponent
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  protected authService = inject(AuthService);
  protected errorMessage = signal<string>('');
  protected emailField = new FormControl('', [Validators.required, Validators.email, Validators.min(5)]);
  protected passwordField = new FormControl('', [Validators.required]);

  login(): void {
    const email = this.emailField.value;
    const password = this.passwordField.value;

    if(email && password) {
      const dto = { email, password}
      this.authService.login(dto)
      return;
    }

    this.errorMessage.set('email and password required');
  }
}
