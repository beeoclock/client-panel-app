import {Component, Input, ViewEncapsulation} from '@angular/core';
import {HeaderCardComponent} from '@utility/presentation/components/card/header.card.component';
import {BodyCardComponent} from '@utility/presentation/components/card/body.card.component';
import {NgIf} from '@angular/common';

@Component({
  selector: 'utility-card-component',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    HeaderCardComponent,
    BodyCardComponent,
    NgIf
  ],
  template: `
    <div class="card my-3">
      <utility-header-card-component
        *ngIf="headerEnable">
      </utility-header-card-component>
      <utility-body-card-component>
        <ng-content></ng-content>
      </utility-body-card-component>
    </div>
  `
})
export class CardComponent {
  @Input()
  public headerEnable: boolean = false;
}
