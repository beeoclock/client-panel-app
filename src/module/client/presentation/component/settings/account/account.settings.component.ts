import {ChangeDetectionStrategy, Component, inject, ViewEncapsulation} from "@angular/core";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {TranslateModule} from "@ngx-translate/core";
import {ModalChangeNameService} from "@client/presentation/component/settings/change-name/modal-change-name.service";
import {IdentityState} from "@identity/state/identity/identity.state";
import {Select} from "@ngxs/store";
import {Observable} from "rxjs";
import {AsyncPipe} from "@angular/common";
import {
  ModalChangePhoneNumberService
} from "@client/presentation/component/settings/change-phone-number/modal-change-phone-number.service";

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
    <card>
      <span class="text-2xl font-bold text-beeColor-500">{{ 'keyword.capitalize.account' | translate }}</span>

      <div class="flex justify-between items-center">
        <div class="flex flex-col gap-1">
          <div class="text-beeColor-400">{{ 'general.name' | translate }}:</div>
          {{ accountName$ | async }}
        </div>
        <button (click)="editAccountName()" class="rounded-full px-2 py-1 hover:bg-beeColor-200 transition">
          <i class="bi bi-pencil"></i>
        </button>
      </div>

      <div class="flex justify-between items-center">
        <div class="flex flex-col gap-1">
          <div class="text-beeColor-400">{{ 'keyword.capitalize.phone' | translate }}:</div>
          {{ accountPhoneNumber$ | async }}
        </div>
        <button (click)="editPhoneNumber()" class="rounded-full px-2 py-1 hover:bg-beeColor-200 transition">
          <i class="bi bi-pencil"></i>
        </button>
      </div>

      <div class="flex justify-between items-center">
        <div class="flex flex-col gap-1">
          <div class="text-beeColor-400">{{ 'keyword.capitalize.email' | translate }}:</div>
          {{ accountEmail$ | async }}
        </div>
        <button disabled class="rounded-full px-2 py-1 hover:bg-beeColor-200 transition">
          <i class="bi bi-pencil"></i>
        </button>
      </div>

    </card>
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
    this.modalChangeNameService.openModal();
  }

  public editPhoneNumber(): void {
    this.modalChangePhoneNumberService.openModal();
  }

}
