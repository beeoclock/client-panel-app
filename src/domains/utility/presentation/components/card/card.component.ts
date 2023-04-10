import {Component, HostBinding, ViewEncapsulation} from '@angular/core';
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
    <ng-content></ng-content>
  `
})
export class CardComponent {
  @HostBinding()
  public readonly class = ['card'];
}
