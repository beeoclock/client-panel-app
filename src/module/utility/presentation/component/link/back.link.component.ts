import {Component, Input, ViewEncapsulation} from '@angular/core';
import {RouterLink} from '@angular/router';
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'utility-back-link-component',
  standalone: true,
  template: `
    <a [routerLink]="url"
       class="
        text-black
        dark:text-white
        hover:bg-beeColor-300
        dark:hover:bg-beeColor-700
        flex items-center
        justify-center
        p-2
        rounded
        text-center w-24">
      <i class="bi bi-arrow-left me-2"></i>
      {{ 'general.back' | translate }}
    </a>
  `,
  imports: [
    RouterLink,
    TranslateModule
  ],
  encapsulation: ViewEncapsulation.None
})
export class BackLinkComponent {
  @Input()
  public url: string | string[] = ['../'];
}
