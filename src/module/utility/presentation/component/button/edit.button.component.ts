import {ChangeDetectionStrategy, Component, HostBinding, Input, ViewEncapsulation, input} from '@angular/core';
import {NgIf} from '@angular/common';
import {SpinnerComponent} from '@utility/presentation/component/spinner/spinner.component';
import {TranslateModule} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";

@Component({
	selector: 'edit-button-component',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	template: `
		<i class="bi bi-pencil me-2"></i>
		{{ 'keyword.capitalize.edit' | translate }}
	`,
	imports: [
		NgIf,
		SpinnerComponent,
		TranslateModule,
		RouterLink
	]
})
export class EditButtonComponent {

	public readonly link = input<string | string[]>('form');

	@HostBinding('class.w-full')
	@Input()
	public buttonWidthFull = false;

	@HostBinding()
	public class = `
	cursor-pointer
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
        ring-beeColor-300`;

}
