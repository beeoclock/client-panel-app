import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core';
import {NgIf} from '@angular/common';
import {SpinnerComponent} from '@utility/presentation/component/spinner/spinner.component';
import {TranslateModule} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";
import {IconComponent} from "@src/component/adapter/icon/icon.component";

@Component({
	selector: 'edit-link-component',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	template: `
		<a
			[routerLink]="link"
			[class.w-full]="buttonWidthFull"
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
			<app-icon name="bootstrapPencil" class="me-2"/>
			{{ 'keyword.capitalize.edit' | translate }}
		</a>

	`,
	imports: [
		NgIf,
		SpinnerComponent,
		TranslateModule,
		RouterLink,
		IconComponent
	]
})
export class EditLinkComponent {

	@Input()
	public link: string | string[] = 'form';

	@Input()
	public buttonWidthFull = false;

}
