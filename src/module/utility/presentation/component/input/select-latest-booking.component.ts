import {ChangeDetectionStrategy, Component, inject, Input, ViewEncapsulation} from "@angular/core";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {LatestBookingEnum} from "@utility/domain/enum/latest-booking.enum";
import {DefaultLabelDirective} from "@utility/presentation/directives/label/default.label.directive";
import {NgSelectModule} from "@ng-select/ng-select";

@Component({
  selector: 'select-latest-booking-component',
  standalone: true,
  template: `
    <label default
           [for]="id">{{ 'keyword.capitalize.latestBooking' | translate }}</label>
    <div class="text-sm text-beeColor-500">
      {{ 'client.profile.form.section.bookingSettings.input.latestBooking.placeholder' | translate }}
    </div>
    <ng-select
      bindLabel="name"
      bindValue="seconds"
      [items]="latestBookingList"
      [clearable]="false"
      [id]="id"
      [formControl]="control">
    </ng-select>
  `,
  encapsulation: ViewEncapsulation.None,
	imports: [
		ReactiveFormsModule,
		TranslateModule,
		DefaultLabelDirective,
		NgSelectModule
	],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectLatestBookingComponent {

  @Input()
  public id = '';

  @Input()
  public control = new FormControl();

  public readonly translateService = inject(TranslateService);

  public readonly latestBookingList = Object.values(LatestBookingEnum)
    .filter((latestBookingName) => typeof latestBookingName === 'string')
    .map((latestBookingName) => {
      return {
        name: this.translateService.instant(`latestBooking.${latestBookingName}`),
        seconds: LatestBookingEnum[latestBookingName as keyof typeof LatestBookingEnum]
      };
    });

}
