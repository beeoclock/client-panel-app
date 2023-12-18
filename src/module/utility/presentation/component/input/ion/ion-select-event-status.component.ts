import {ChangeDetectionStrategy, Component, inject, Input, OnInit, ViewEncapsulation} from "@angular/core";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {DefaultLabelDirective} from "@utility/presentation/directives/label/default.label.directive";
import {IonicModule} from "@ionic/angular";
import {NgForOf} from "@angular/common";
import {EventStatusEnum} from "@utility/domain/enum/event-status.enum";

@Component({
	selector: 'ion-select-event-status',
	standalone: true,
	template: `
		<ion-select
			[formControl]="control"
			[multiple]="multiple"
			class="!min-h-0"
			fill="solid"
			interface="popover">
			<ion-select-option
				*ngFor="let status of eventStatusList"
				[value]="status.id">
				{{ status.label }}
			</ion-select-option>
		</ion-select>
	`,
	encapsulation: ViewEncapsulation.None,
	imports: [
		NgSelectModule,
		ReactiveFormsModule,
		TranslateModule,
		DefaultLabelDirective,
		IonicModule,
		NgForOf
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class IonSelectEventStatusComponent implements OnInit {

	@Input()
	public id = '';

	@Input()
	public control = new FormControl();

	@Input()
	public ignoreStatusList: EventStatusEnum[] = [];

	@Input()
	public multiple = false;

	@Input()
	public addAllOption = true;

	private readonly translateService = inject(TranslateService);

	public readonly eventStatusList: {id: string; label: string;}[] = [];

	public ngOnInit(): void {
		this.initEventStatusList();
		this.initAllOption();
	}

	private initEventStatusList() {
		Object.keys(EventStatusEnum)
			.filter((status) => {
				return !this.ignoreStatusList.includes(status as EventStatusEnum);
			}).forEach((status) => {
			this.eventStatusList.push({
				id: status,
				label: this.translateService.instant(`event.keyword.status.plural.${status}`)
			});
		});
	}

	private initAllOption() {
		if (!this.addAllOption) {
			return;
		}
		this.eventStatusList.unshift({
			id: '',
			label: this.translateService.instant('event.keyword.status.all')
		});
	}
}
