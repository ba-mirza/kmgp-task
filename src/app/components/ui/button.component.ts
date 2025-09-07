import {Component, input, output} from '@angular/core';

type Variants = 'primary' | 'secondary';

@Component({
  selector: 'ui-button',
  standalone: true,
  template: `
    <button
      [class]="buttonClass"
      [disabled]="disabled()"
      (click)="onClick.emit()">
      <ng-content></ng-content>
    </button>
  `
})
export class ButtonComponent {
  variant = input<Variants>('primary');
  disabled = input<boolean>(false);
  onClick = output<void>();

  get buttonClass() {
    return `px-4 py-2 rounded cursor-pointer hover:opacity-80 ${
      this.variant() === 'primary'
        ? 'bg-blue-500 text-white'
        : 'bg-gray-200 text-gray-700'
    }`;
  }
}
