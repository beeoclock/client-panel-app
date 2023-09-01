import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, ViewEncapsulation} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import BusinessClientForm from "@identity/presentation/form/business-client.form";
import {IdentityApiAdapter} from "@identity/adapter/external/api/identity.api.adapter";
import {firstValueFrom, map} from "rxjs";
import {ToastController} from "@ionic/angular";
import {ActivatedRoute, Router} from "@angular/router";
import {BackLinkComponent} from "@utility/presentation/component/link/back.link.component";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {ChangeLanguageComponent} from "@utility/presentation/component/change-language/change-language.component";
import {FormTextareaComponent} from "@utility/presentation/component/input/form.textarea.component";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {LogoutComponent} from "@utility/presentation/component/logout/logout.component";
import {AsyncPipe, NgIf} from "@angular/common";

@Component({
  selector: 'identity-create-business-page',
  templateUrl: 'index.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    BackLinkComponent,
    FormInputComponent,
    ChangeLanguageComponent,
    FormTextareaComponent,
    PrimaryButtonDirective,
    LogoutComponent,
    NgIf,
    AsyncPipe
  ],
  encapsulation: ViewEncapsulation.None
})
export default class Index {

  public readonly translateService = inject(TranslateService);
  public readonly identityApiAdapter = inject(IdentityApiAdapter);
  private readonly toastController = inject(ToastController);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  public readonly firstCompany$ = this.activatedRoute.queryParams.pipe(
    map(({firstCompany}) => !!firstCompany)
  );

  public readonly notFirstCompany$ = this.firstCompany$.pipe(
    map((firstCompany) => !firstCompany)
  );

  public readonly form = new BusinessClientForm();

  public async save(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.form.disable();
      this.form.markAsPending();
      try {
        await firstValueFrom(this.identityApiAdapter.postCreateBusinessClient$(this.form.getRawValue()));
        const toast = await this.toastController.create({
          header: 'Business client',
          message: 'You successfully create new business client!',
          color: 'success',
          position: 'top',
          duration: 10_000,
          buttons: [
            {
              text: this.translateService.instant('keyword.capitalize.close'),
              role: 'cancel',
            },
          ],
        });
        await toast.present();
        const {firstCompany} = this.activatedRoute.snapshot.queryParams;
        await this.router.navigate(['/', 'identity', 'corridor'], {
          queryParams: {
            force: true,
            firstCompany
          }
        });
      } catch (e) {

      }
      this.form.enable();
      this.form.updateValueAndValidity();
      this.changeDetectorRef.detectChanges();
    }
  }

}
