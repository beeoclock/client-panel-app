import {Component, inject, ViewEncapsulation} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {LogoutService} from "@shared/presentation/ui/component/logout/logout.service";

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
          <i class="bi bi-box-arrow-left"></i>
        </span>
			{{ 'keyword.capitalize.logout' | translate }}
		</button>
	`,
	imports: [
		TranslateModule
	],
	encapsulation: ViewEncapsulation.None
})
export class LogoutComponent {
	public readonly logoutService = inject(LogoutService);

	public logout(): void {
		this.logoutService.logout();
	}
}
