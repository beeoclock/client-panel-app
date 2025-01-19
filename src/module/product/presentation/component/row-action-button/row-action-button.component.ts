import { Component, inject, input, ViewEncapsulation } from '@angular/core';
import { ActionComponent } from '@utility/presentation/component/table/column/action.component';
import { Store } from '@ngxs/store';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { IProduct } from '@product/domain';

@Component({
	selector: 'product-row-action-button-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	template: `
		<utility-table-column-action
			(delete)="delete()"
			[id]="id()"
		>
		</utility-table-column-action>
	`,
	imports: [ActionComponent, TranslateModule],
})
export class RowActionButtonComponent {
	public readonly id = input.required<string>();

	public readonly item = input.required<IProduct>();

	private readonly store = inject(Store);
	private readonly router = inject(Router);
	public readonly returnUrl = this.router.url;

	public delete(): void {
	}
}
