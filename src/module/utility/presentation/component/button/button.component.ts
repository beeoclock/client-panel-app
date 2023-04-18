import {Component, HostBinding, Input, ViewEncapsulation} from '@angular/core';
import {NgIf} from '@angular/common';
import {SpinnerComponent} from '@utility/presentation/component/spinner/spinner.component';

type BtnColorType =
  'btn-secondary'
  | 'btn-info'
  | 'btn-primary'
  | 'btn-dark'
  | 'btn-danger'
  | 'btn-warning'
  | 'btn-light'
  | 'btn-success'
  | 'btn-muted'
  | 'btn-white';

@Component({
  selector: 'button[beeoclock]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-container *ngIf="showLoader; else ContentTemplate">
      <div spinner [sm]="true"></div>
    </ng-container>
    <ng-template #ContentTemplate>
      <ng-content></ng-content>
    </ng-template>
  `,
  imports: [
    NgIf,
    SpinnerComponent
  ]
})
export class ButtonComponent {

  @Input()
  public color: BtnColorType = 'btn-primary';

  @HostBinding()
  public class = ['btn', this.color, 'd-flex', 'justify-content-center', 'align-items-center'];

  @HostBinding()
  public type: 'reset' | 'button' | 'submit' = 'submit';

  @Input()
  public showLoader = false;
}
