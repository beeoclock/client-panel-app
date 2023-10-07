import {ChangeDetectionStrategy, Component, inject, Input, ViewEncapsulation} from "@angular/core";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {DefaultLabelDirective} from "@utility/presentation/directives/label/default.label.directive";
import {AutomaticApprovalTimeType} from "@utility/domain/enum/automatic-approval-time.enum";

@Component({
  selector: 'select-auto-action-type-on-event-component',
  standalone: true,
  template: `
		<label default [for]="id">
			{{ 'keyword.capitalize.autoActionTypeOnEvent' | translate }}
		</label>
		<div class="text-sm text-beeColor-500">
			{{ 'client.profile.form.section.bookingSettings.input.autoActionTypeOnEvent.placeholder' | translate }}
		</div>
		<ng-select
			bindLabel="name"
			bindValue="type"
			[items]="autoActionTypeList"
			[clearable]="false"
			[id]="id"
			[formControl]="control">
		</ng-select>
	`,
  encapsulation: ViewEncapsulation.None,
	imports: [
		NgSelectModule,
		ReactiveFormsModule,
		TranslateModule,
		DefaultLabelDirective
	],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectAutoActionTypeOnEventComponent {

  @Input()
  public id = '';

  @Input()
  public control = new FormControl();

  public readonly translateService = inject(TranslateService);

  public readonly autoActionTypeList = Object.values(AutomaticApprovalTimeType)
    .filter((autoActionType) => typeof autoActionType === 'string')
    .map((autoActionType) => {
      return {
        name: this.translateService.instant(`autoActionTypeOnEvent.${autoActionType}`),
        type: AutomaticApprovalTimeType[autoActionType as keyof typeof AutomaticApprovalTimeType]
      };
    });

}
