import {Component, input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import ERole from '@tenant/member/roles/domain/entity/e.role';
import {ModulePermissionEnum, PermissionScopeEnum} from '@tenant/member/roles/domain/interface/i.role';
import {PermissionsService} from '@tenant/member/roles/domain/service/permissions.service';
import {RowActionButtonComponent} from '@tenant/member/roles/presentation/component/row-action-button/row-action-button.component';
import {StandardDetailsEntityComponent} from '@shared/presentation/component/entity/standard-details.entity.component';

@Component({
	selector: 'role-details-container',
	standalone: true,
	imports: [
		CommonModule,
		TranslateModule,
		RowActionButtonComponent,
		StandardDetailsEntityComponent
	],
	templateUrl: './role-details-container.component.html'
})
export class RoleDetailsContainerComponent {

	public readonly item = input.required<ERole | undefined>();

	public getPermissionLabel(code: ModulePermissionEnum): string {
		const permission = PermissionsService.getPermissionByCode(code);
		return permission?.label || `role.form.permissions.unknown.${code}`;
	}

	public getPermissionDescription(code: ModulePermissionEnum): string {
		const permission = PermissionsService.getPermissionByCode(code);
		return permission?.description || '';
	}

	public getScopeLabel(scope: PermissionScopeEnum): string {
		return PermissionsService.getScopeLabel(scope);
	}
} 