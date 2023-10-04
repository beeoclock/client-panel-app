import {Component, ViewEncapsulation} from '@angular/core';
import {RouterLink} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {AsyncPipe, JsonPipe} from "@angular/common";


@Component({
	selector: 'utility-profile-component',
	encapsulation: ViewEncapsulation.None,
	standalone: true,
	imports: [
		RouterLink,
		TranslateModule,
		JsonPipe,
		AsyncPipe
	],
	template: `

		<button
			#dropdownProfileAvatarButton
			id="dropdownAvatarNameButton" data-dropdown-toggle="dropdownAvatarName"
			class="flex items-center text-sm font-medium rounded-full hover:text-blue-600 dark:hover:text-blue-500 focus:ring-4 focus:ring-beeColor-600 dark:focus:ring-beeDarkColor-700 dark:text-white"
			type="button">
			<span class="sr-only">Open user menu</span>
			<div class="w-8 h-8 rounded-full bg-beeColor-200 text-2xl text-beeColor-700">
				<i class="bi bi-person-circle"></i>
			</div>
			<!--      <img class="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-3.jpg" alt="user photo">-->
		</button>


	`
})
export class ProfileComponent {

}
