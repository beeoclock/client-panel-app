import {Component, inject, input, output} from "@angular/core";
import {Router, RouterLink} from "@angular/router";
import {DropdownComponent} from "@utility/presentation/component/dropdown/dropdown.component";
import {ActiveEnum} from "@utility/domain/enum";
import {NgIf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {Placement} from "@popperjs/core/lib/enums";

@Component({
	selector: 'utility-table-column-action',
	standalone: true,
	imports: [
		RouterLink,
		DropdownComponent,
		NgIf,
		TranslateModule
	],
	template: `
		<utility-dropdown [placement]="placement()" [offsetDistance]="offsetDistance()" [threeDot]="true"
											[id]="'table-row-' + id()">
			<ng-container content>
				<li>
					<button
						type="button"
						(click)="open.emit(id())"
						class="w-full flex gap-4 text-start px-4 py-2 hover:bg-beeColor-100 dark:hover:bg-beeDarkColor-600 dark:hover:text-white">
						<i class="bi bi-eye"></i>
						{{ 'keyword.capitalize.details' | translate }}
					</button>
				</li>
				<li>
					<button
						type="button"
						(click)="edit.emit(id())"
						class="w-full flex gap-4 text-start px-4 py-2 hover:bg-beeColor-100 dark:hover:bg-beeDarkColor-600 dark:hover:text-white">
						<i class="bi bi-pencil"></i>
						{{ 'keyword.capitalize.edit' | translate }}
					</button>
				</li>
				<ng-content/>
				<li>
					<button
						(click)="delete.emit(id())"
						class="w-full flex gap-4 text-start px-4 py-2 hover:bg-beeColor-100 dark:hover:bg-beeDarkColor-600 dark:hover:text-white">
						<i class="bi bi-trash"></i>
						{{ 'keyword.capitalize.delete' | translate }}
					</button>
				</li>
				<li *ngIf="active() === activeEnum.NO">
					<button
						(click)="activate.emit(id())"
						class="w-full flex gap-4 text-start px-4 py-2 hover:bg-beeColor-100 dark:hover:bg-beeDarkColor-600 dark:hover:text-white">
						<i class="bi bi-toggle-on"></i>
						{{ 'keyword.capitalize.activate' | translate }}
					</button>
				</li>
				<li *ngIf="active() === activeEnum.YES">
					<button
						(click)="deactivate.emit(id())"
						class="w-full flex gap-4 text-start px-4 py-2 hover:bg-beeColor-100 dark:hover:bg-beeDarkColor-600 dark:hover:text-white">
						<i class="bi bi-toggle-off"></i>
						{{ 'keyword.capitalize.deactivate' | translate }}
					</button>
				</li>
			</ng-container>
		</utility-dropdown>
	`
})
export class ActionComponent {

	public readonly id = input.required<string>();

	public readonly active = input.required<ActiveEnum>();

	public readonly placement = input<Placement>('auto');

	public readonly offsetDistance = input(26);

	public readonly edit = output<string>();

	public readonly open = output<string>();

	public readonly delete = output<string>();

	public readonly activate = output<string>();

	public readonly deactivate = output<string>();

	public readonly activeEnum = ActiveEnum;

	private readonly router = inject(Router);

	public readonly returnUrl = this.router.url;

}
