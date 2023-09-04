import {Component, HostBinding, Input} from "@angular/core";
import {NgIf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";

@Component({
	selector: 'utility-placeholder-image-component',
	standalone: true,
	imports: [
		NgIf,
		TranslateModule
	],
	template: `
			<svg class="w-8 h-8 mb-4 dark:text-beeColor-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
				<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
			</svg>
			<p *ngIf="labelOfDragAndDropZone.classList.contains('fileover')" class="mb-2 text-sm dark:text-beeColor-400 font-bold">
				{{ 'client.profile.form.section.coverImage.fileover' | translate }}
			</p>
			<ng-container *ngIf="!labelOfDragAndDropZone.classList.contains('fileover')">
				<p class="mb-2 text-sm dark:text-beeColor-400 text-center">
					<span class="font-semibold">
						{{ 'keyword.capitalize.clickToUpload' | translate }}
					</span>
					{{ 'keyword.lowercase.or' | translate }} {{ 'keyword.lowercase.dragAndDrop' | translate }}
				</p>
				<p class="text-xs dark:text-beeColor-400">SVG, PNG, JPG {{ 'keyword.lowercase.or' | translate }} GIF</p>
			</ng-container>
	`
})
export class PlaceholderImageComponent {

	@Input()
	public labelOfDragAndDropZone!: HTMLElement;

	@HostBinding()
	public class = 'absolute flex flex-col items-center justify-center h-full w-full pt-5 pb-6 z-20 bg-beeColor-50/25 px-4 rounded-xl text-beeColor-900';

}
