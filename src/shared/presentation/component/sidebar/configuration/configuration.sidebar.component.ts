import {
	afterNextRender,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	inject,
	ViewEncapsulation
} from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {WithTenantIdPipe} from "@shared/presentation/pipes/with-tenant-id.pipe";
import {SidebarService} from "@shared/presentation/component/sidebar/sidebar.service";
import {IMenuItem} from "@shared/presentation/component/sidebar/i.menu-item";


@Component({
	standalone: true,
	selector: 'utility-sidebar-configuration-component',
	templateUrl: './configuration.sidebar.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		RouterLink,
		TranslateModule,
		WithTenantIdPipe,
		RouterLinkActive
	],
})
export class ConfigurationSidebarComponent {

	private readonly sidebarService = inject(SidebarService);
	private readonly changeDetectorRef = inject(ChangeDetectorRef);

	public detectAutoClose() {
		this.sidebarService.detectAutoClose();
	}

	public constructor() {
		afterNextRender(() => {
			this.initMenu();
			this.changeDetectorRef.detectChanges();
		})
	}

	public readonly menu: IMenuItem[] = [];

	public initMenu(): void {

		this.menu.length = 0;

		this.menu.push({
			order: 0,
			url: 'product-tag/list',
			translateKey: 'sidebar.product-tag',
			visible: true,
			icon: 'bi bi-tags',
			routerLinkActiveOptions: {
				paths: "subset",
				matrixParams: "ignored",
				queryParams: "ignored",
				fragment: "ignored",
			}
		});
		this.menu.push({
			order: 0,
			url: 'expense-category/list',
			translateKey: 'sidebar.expense-category',
			visible: true,
			icon: 'bi bi-tags',
			routerLinkActiveOptions: {
				paths: "subset",
				matrixParams: "ignored",
				queryParams: "ignored",
				fragment: "ignored",
			}
		});
		this.menu.push({
			order: 1,
			url: 'client/business-settings',
			translateKey: 'sidebar.businessSettings',
			icon: 'bi bi-building-gear',
			visible: true,
			routerLinkActiveOptions: {
				paths: "subset",
				matrixParams: "ignored",
				queryParams: "ignored",
				fragment: "ignored",
			}
		});
		this.menu.push({
			order: 2,
			url: 'tariff-plan/overview',
			translateKey: 'sidebar.tariffPlan',
			icon: 'bi bi-building-up',
			visible: true,
			routerLinkActiveOptions: {
				paths: "subset",
				matrixParams: "ignored",
				queryParams: "ignored",
				fragment: "ignored",
			}
		});
		this.menu.push({
			order: 3,
			url: 'balance/overview',
			translateKey: 'sidebar.balance',
			icon: 'bi bi-piggy-bank',
			visible: true,
			routerLinkActiveOptions: {
				paths: "subset",
				matrixParams: "ignored",
				queryParams: "ignored",
				fragment: "ignored",
			}
		});

		this.updateMenu();

	}

	private updateMenu(): void {
		this.menu.sort((a, b) => a.order - b.order);
	}

}
