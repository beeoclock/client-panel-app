import {Component, Input, ViewEncapsulation} from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'utility-back-link-component',
  standalone: true,
  template: `
    <a [routerLink]="url" class="bg-blue-600 flex items-center justify-center p-2 rounded text-center text-white w-24">
      <i class="bi bi-arrow-left me-2"></i>
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
