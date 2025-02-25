import {AfterViewInit, Component, forwardRef, HostBinding, inject, Injector, input} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, NgControl, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {IconComponent} from "@src/component/adapter/icon/icon.component";
import {is} from "@src/core/shared/checker";

@Component({
	selector: 'utility-search-input-component',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		TranslateModule,
		IconComponent
	],
	template: `
		<div class="flex items-center h-full">
			<label [for]="id" class="sr-only">
				{{ 'keyword.capitalize.search' | translate }}
			</label>

			<div class="flex rounded-2xl w-full">
				<input
					type="text"
					(keydown)="keydown($event)"
					[id]="id"
					[placeholder]="placeholder()"
					[formControl]="control"
					class="py-3 px-4 block w-full border-gray-200 rounded-s-2xl text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600">
				@if (control.value.length > 0) {
					<button
						(click)="clear()"
						role="button"
						type="button"
						class="bg-white border border-l-0 disabled:opacity-50 disabled:pointer-events-none font-semibold gap-x-2 h-[48px] hover:bg-blue-700 hover:border-blue-600 hover:text-white inline-flex items-center justify-center shrink-0 transition-all w-[48px]">
						<app-icon name="bootstrapXLg"/>
					</button>
				}
				<button
					(click)="submit()"
					role="button"
					type="button"
					class="bg-white border border-l-0 disabled:opacity-50 disabled:pointer-events-none font-semibold gap-x-2 h-[48px] hover:bg-blue-700 hover:border-blue-600 hover:text-white inline-flex items-center justify-center rounded-e-2xl shrink-0 transition-all w-[48px]">
					<app-icon name="bootstrapSearch"/>
				</button>
			</div>
		</div>
	`,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => SearchInputComponent),
			multi: true,
		}
	]
})
export class SearchInputComponent implements ControlValueAccessor, AfterViewInit {

	public onChanged: (value: string) => void = () => {
	};
	public onTouched: () => void = () => {
	};

	public registerOnChange(fn: (value: string) => void) {
		this.onChanged = fn;
	}

	public registerOnTouched(fn: () => void) {
		this.onTouched = fn;
	}

	public writeValue(value: unknown): void {

		if (is.string(value)) {

			this.control.setValue(value);

		} else {

			this.control.setValue('');

		}

	}

	public setDisabledState?(isDisabled: boolean): void {

		if (isDisabled) {

			this.control.disable();

		} else {

			this.control.enable();

		}

	}

	public readonly control: FormControl = new FormControl();

	public readonly translateService = inject(TranslateService);
	private readonly injector = inject(Injector);

	public ngControl!: NgControl;

	public readonly placeholder = input(this.translateService.instant('keyword.capitalize.placeholder.search'));

	@HostBinding()
	public id = 'search-input-component';

	@HostBinding()
	public class = 'w-full';

	public ngAfterViewInit() {
		this.ngControl = this.injector.get(NgControl);
	}

	public submit() {
		this.onChanged(
			this.control.value
		);
	}

	public keydown($event: KeyboardEvent) {
		if ($event.key === 'Enter') {
			this.submit();
		}
	}

	public clear() {
		this.control.setValue('');
		if (this.ngControl.control?.value?.length) {
			this.submit();
		}
	}

}
