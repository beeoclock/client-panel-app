import {
	Component,
	HostBinding,
	inject,
	input,
	ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
	IonButton,
	IonSelect,
	IonSelectOption,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import ObjectID from 'bson-objectid';

@Component({
	selector: 'ion-select-tags',
	standalone: true,
	template: `
		<div class="flex-col">
			<div class="flex items-center mt-2 ml-2">
				<ion-button
					[title]="translations().createTooltip | translate"
					size="small"
					(click)="toggleAddMode()"
				>
					{{ addMode ? ('keyword.capitalize.cancel' | translate)  : '+' }}
				</ion-button>

				@if (addMode) {

					<input
						[(ngModel)]="newOptionLabel"
						type="text"
						[placeholder]="translations().enter | translate"
						class="
							mx-2
							rounded-none
							rounded-l
							border
							shadow-sm
							text-beeColor-900
							focus:ring-blue-500
							focus:border-blue-500
							block
							flex-1
							min-w-0
							w-full
							text-sm
							border-beeColor-300
							py-2
							px-3
							dark:bg-beeDarkColor-700
							dark:border-beeDarkColor-600
							dark:placeholder-beeDarkColor-400
							dark:text-white
							dark:focus:ring-blue-500
							dark:focus:border-blue-500"
					/>

					<ion-button size="small" color="primary" (click)="addOption()">
						{{ 'keyword.capitalize.save' | translate }}
					</ion-button>
				}
			</div>
			<div class="mb-2 ml-2 mt-2">
				@if(options().length) {
					<ion-select
						[formControl]="control()"
						[multiple]="multiple()"
						[placeholder]="translations().choose | translate"
						class="!min-h-0"
						fill="solid"
						class="ion-select-tags-selector"
						interface="popover"
						[title]="tagsTooltip"
					>
						@for(option of options(); track option.id) {
							<ion-select-option [value]="option.value">
								{{ option.label }}
							</ion-select-option>
						}
						
					</ion-select>
				} @else {
					<p class="italic leading-tight p-2 text-beeColor-500 text-sm">
						{{ translations().first | translate }}
					</p>
				}
			</div>
		</div>
	`,
	encapsulation: ViewEncapsulation.None,
	imports: [
		FormsModule,
		ReactiveFormsModule,
		TranslateModule,
		IonSelect,
		IonSelectOption,
		IonButton,
	],
	styles: `
	 	.ion-select-tags-selector {
			max-width: 300px !important;
		}
	
	`
})
export class IonSelectTagsComponent {
	readonly #translateService = inject(TranslateService);
	
	public readonly id = input.required<string>();
	public readonly control = input.required<FormControl>();
	public readonly multiple = input(false);
	public readonly options =
		input.required<{ id: string; value: string; label: string }[]>();

	public readonly translations = input({
		createTooltip: 'keyword.capitalize.category.create.tooltip',
		choose: 'keyword.capitalize.category.create.choose',
		first: 'keyword.capitalize.category.create.first',
		enter: 'keyword.capitalize.category.create.enter',
	});

	public addMode = false;
	public newOptionLabel = '';

	@HostBinding()
	public class = 'flex items-center';

	get tagsTooltip() {
		return (this.options() || []).map(x => x.value).join(', ')
	}

	public toggleAddMode(): void {
		this.addMode = !this.addMode;
		if (!this.addMode) {
			this.resetInput();
		}
	}

	public addOption(): void {
		const newLabel = this.newOptionLabel.trim();
        const isDuplicate = this.options().some(option => option.value.toLowerCase() === newLabel.toLowerCase());
        if (isDuplicate) {
			alert(this.#translateService.instant('keyword.capitalize.category.create.uniqueError'));
            return;
        }
		if (newLabel) {
			this.options().push({
				id: ObjectID().toHexString(), 
				value: newLabel,
				label: newLabel,
			});

			const currentTags = this.control().value ?? [];

			this.control().patchValue([...currentTags, newLabel]);

			this.control().updateValueAndValidity();

			this.resetInput();
			this.closeInput();
		}
	}

	private resetInput(): void {
		this.newOptionLabel = '';
	}

	private closeInput(): void {
		this.addMode = false;
	}

	public removeOption(index: number): void {
		this.options().splice(index, 1);
	}
}
