import {Component, EventEmitter, inject, Input, OnDestroy, Output, ViewEncapsulation} from "@angular/core";
import {NgForOf, NgIf} from "@angular/common";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DeleteButtonComponent} from "@utility/presentation/component/button/delete.button.component";
import {DropdownComponent} from "@utility/presentation/component/dropdown/dropdown.component";
import {EditLinkComponent} from "@utility/presentation/component/link/edit.link.component";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {LinkButtonDirective} from "@utility/presentation/directives/button/link.button.directive";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {IonicModule} from "@ionic/angular";
import {Reactive} from "@utility/cdk/reactive";
import {is} from "thiis";
import {filter} from "rxjs";
import {MS_ONE_SECOND} from "@utility/domain/const/c.time";

@Component({
	selector: 'utility-auto-refresh-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	template: `

		<form>
			<div class="flex">
				<ion-select
					[formControl]="control"
					labelPlacement="start"
					class="px-4 py-2 border border-beeColor-300 shadow-sm rounded-2xl rounded-r-none !min-h-0"
					fill="solid"
					interface="popover">
					<ion-select-option [disabled]="true">
						{{ 'autoRefresh.hint.selectTime' | translate }}
					</ion-select-option>
					<ion-select-option
						*ngFor="let status of options"
						[value]="status.value">
						{{ status.label }}
					</ion-select-option>
				</ion-select>
				<button
					(click)="emitter.emit()"
					type="submit"
					link
					class="rounded-l-none border border-l-0 p-2 h-full text-sm border-beeColor-300 shadow-sm">
					<i [class.animate-spin]="isLoading" class="bi bi-arrow-clockwise"></i>
				</button>
			</div>
		</form>

	`,
	imports: [
		NgIf,
		FormsModule,
		DeleteButtonComponent,
		DropdownComponent,
		EditLinkComponent,
		PrimaryButtonDirective,
		LinkButtonDirective,
		TranslateModule,
		IonicModule,
		NgForOf,
		ReactiveFormsModule
	]
})
export class AutoRefreshComponent extends Reactive implements OnDestroy {

	@Input()
	public isLoading = false;

	@Output()
	public readonly emitter: EventEmitter<void> = new EventEmitter<void>();

	public readonly control = new FormControl(0);

	private readonly translateService = inject(TranslateService);

	public readonly options = [
		{
			label: this.translateService.instant('autoRefresh.time.off'),
			value: 0,
		},
		{
			label: '5 ' + this.translateService.instant('keyword.lowercase.sec'),
			value: 5,
		},
		{
			label: '10 ' + this.translateService.instant('keyword.lowercase.sec'),
			value: 10,
		},
		{
			label: '15 ' + this.translateService.instant('keyword.lowercase.sec'),
			value: 15,
		},
		{
			label: '30 ' + this.translateService.instant('keyword.lowercase.sec'),
			value: 30,
		},
		{
			label: '1 ' + this.translateService.instant('keyword.lowercase.min'),
			value: 60,
		}
	];

	private timer: NodeJS.Timeout | undefined;

	constructor() {
		super();
		this.control.valueChanges.pipe(this.takeUntil(), filter(is.number)).subscribe((value) => {
			this.initTimer(value);
		});
	}

	public initTimer(seconds: number) {
		if (this.timer) {
			clearInterval(this.timer);
		}

		const timeout = seconds * MS_ONE_SECOND;

		if (timeout <= MS_ONE_SECOND) {
			return;
		}

		this.timer = setTimeout(() => {
			this.emitter.emit();
			this.initTimer(seconds);
		}, timeout);

	}

	public override ngOnDestroy() {
		super.ngOnDestroy();
		clearInterval(this.timer);
	}

}
