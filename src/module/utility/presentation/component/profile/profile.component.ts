import {Component, ViewEncapsulation} from '@angular/core';
import {RouterLink} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {AsyncPipe, JsonPipe} from "@angular/common";
import {IconComponent} from "@src/component/adapter/icon/icon.component";


@Component({
	selector: 'utility-profile-component',
	encapsulation: ViewEncapsulation.None,
	standalone: true,
	imports: [
		RouterLink,
		TranslateModule,
		JsonPipe,
		AsyncPipe,
		IconComponent
	],
	template: `

		<button
			#dropdownProfileAvatarButton
			id="dropdownAvatarNameButton" data-dropdown-toggle="dropdownAvatarName"
			class="flex items-center text-sm font-medium rounded-full hover:text-blue-600 dark:hover:text-blue-500 focus:ring-4 focus:ring-beeColor-600 dark:focus:ring-beeDarkColor-700 dark:text-white"
			type="button">
			<span class="sr-only">Open user menu</span>
			<div
				class="w-8 h-8 rounded-full bg-beeColor-200 text-2xl text-beeColor-700 flex items-center justify-center">
				<app-icon name="bootstrapPersonCircle"/>
			</div>
		</button>


	`
})
export class ProfileComponent {

}
