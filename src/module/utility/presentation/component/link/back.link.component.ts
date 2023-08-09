import {Component, ElementRef, Input, ViewChild, ViewEncapsulation} from '@angular/core';
import {RouterLink} from '@angular/router';
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'utility-back-link-component',
  standalone: true,
  template: `
    <a [routerLink]="url"
       #link
       class="
        text-black
        dark:text-white
        hover:bg-beeColor-300
        dark:hover:bg-beeDarkColor-700
        flex items-center
        justify-center
        px-4
        py-2
        rounded-2xl
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

  @ViewChild('link')
  public link!: ElementRef<HTMLElement>;
}
