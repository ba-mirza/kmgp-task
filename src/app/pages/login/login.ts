import {Component, inject, signal} from '@angular/core';
import {InputComponent} from '../../components/ui/input.component';
import {AuthService} from '../../core/auth/auth.service';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {ButtonComponent} from '../../components/ui/button.component';
import { MessageModule } from 'primeng/message';
import {ToastService} from '../../shared/toast.service';

@Component({
  selector: 'app-login',
  imports: [
    InputComponent,
    ReactiveFormsModule,
    MessageModule,
    ButtonComponent,
  ],
  providers: [ToastService],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  protected authService = inject(AuthService);
  protected toastService = inject(ToastService);

  protected emailField = new FormControl('', [Validators.required, Validators.email, Validators.min(5)]);
  protected passwordField = new FormControl('', [Validators.required]);

  login(): void {
    const email = this.emailField.value;
    const password = this.passwordField.value;

    if(email && password) {
      const dto = { email, password}
      const logged = this.authService.login(dto)
      if(logged) {
        this.toastService.success("Logged in successfully!");
      }
      return;
    }

    return this.toastService.error("Invalid email or password");
  }
}
