import {ChangeDetectionStrategy, Component, input, ViewEncapsulation} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";

@Component({
	selector: 'edit-link-component',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	template: `
		<a
			[routerLink]="link()"
			[class.w-full]="buttonWidthFull()"
			class="
        flex
        items-center
        justify-center
        rounded-2xl
        bg-white
        hover:bg-beeColor-50
        dark:bg-beeDarkColor-800
        dark:hover:bg-beeDarkColor-600
        px-4
        py-2
        text-sm
        font-semibold
        text-beeColor-900
        dark:text-beeColor-200
        shadow-sm
        ring-1
        ring-inset
        ring-beeColor-300">
			<i class="bi bi-pencil me-2"></i>
			{{ 'keyword.capitalize.edit' | translate }}
		</a>

	`,
	imports: [
		TranslateModule,
		RouterLink
	]
})
export class EditLinkComponent {

	public readonly link = input<string | string[]>('form');

	public readonly buttonWidthFull = input(false);

}
