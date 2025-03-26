import {Component, inject, input, ViewEncapsulation} from "@angular/core";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {RoleEnum} from "@core/shared/enum/role.enum";
import {DefaultLabelDirective} from "@utility/presentation/directives/label/default.label.directive";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormControl, ReactiveFormsModule} from "@angular/forms";

@Component({
	selector: 'member-select-role',
	encapsulation: ViewEncapsulation.None,
	standalone: true,
	imports: [
		DefaultLabelDirective,
		NgSelectModule,
		TranslateModule,
		ReactiveFormsModule
	],
	template: `
		<label default for="member-form-role-select">
			{{ 'keyword.capitalize.role' | translate }}
		</label>
		<ng-select
			labelForId="member-form-role-select"
			bindLabel="label"
			bindValue="value"
			[items]="roles"
			[clearable]="false"
			[formControl]="control()">
		</ng-select>
	`
})
export class SelectRoleComponent {

	public readonly control = input.required<FormControl<RoleEnum>>();

	private readonly translateService = inject(TranslateService);
	public readonly roles = Object.keys(RoleEnum)
		.filter((key) => ![RoleEnum.GUEST, RoleEnum.CUSTOMER, RoleEnum.OWNER].includes(key as RoleEnum))
		.map((key) => {
		return {
			value: key,
			label: this.translateService.instant(`role.${key}`)
		};
	});
}
