import {Component, inject, input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation, computed} from '@angular/core';
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
import ERole from "@tenant/member/roles/domain/entity/e.role";
import {RoleDataActions} from "@tenant/member/roles/infrastructure/state/data/role.data.actions";
import {
	RolePresentationActions
} from "@tenant/member/roles/infrastructure/state/presentation/role.presentation.actions";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {ToastController} from "@ionic/angular/standalone";
import {TranslateService} from "@ngx-translate/core";
import {PermissionsManagerComponent} from "@tenant/member/roles/presentation/component/permissions-manager/permissions-manager.component";
import {IScopedPermission} from "@tenant/member/roles/domain/interface/i.role";

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
		PermissionsManagerComponent,
	],
	standalone: true
})
export class RoleFormContainerComponent implements OnInit, OnChanges {

	private readonly store = inject(Store);
	private readonly sharedUow = inject(SharedUow);
	private readonly toastController = inject(ToastController);
	private readonly translateService = inject(TranslateService);

	public form = new RoleForm();

	public readonly item = input<IRole.EntityRaw | ERole | undefined>();

	public readonly isEditMode = input<boolean>(false);

	// Computed property to determine if this is an existing owner role
	public readonly isExistingOwnerRole = computed(() => {
		const item = this.item();
		return this.isEditMode() && item && (item.isOwner || (item instanceof ERole && item.isOwner));
	});

	// Computed property to determine if isOwner switch should be disabled
	public readonly isOwnerSwitchDisabled = computed(() => {
		return this.isExistingOwnerRole() ?? false;
	});

	// Computed property to check if owner role already exists
	public readonly ownerRoleExists = computed(async () => {
		if (this.isEditMode()) return false;
		const roles = await this.sharedUow.role.repository.findAsync();
		return roles.items?.some((role: IRole.EntityRaw) => role.isOwner) ?? false;
	});

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
			const rawData = item instanceof ERole ? item.toRaw() : item;
			this.form = RoleForm.create(rawData);
			
			// Disable isOwner control for existing owner roles
			if (this.isExistingOwnerRole()) {
				this.form.controls.isOwner.disable();
			}
			
			this.form.updateValueAndValidity();
		}
	}

	public onPermissionsChange = (permissions: IScopedPermission[]) => {
		this.form.controls.permissions.setValue(permissions);
	};

	public async save(): Promise<void> {
		this.form.markAllAsTouched();
		if (this.form.valid) {

			// Check if trying to create a new owner role when one already exists
			if (!this.isEditMode() && this.form.controls.isOwner.value) {
				const roles = await this.sharedUow.role.repository.findAsync();
				const existingOwner = roles.items?.find((role: IRole.EntityRaw) => role.isOwner);
				
				if (existingOwner) {
					const toast = await this.toastController.create({
						message: this.translateService.instant('role.toast.ownerAlreadyExists'),
						color: 'warning',
						duration: 4000,
						position: 'top',
					});
					await toast.present();
					return;
				}
			}

			// Check if trying to modify isOwner status for existing owner role
			if (this.isEditMode() && this.isExistingOwnerRole()) {
				const originalItem = this.item();
				const originalIsOwner = originalItem?.isOwner || (originalItem instanceof ERole && originalItem.isOwner);
				const newIsOwner = this.form.controls.isOwner.value;
				
				if (originalIsOwner !== newIsOwner) {
					const toast = await this.toastController.create({
						message: this.translateService.instant('role.toast.cannotModifyOwner'),
						color: 'warning',
						duration: 4000,
						position: 'top',
					});
					await toast.present();
					return;
				}
			}

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

	public cancel(): void {
		this.store.dispatch(new RolePresentationActions.CloseForm());
	}
}

export default RoleFormContainerComponent; 