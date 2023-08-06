import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core';
import {NgIf} from '@angular/common';
import {SpinnerComponent} from '@utility/presentation/component/spinner/spinner.component';
import {TranslateModule} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'edit-link-component',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <a type="button"
       routerLink="form"
       [class.w-full]="buttonWidthFull"
       class="
        flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-beeColor-900 shadow-sm ring-1 ring-inset ring-beeColor-300 hover:bg-beeColor-50">
      <i class="bi bi-pencil me-2"></i>
      {{ 'general.edit' | translate }}
    </a>

  `,
  imports: [
    NgIf,
    SpinnerComponent,
    TranslateModule,
    RouterLink
  ]
})
export class EditLinkComponent {

  @Input()
  public buttonWidthFull = false;

}
