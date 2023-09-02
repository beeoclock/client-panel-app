import {Component, ElementRef, HostBinding, inject, Input, ViewChild, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {TranslateModule} from "@ngx-translate/core";
import {LinkButtonDirective} from "@utility/presentation/directives/button/link.button.directive";

@Component({
  selector: 'utility-back-link-component',
  standalone: true,
  template: `
    <a
      [routerLink]="url"
      [queryParams]="queryParams"
      #link link>
      <i class="bi bi-arrow-left me-2"></i>
      {{ 'keyword.capitalize.back' | translate }}
    </a>
  `,
  imports: [
    RouterLink,
    TranslateModule,
    LinkButtonDirective
  ],
  encapsulation: ViewEncapsulation.None
})
export class BackLinkComponent {

  private readonly activatedRoute = inject(ActivatedRoute);

  @Input()
  public queryParams = {};

  @Input()
  public url: string | string[] = this.activatedRoute.snapshot.queryParams['returnUrl'] ?? ['../'];

  @ViewChild('link')
  public link!: ElementRef<HTMLElement>;

  @HostBinding()
  public readonly class = 'flex';

}
