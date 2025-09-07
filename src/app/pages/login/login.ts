import {Component, inject} from '@angular/core';
import {InputComponent} from '../../components/ui/input.component';
import {AuthService} from '../../core/auth/auth.service';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {ButtonComponent} from '../../components/ui/button.component';
import { MessageModule } from 'primeng/message';
import {ToastService} from '../../shared/toast.service';
import {Router} from '@angular/router';

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
  protected router = inject(Router);

  protected emailField = new FormControl('', [Validators.required, Validators.email]);
  protected passwordField = new FormControl('', [Validators.required, Validators.minLength(3)]);

  async login(): Promise<void> {
    if (this.emailField.invalid || this.passwordField.invalid) {
      this.emailField.markAsTouched();
      this.passwordField.markAsTouched();
      this.toastService.error("Заполните все поля корректно");
      return;
    }

    const email = this.emailField.value;
    const password = this.passwordField.value;

    if (!email || !password) {
      this.toastService.error("Email и пароль обязательны");
      return;
    }

    try {
      const success = await this.authService.login({ email, password });

      if (success) {
        this.toastService.success("Вход выполнен успешно!");
        await this.router.navigate(['/orders']);
      } else {
        this.toastService.error("Неверный email или пароль");
      }
    } catch (error) {
      this.toastService.error("Ошибка при входе в систему");
    }
  }
}
