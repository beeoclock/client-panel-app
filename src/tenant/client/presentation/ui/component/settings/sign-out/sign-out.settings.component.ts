import {ChangeDetectionStrategy, Component, inject, ViewEncapsulation} from "@angular/core";
import {CardComponent} from "@shared/presentation/ui/component/card/card.component";
import {TranslateModule} from "@ngx-translate/core";
import {ReactiveFormsModule} from "@angular/forms";
import {Auth} from "@angular/fire/auth";
import {Router} from "@angular/router";
import {NGXLogger} from "ngx-logger";

@Component({
  selector: 'client-sign-out-settings-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CardComponent,
    TranslateModule,
    ReactiveFormsModule,
  ],
  template: `
    <bee-card>

      <span class="text-2xl font-bold text-beeColor-500">{{ 'sign-out.title' | translate }}</span>

      <div>

        <button type="button" class="w-auto px-4 py-2 rounded-2xl border border-red-500 text-red-500 hover:bg-red-100"
                (click)="logout()">
          {{ 'sign-out.button.sign-out.label' | translate }}
        </button>
      </div>

    </bee-card>
  `
})
export class SignOutSettingsComponent {

  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
	private readonly logger = inject(NGXLogger);

  public logout(): void {
    this.auth.signOut()
      .then(() => {
        this.router.navigate(['/']).then();
      })
      .catch((error) => {
        this.logger.error(error);
      });
  }

}
