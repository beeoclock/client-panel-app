import {Component, input, signal, computed, ViewEncapsulation, OnInit, OnDestroy, inject, effect, ChangeDetectorRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {CardComponent} from '@shared/presentation/component/card/card.component';
import {SwitchComponent} from '@shared/presentation/component/switch/switch.component';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {ModulePermissionEnum, PermissionScopeEnum, IScopedPermission} from '@tenant/member/roles/domain/interface/i.role';
import {PermissionsService, IPermissionGroup, IPermissionItem} from '@tenant/member/roles/domain/service/permissions.service';
import {Subject, takeUntil} from 'rxjs';

@Component({
	selector: 'permissions-manager',
	standalone: true,
	imports: [
		CommonModule,
		TranslateModule,
		CardComponent,
		SwitchComponent,
		ReactiveFormsModule
	],
	templateUrl: './permissions-manager.component.html',
	encapsulation: ViewEncapsulation.None
})
export class PermissionsManagerComponent implements OnInit, OnDestroy {

	private readonly translateService = inject(TranslateService);
	private readonly cdr = inject(ChangeDetectorRef);
	private readonly destroy$ = new Subject<void>();
	private readonly controlCache = new Map<string, FormControl>();

	public readonly permissions = input<IScopedPermission[]>([]);
	public readonly onPermissionsChange = input<(permissions: IScopedPermission[]) => void>(() => {});

	public readonly permissionGroups = signal<IPermissionGroup[]>(PermissionsService.getPermissionGroups());
	public readonly selectedPermissions = signal<IScopedPermission[]>([]);
	public readonly forceUpdate = signal(0);

	constructor() {
		// Effect to sync selectedPermissions with input permissions
		effect(() => {
			const inputPermissions = this.permissions();
			if (inputPermissions && inputPermissions.length > 0) {
				this.selectedPermissions.set([...inputPermissions]);
				this.updateAllControls();
			}
		});
	}

	ngOnInit(): void {
		// Initialize with current permissions
		const inputPermissions = this.permissions();
		if (inputPermissions && inputPermissions.length > 0) {
			this.selectedPermissions.set([...inputPermissions]);
		}
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
		this.controlCache.clear();
	}

	private updateAllControls(): void {
		// Update all existing controls to reflect current state
		this.controlCache.forEach((control, key) => {
			const [codeStr, scopeStr] = key.split('-');
			const code = parseInt(codeStr) as ModulePermissionEnum;
			const scope = scopeStr as PermissionScopeEnum;
			
			const isSelected = this.selectedPermissions().some(p => 
				p.code === code && p.scope === scope
			);
			
			if (control.value !== isSelected) {
				control.setValue(isSelected, { emitEvent: false });
			}
		});
		
		// Force change detection
		this.cdr.detectChanges();
	}

	private forceUpdateControls(): void {
		// Clear cache to force recreation of controls
		this.controlCache.clear();
		// Increment force update signal
		this.forceUpdate.update(value => value + 1);
		// Force change detection
		this.cdr.detectChanges();
	}

	public getPermissionControl(code: ModulePermissionEnum, scope: PermissionScopeEnum): FormControl {
		const key = `${code}-${scope}`;
		
		if (!this.controlCache.has(key)) {
			const isSelected = this.selectedPermissions().some(p => 
				p.code === code && p.scope === scope
			);
			
			const control = new FormControl(isSelected);
			
			// Subscribe to control changes with proper cleanup
			control.valueChanges.pipe(
				takeUntil(this.destroy$)
			).subscribe((value) => {
				if (value !== null && value !== undefined) {
					this.handlePermissionChange(code, scope, value);
				}
			});
			
			this.controlCache.set(key, control);
		}
		
		return this.controlCache.get(key)!;
	}

	private handlePermissionChange(code: ModulePermissionEnum, scope: PermissionScopeEnum, value: boolean): void {
		const currentPermissions = this.selectedPermissions();
		
		if (value) {
			// Add permission
			const exists = currentPermissions.some(p => 
				p.code === code && p.scope === scope
			);
			if (!exists) {
				const newPermission: IScopedPermission = {
					code: code,
					scope: scope
				};
				const newPermissions = [...currentPermissions, newPermission];
				this.selectedPermissions.set(newPermissions);
				
				// Handle CRUD permissions - add child permissions
				this.handleCrudPermissionChange(code, scope, true);
				
				this.onPermissionsChange()(this.selectedPermissions());
			}
		} else {
			// Remove permission
			const newPermissions = currentPermissions.filter(p => 
				!(p.code === code && p.scope === scope)
			);
			this.selectedPermissions.set(newPermissions);
			
			// Handle CRUD permissions - remove child permissions
			this.handleCrudPermissionChange(code, scope, false);
			
			this.onPermissionsChange()(newPermissions);
		}
	}

	private handleCrudPermissionChange(crudCode: ModulePermissionEnum, scope: PermissionScopeEnum, isAdding: boolean): void {
		// Check if this is a CRUD permission
		if (!PermissionsService.isCrudPermission(crudCode)) {
			return;
		}

		const childPermissions = PermissionsService.getChildPermissions(crudCode);
		const currentPermissions = this.selectedPermissions();
		let newPermissions = [...currentPermissions];

		childPermissions.forEach(childCode => {
			const childPermission: IScopedPermission = {
				code: childCode,
				scope: scope
			};

			if (isAdding) {
				// Add child permission if it doesn't exist
				const exists = newPermissions.some(p => 
					p.code === childCode && p.scope === scope
				);
				if (!exists) {
					newPermissions.push(childPermission);
				}
			} else {
				// Remove child permission
				newPermissions = newPermissions.filter(p => 
					!(p.code === childCode && p.scope === scope)
				);
			}
		});

		if (newPermissions.length !== currentPermissions.length) {
			this.selectedPermissions.set(newPermissions);
			this.updateAllControls();
		}
	}

	public isPermissionSelected(permission: IPermissionItem, scope: PermissionScopeEnum): boolean {
		return this.selectedPermissions().some(p => 
			p.code === permission.code && p.scope === scope
		);
	}

	public togglePermission(permission: IPermissionItem, scope: PermissionScopeEnum): void {
		const control = this.getPermissionControl(permission.code, scope);
		const currentValue = control.value;
		control.setValue(!currentValue);
	}

	public getScopeLabel(scope: PermissionScopeEnum): string {
		return PermissionsService.getScopeLabel(scope);
	}

	public isCrudPermission(code: ModulePermissionEnum): boolean {
		return PermissionsService.isCrudPermission(code);
	}

	public trackByPermission(index: number, permission: IPermissionItem): string {
		return `${permission.code}-${this.forceUpdate()}`;
	}

	public trackByScope(index: number, scope: PermissionScopeEnum): string {
		return `${scope}-${this.forceUpdate()}`;
	}

	public trackByGroup(index: number, group: IPermissionGroup): string {
		return `${group.module}-${this.forceUpdate()}`;
	}

	public hasAnyPermissionInGroup(group: IPermissionGroup): boolean {
		return group.permissions.some(permission => 
			permission.scopes.some(scope => 
				this.isPermissionSelected(permission, scope)
			)
		);
	}

	public selectAllInGroup(group: IPermissionGroup): void {
		const currentPermissions = this.selectedPermissions();
		const newPermissions = [...currentPermissions];

		group.permissions.forEach(permission => {
			// Add all scopes for each permission
			permission.scopes.forEach(scope => {
				const exists = newPermissions.some(p => 
					p.code === permission.code && p.scope === scope
				);
				if (!exists) {
					newPermissions.push({
						code: permission.code,
						scope: scope
					});
				}
			});
		});

		this.selectedPermissions.set(newPermissions);
		this.forceUpdateControls();
		this.onPermissionsChange()(newPermissions);
	}

	public clearAllInGroup(group: IPermissionGroup): void {
		const currentPermissions = this.selectedPermissions();
		const newPermissions = currentPermissions.filter(permission => {
			const groupPermission = group.permissions.find(p => p.code === permission.code);
			return !groupPermission; // Keep permissions not in this group
		});

		this.selectedPermissions.set(newPermissions);
		this.forceUpdateControls();
		this.onPermissionsChange()(newPermissions);
	}
} 