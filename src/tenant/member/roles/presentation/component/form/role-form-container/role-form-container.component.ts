import {Component, inject, input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {Store} from "@ngxs/store";
import {RoleForm} from "@tenant/member/roles/presentation/form/role.form";
import {firstValueFrom} from "rxjs";
import {FormInputComponent} from "@shared/presentation/component/input/form.input.component";
import {PrimaryButtonDirective} from "@shared/presentation/directives/button/primary.button.directive";
import {CardComponent} from "@shared/presentation/component/card/card.component";
import {SwitchComponent} from "@shared/presentation/component/switch/switch.component";
import {CommonModule} from "@angular/common";
import {IRole} from "@tenant/member/roles/domain";
import {RoleDataActions} from "@tenant/member/roles/infrastructure/state/data/role.data.actions";
import {
	RolePresentationActions
} from "@tenant/member/roles/infrastructure/state/presentation/role.presentation.actions";

@Component({
	selector: 'role-form-page',
	templateUrl: './role-form-container.component.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		CommonModule,
		PrimaryButtonDirective,
		TranslateModule,
		FormInputComponent,
		CardComponent,
		SwitchComponent,
	],
	standalone: true
})
export class RoleFormContainerComponent implements OnInit, OnChanges {

	private readonly store = inject(Store);

	public form = new RoleForm();

	public readonly item = input<IRole.EntityRaw>();

	public readonly isEditMode = input<boolean>(false);

	public ngOnInit(): void {
		this.detectItem();
	}

	public ngOnChanges(changes: SimpleChanges & { item: IRole.EntityRaw | undefined }) {

		const {item} = changes;
		if (item) {
			this.detectItem();
		}

	}

	public detectItem(): void {
		const item = this.item();
		if (this.isEditMode() && item) {
			this.form = RoleForm.create(item);
			this.form.updateValueAndValidity();
		}
	}

	public async save(): Promise<void> {
		this.form.markAllAsTouched();
		if (this.form.valid) {

			this.form.disable();
			this.form.markAsPending();
			const roleBody = this.form.getRawValue();
			const actions: any[] = [
				new RolePresentationActions.CloseForm(),
			];
			if (this.isEditMode()) {
				actions.unshift(new RoleDataActions.UpdateItem(roleBody));
			} else {
				actions.unshift(new RoleDataActions.CreateItem(roleBody));
			}
			const action$ = this.store.dispatch(actions);
			await firstValueFrom(action$);

			this.form.enable();
			this.form.updateValueAndValidity();

		}
	}
} 