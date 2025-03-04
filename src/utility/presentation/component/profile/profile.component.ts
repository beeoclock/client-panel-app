import {Component, ViewEncapsulation} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";


@Component({
	selector: 'utility-profile-component',
	encapsulation: ViewEncapsulation.None,
	standalone: true,
	imports: [
		TranslateModule,
	],
	template: `

		<button
			#dropdownProfileAvatarButton
			id="dropdownAvatarNameButton" data-dropdown-toggle="dropdownAvatarName"
			class="flex items-center font-medium hover:text-blue-600 dark:hover:text-blue-500 focus:ring-4 focus:ring-beeColor-600 dark:focus:ring-beeDarkColor-700 dark:text-white rounded-full bg-beeColor-200 text-2xl leading-none text-beeColor-700"
			type="button">
			<span class="sr-only">Open user menu</span>
			<i class="bi bi-person-circle"></i>
			<!--      <img class="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-3.jpg" alt="user photo">-->
		</button>


	`
})
export class ProfileComponent {

}
