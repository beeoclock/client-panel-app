import {Component, Input, ViewEncapsulation} from '@angular/core';
import {InputDirective} from '@utility/directives/input/input.directive';
import {DeleteButtonComponent} from '@utility/presentation/component/button/delete.button.component';
import {ReactiveFormsModule} from '@angular/forms';
import {SpinnerComponent} from '@utility/presentation/component/spinner/spinner.component';
import {NgForOf, NgIf} from '@angular/common';
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";
import {SocialNetworkForm} from "@client/form/social-network.form";
import {SOCIAL_NETWORKS} from "@utility/domain/enum/social-network.enum";
import {NgSelectModule} from "@ng-select/ng-select";

@Component({
  selector: 'client-form-social-network-link-form-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    InputDirective,
    DeleteButtonComponent,
    ReactiveFormsModule,
    SpinnerComponent,
    NgIf,
    LoaderComponent,
    NgForOf,
    NgSelectModule
  ],
  template: `
    <form [formGroup]="form" class="flex gap-4 justify-between">
      <div class="w-40">
        <label for="type">Social Network</label>
        <ng-select
          id="type"
          formControlName="type"
          [items]="socialNetworks"
          [clearable]="false">
        </ng-select>
      </div>
      <div class="w-full">
        <label for="link">Link</label>
        <input type="text" placeholder="https://example.com" class="rounded border px-3 py-2 w-full" id="link" formControlName="link">
      </div>
    </form>
  `
})
export class SocialNetworkLinkFormComponent {

  @Input()
  public form!: SocialNetworkForm;

  public readonly socialNetworks = SOCIAL_NETWORKS;

}
