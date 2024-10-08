import {Component, EventEmitter, inject, Input, Output} from "@angular/core";
import {Router, RouterLink} from "@angular/router";
import {DropdownComponent} from "@utility/presentation/component/dropdown/dropdown.component";
import {ActiveEnum} from "@utility/domain/enum";
import {NgIf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {Placement} from "@popperjs/core/lib/enums";
import {IconComponent} from "@src/component/adapter/icon/icon.component";

@Component({
	selector: 'utility-table-column-action',
	standalone: true,
	imports: [
		RouterLink,
		DropdownComponent,
		NgIf,
		TranslateModule,
		IconComponent
	],
	template: `
		<utility-dropdown [placement]="placement" [offsetDistance]="offsetDistance" [threeDot]="true"
						  [id]="'table-row-' + id">
			<ng-container content>
				<li>
					<button
						type="button"
						(click)="open.emit(id)"
						class="w-full flex gap-4 text-start px-4 py-2 hover:bg-beeColor-100 dark:hover:bg-beeDarkColor-600 dark:hover:text-white">
						<app-icon name="bootstrapEye"/>
						{{ 'keyword.capitalize.details' | translate }}
					</button>
				</li>
				<li>
					<button
						type="button"
						(click)="edit.emit(id)"
						class="w-full flex gap-4 text-start px-4 py-2 hover:bg-beeColor-100 dark:hover:bg-beeDarkColor-600 dark:hover:text-white">
						<app-icon name="bootstrapPencil"/>
						{{ 'keyword.capitalize.edit' | translate }}
					</button>
				</li>
				<ng-content/>
				<li>
					<button
						(click)="delete.emit(id)"
						class="w-full flex gap-4 text-start px-4 py-2 hover:bg-beeColor-100 dark:hover:bg-beeDarkColor-600 dark:hover:text-white">
						<app-icon name="bootstrapTrash"/>
						{{ 'keyword.capitalize.delete' | translate }}
					</button>
				</li>
				@if (active === activeEnum.NO) {
					<li>
						<button
							(click)="activate.emit(id)"
							class="w-full flex gap-4 text-start px-4 py-2 hover:bg-beeColor-100 dark:hover:bg-beeDarkColor-600 dark:hover:text-white">
							<app-icon name="bootstrapToggleOn"/>
							{{ 'keyword.capitalize.activate' | translate }}
						</button>
					</li>
				}
				@if (active === activeEnum.YES) {
					<li>
						<button
							(click)="deactivate.emit(id)"
							class="w-full flex gap-4 text-start px-4 py-2 hover:bg-beeColor-100 dark:hover:bg-beeDarkColor-600 dark:hover:text-white">
							<app-icon name="bootstrapToggleOff"/>
							{{ 'keyword.capitalize.deactivate' | translate }}
						</button>
					</li>
				}
			</ng-container>
		</utility-dropdown>
	`
})
export class ActionComponent {

	@Input()
	public id!: string;

	@Input()
	public active!: ActiveEnum;

	@Input()
	public placement: Placement = 'auto';

	@Input()
	public offsetDistance = 26;

	@Output()
	public readonly edit = new EventEmitter<string>();

	@Output()
	public readonly open = new EventEmitter<string>();

	@Output()
	public readonly delete = new EventEmitter<string>();

	@Output()
	public readonly activate = new EventEmitter<string>();

	@Output()
	public readonly deactivate = new EventEmitter<string>();

	public readonly activeEnum = ActiveEnum;

	private readonly router = inject(Router);

	public readonly returnUrl = this.router.url;

}
