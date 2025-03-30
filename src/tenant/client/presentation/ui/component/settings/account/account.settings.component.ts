import {ChangeDetectionStrategy, Component, inject, ViewEncapsulation} from "@angular/core";
import {CardComponent} from "@shared/presentation/component/card/card.component";
import {TranslateModule} from "@ngx-translate/core";
import {
	ModalChangeNameService
} from "@tenant/client/presentation/ui/component/settings/change-name/modal-change-name.service";
import {IdentityState} from "@identity/identity/presentation/state/identity/identity.state";
import {Select} from "@ngxs/store";
import {Observable} from "rxjs";
import {AsyncPipe} from "@angular/common";
import {
	ModalChangePhoneNumberService
} from "@tenant/client/presentation/ui/component/settings/change-phone-number/modal-change-phone-number.service";

@Component({
  selector: 'client-account-settings-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CardComponent,
    TranslateModule,
    AsyncPipe
  ],
  template: `
    <bee-card>
      <span class="text-2xl font-bold text-beeColor-500">{{ 'keyword.capitalize.account' | translate }}</span>

      <div class="flex justify-between items-center">
        <div class="flex flex-col gap-1">
          <div class="text-beeColor-400">{{ 'keyword.capitalize.name' | translate }}:</div>
          {{ accountName$ | async }}
        </div>
        <button type="button" (click)="editAccountName()" class="rounded-full px-2 py-1 hover:bg-beeColor-200 transition">
          <i class="bi bi-pencil"></i>
        </button>
      </div>

      <div class="flex justify-between items-center">
        <div class="flex flex-col gap-1">
          <div class="text-beeColor-400">{{ 'keyword.capitalize.phone' | translate }}:</div>
          {{ accountPhoneNumber$ | async }}
        </div>
        <button type="button" (click)="editPhoneNumber()" class="rounded-full px-2 py-1 hover:bg-beeColor-200 transition">
          <i class="bi bi-pencil"></i>
        </button>
      </div>

      <div class="flex justify-between items-center">
        <div class="flex flex-col gap-1">
          <div class="text-beeColor-400">{{ 'keyword.capitalize.email' | translate }}:</div>
          {{ accountEmail$ | async }}
        </div>
        <button type="button" disabled class="rounded-full px-2 py-1 hover:bg-beeColor-200 transition">
          <i class="bi bi-pencil"></i>
        </button>
      </div>

    </bee-card>
  `
})
export class AccountSettingsComponent {

  private readonly modalChangeNameService = inject(ModalChangeNameService);
  private readonly modalChangePhoneNumberService = inject(ModalChangePhoneNumberService);

  @Select(IdentityState.accountEmail)
  accountEmail$!: Observable<unknown>;

  @Select(IdentityState.accountEmailIsVerified)
  accountEmailIsVerified$!: Observable<unknown>;

  @Select(IdentityState.accountName)
  accountName$!: Observable<unknown>;

  @Select(IdentityState.accountPhoneNumber)
  accountPhoneNumber$!: Observable<unknown>;

  public editAccountName(): void {
    this.modalChangeNameService.openModal().then();
  }

  public editPhoneNumber(): void {
    this.modalChangePhoneNumberService.openModal().then();
  }

}
