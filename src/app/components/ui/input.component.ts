import { Component, input } from "@angular/core";
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {Message} from 'primeng/message';

type Type = 'text' | 'email' | 'password';
type Variants = 'default' | 'error';

@Component({
  selector: 'ui-input',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Message
  ],
  template: `
    <div class="flex flex-col space-y-1">
      @if (label()) {
        <label [for]="inputId" class="text-sm font-medium text-gray-700">
          {{ label() }}
          @if (required()) {
            <span class="text-red-500 ml-1">*</span>
          }
        </label>
      }

      <input
        [id]="inputId"
        [formControl]="control()"
        [type]="type()"
        [placeholder]="placeholder()"
        [disabled]="disabled()"
        [class]="inputClass"
        (blur)="control().markAsTouched()"
      />

      @if (control().invalid && control().touched && control().errors) {
        <div class="text-xs text-red-500 mt-1">
          @if (control().errors?.['email']) {
            <p-message severity="error">Введите корректный email</p-message>
          }
          @if (control().errors?.['minlength']) {
            <p-message severity="error">Минимум {{ control().errors?.['minlength'].requiredLength }} символов</p-message>
          }
        </div>
      }
    </div>
  `
})
export class InputComponent {
  control = input.required<FormControl<string | null>>();
  label = input<string>('');
  type = input<Type>('text');
  placeholder = input<string>('');
  disabled = input<boolean>(false);
  required = input<boolean>(false);
  variant = input<Variants>('default');

  protected inputId = `input-${Math.random().toString(36).substr(2, 9)}`;

  protected get inputClass(): string {
    const base = 'px-3 py-2 border rounded-lg w-full focus:outline-none transition-colors duration-200';
    const hasErrors = this.control().invalid && this.control().touched;
    const variant = this.variant() === 'error' || hasErrors
      ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100'
      : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100';

    return `${base} ${variant}`;
  }
}
