import {ChangeDetectionStrategy, Component, inject, ViewEncapsulation} from "@angular/core";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {TranslateModule} from "@ngx-translate/core";
import {ReactiveFormsModule} from "@angular/forms";
import {LanguageInputComponent} from "@client/presentation/component/settings/language-input.component";
import {ThemeInputComponent} from "@client/presentation/component/settings/theme-input.component";
import {Auth} from "@angular/fire/auth";
import {Router} from "@angular/router";

@Component({
  selector: 'client-sign-out-settings-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CardComponent,
    TranslateModule,
    ReactiveFormsModule,
    LanguageInputComponent,
    ThemeInputComponent
  ],
  template: `
    <card>

      <span class="text-2xl font-bold text-beeColor-500">{{ 'sign-out.title' | translate }}</span>

      <div>

        <button class="w-auto px-4 py-2 rounded-2xl border border-red-500 text-red-500 hover:bg-red-100"
                (click)="logout()">
          {{ 'sign-out.button.sign-out.label' | translate }}
        </button>
      </div>

    </card>
  `
})
export class SignOutSettingsComponent {

  private readonly auth = inject(Auth);
  private readonly router = inject(Router);


  public logout(): void {
    this.auth.signOut()
      .then(() => {
        this.router.navigate(['/'])
      })
      .catch((error) => {
        console.log(error);
      });
  }

}