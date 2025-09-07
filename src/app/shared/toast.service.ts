import {inject, Injectable} from '@angular/core';
import {MessageService} from 'primeng/api';

@Injectable()
export class ToastService {
  protected toast = inject(MessageService);

  success(message: string, detail?: string): void {
    this.toast.add({
      severity: 'success',
      summary: 'Успех',
      detail: message,
      life: 3000
    });
  }

  error(message: string, detail?: string): void {
    this.toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: message,
      life: 5000
    });
  }

  warn(message: string, detail?: string): void {
    this.toast.add({
      severity: 'warn',
      summary: 'Предупреждение',
      detail: message,
      life: 4000
    });
  }

  info(message: string, detail?: string): void {
    this.toast.add({
      severity: 'info',
      summary: 'Информация',
      detail: message,
      life: 3000
    });
  }

  clear(): void {
    this.toast.clear();
  }
}
