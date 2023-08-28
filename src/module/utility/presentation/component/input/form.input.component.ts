import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from "@angular/core";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {IsRequiredDirective} from "@utility/presentation/directives/is-required/is-required";
import {InvalidTooltipDirective} from "@utility/presentation/directives/invalid-tooltip/invalid-tooltip.directive";
import {DefaultInputDirective} from "@utility/presentation/directives/input/default.input.directive";
import {DefaultLabelDirective} from "@utility/presentation/directives/label/default.label.directive";

@Component({
  selector: 'form-input',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IsRequiredDirective,
    InvalidTooltipDirective,
    ReactiveFormsModule,
    NgIf,
    DefaultInputDirective,
    DefaultLabelDirective,
  ],
  template: `
    <label default *ngIf="showLabel" [for]="id">
      {{ label }}
    </label>
    <input
      isRequired
      invalidTooltip
      default
      [isRequiredEnabled]="showLabel"
      [class.disabled]="disabled"
      [formControl]="control"
      [placeholder]="placeholder"
      [id]="id"
      [type]="type"
      [autocomplete]="autocomplete">
  `
})
export class FormInputComponent {

  @Input()
  public label = 'todo';

  @Input()
  public showLabel = true;

  @Input()
  public id = 'utility-base-input';

  @Input()
  public type: string = 'text';

  @Input()
  public placeholder: string = '';

  @Input()
  public autocomplete: string = '';

  @Input()
  public disabled = false;

  @Input()
  public control!: FormControl;


}
