import { Component, input } from "@angular/core";
import {FormControl, ReactiveFormsModule} from '@angular/forms';

type Type = 'text' | 'email' | 'password';
type Variants = 'default' | 'error';

@Component({
  selector: 'ui-input',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  template: `
    <input
      [formControl]="control()"
      [type]="type()"
      [placeholder]="placeholder()"
      [disabled]="disabled()"
      [value]="control().value"
      [class]="inputClass"
      (blur)="control().markAsTouched()"
    />
  `
})
export class InputComponent {
  control = input.required<FormControl<string | null>>();
  type = input<Type>('text');
  placeholder = input<string>('');
  disabled = input<boolean>(false);
  variant = input<Variants>('default');

  protected get inputClass(): string {
    const base = 'px-3 py-2 border rounded-md w-full focus:outline-none';
    const hasErrors = this.control().invalid && this.control().touched;
    const variant = this.variant() === 'error' || hasErrors
      ? 'border-red-500 focus:ring-2 focus:ring-red-500'
      : 'border-gray-300 focus:ring-2 focus:ring-blue-500';

    return `${base} ${variant}`;
  }
}
