import {Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output, ViewEncapsulation} from "@angular/core";
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
import {is} from "@utility/checker";
import {filter} from "rxjs";
import {MS_ONE_SECOND} from "@utility/domain/const/c.time";
import {AutoRefreshStorageService} from "@utility/presentation/component/auto-refresh/auto-refresh.storage.service";
import {VisibilityService} from "@utility/cdk/visibility.service";
import {AnalyticsService} from "@utility/cdk/analytics.service";

enum AutoRefreshTime {
	OFF = 0,
	// FIVE_SEC = 5,
	// TEN_SEC = 10,
	// FIFTEEN_SEC = 15,
	// THIRTY_SEC = 30,
	ONE_MIN = 60,
	TWO_MIN = 120,
	FIVE_MIN = 300,
}

const allowedAutoRefreshTimes = [
	AutoRefreshTime.OFF,
	// AutoRefreshTime.FIVE_SEC,
	// AutoRefreshTime.TEN_SEC,
	// AutoRefreshTime.FIFTEEN_SEC,
	// AutoRefreshTime.THIRTY_SEC,
	AutoRefreshTime.ONE_MIN,
	AutoRefreshTime.TWO_MIN,
	AutoRefreshTime.FIVE_MIN,
];

@Component({
	selector: 'utility-auto-refresh-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	template: `
		<form class="h-full">
			<div class="flex h-full">
				<ion-select
					[formControl]="control"
					labelPlacement="start"
					class="px-4 py-3 border border-beeColor-300 shadow-sm rounded-2xl rounded-r-none !min-h-0 flex items-center"
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
					class="rounded-l-none border border-l-0 !p-3 h-full text-sm border-beeColor-300 shadow-sm">
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
export class AutoRefreshComponent extends Reactive implements OnDestroy, OnInit {

	@Input()
	public id = '@default';

	@Input()
	public isLoading = false;

	@Output()
	public readonly emitter: EventEmitter<void> = new EventEmitter<void>();

	public readonly control = new FormControl(60, {
		nonNullable: true,
	});

	private readonly analyticsService = inject(AnalyticsService);
	private readonly visibilityService = inject(VisibilityService);
	private readonly translateService = inject(TranslateService);
	private readonly autoRefreshStorageService = inject(AutoRefreshStorageService);

	public readonly options = [
		{
			label: this.translateService.instant('autoRefresh.time.off'),
			value: AutoRefreshTime.OFF,
		},
		// {
		// 	label: '5 ' + this.translateService.instant('keyword.lowercase.sec'),
		// 	value: 5,
		// },
		// {
		// 	label: '10 ' + this.translateService.instant('keyword.lowercase.sec'),
		// 	value: 10,
		// },
		// {
		// 	label: '15 ' + this.translateService.instant('keyword.lowercase.sec'),
		// 	value: 15,
		// },
		// {
		// 	label: '30 ' + this.translateService.instant('keyword.lowercase.sec'),
		// 	value: 30,
		// },
		{
			label: '1 ' + this.translateService.instant('keyword.lowercase.min'),
			value: AutoRefreshTime.ONE_MIN,
		},
		{
			label: '2 ' + this.translateService.instant('keyword.lowercase.min'),
			value: AutoRefreshTime.TWO_MIN,
		},
		{
			label: '5 ' + this.translateService.instant('keyword.lowercase.min'),
			value: AutoRefreshTime.FIVE_MIN,
		}
	];

	private timer: NodeJS.Timeout | undefined;

	public ngOnInit() {

		this.control.valueChanges.pipe(this.takeUntil(), filter(is.number)).subscribe((value) => {
			this.autoRefreshStorageService.set(this.id, value.toString());
			this.initTimer(value);
		});

		this.init();

	}

	public init() {
		const value = this.autoRefreshStorageService.get(this.id);
		if (is.string(value)) {
			if (!allowedAutoRefreshTimes.includes(Number(value))) {
				this.autoRefreshStorageService.remove(this.id);
				this.control.setValue(AutoRefreshTime.ONE_MIN);
				return;
			}
			this.control.setValue(Number(value));
		} else {
			this.initTimer(this.control.value);
		}
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
			if (this.visibilityService.visibilityChange.value && !this.isLoading) {
				this.emitter.emit();
				this.analyticsService.logEvent('auto_refresh_component_emit', {
					id: this.id,
					seconds,
				});
			}
			this.initTimer(seconds);
		}, timeout);

	}

	public override ngOnDestroy() {
		super.ngOnDestroy();
		clearInterval(this.timer);
	}

}
