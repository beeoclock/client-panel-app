import {ChangeDetectionStrategy, Component, inject, input, ViewEncapsulation} from "@angular/core";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {DefaultLabelDirective} from "@shared/presentation/directives/label/default.label.directive";
import {AutomaticApprovalTimeType} from "@core/shared/enum/automatic-approval-time.enum";

@Component({
  selector: 'select-auto-action-type-on-event-component',
  standalone: true,
  template: `
		<div class="relative">
			<label default [for]="id()">
				{{ 'keyword.capitalize.autoActionTypeOnOrder' | translate }}
			</label>
			<ng-select bindLabel="name"
				bindValue="type"
				[items]="autoActionTypeList"
				[clearable]="false"
				[id]="id()"
				[formControl]="control()" />
		</div>
		<div class="italic leading-tight p-2 text-beeColor-500 text-sm">
			{{ 'client.profile.form.section.bookingSettings.input.autoActionTypeOnOrder.placeholder' | translate }}
		</div>
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

  public readonly id = input('');

  public readonly control = input(new FormControl());

  public readonly translateService = inject(TranslateService);

  public readonly autoActionTypeList = Object.values(AutomaticApprovalTimeType)
    .filter((autoActionType) => typeof autoActionType === 'string')
    .map((autoActionType) => {
      return {
        name: this.translateService.instant(`autoActionTypeOnOrder.${autoActionType}`),
        type: AutomaticApprovalTimeType[autoActionType as keyof typeof AutomaticApprovalTimeType]
      };
    });

}
