import {Component, Input, ViewEncapsulation} from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'utility-back-link-component',
  standalone: true,
  template: `
    <a [routerLink]="url" class="btn btn-secondary">
      <i class="bi bi-arrow-left"></i>
      back
    </a>
  `,
  imports: [
    RouterLink
  ],
  encapsulation: ViewEncapsulation.None
})
export class BackLinkComponent {
  @Input()
  public url: string | string[] = ['../'];
}
