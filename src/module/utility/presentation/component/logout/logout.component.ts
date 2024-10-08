import {Component, inject, ViewEncapsulation} from '@angular/core';
import {RouterLink} from '@angular/router';
import {TranslateModule} from "@ngx-translate/core";
import {LogoutService} from "@utility/presentation/component/logout/logout.service";
import {IconComponent} from "@src/component/adapter/icon/icon.component";

@Component({
	selector: 'utility-logout-component',
	standalone: true,
	template: `
		<button
			(click)="logout()"
			class="
        text-red-600
        hover:bg-red-100
        focus:ring-4
        focus:outline-none
        focus:ring-red-400
        font-medium
        rounded-lg
        text-sm
        px-4
        py-2.5
        text-center
        inline-flex
        items-center
        dark:bg-blue-600
        dark:hover:bg-blue-700
        dark:focus:ring-blue-800">
        <span class="me-2">
			<app-icon name="bootstrapBoxArrowLeft"/>
        </span>
			{{ 'keyword.capitalize.logout' | translate }}
		</button>
	`,
	imports: [
		RouterLink,
		TranslateModule,
		IconComponent
	],
	encapsulation: ViewEncapsulation.None
})
export class LogoutComponent {
	public readonly logoutService = inject(LogoutService);

	public logout(): void {
		this.logoutService.logout();
	}
}
