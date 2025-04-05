import {ChangeDetectionStrategy, Component, inject, input, OnInit, signal, ViewEncapsulation} from "@angular/core";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {IonLabel, IonSelect, IonSelectOption} from "@ionic/angular/standalone";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {IService} from "@tenant/service/domain/interface/i.service";

@Component({
	selector: 'ion-select-service',
	standalone: true,
	template: `
		<ion-select
			[formControl]="control()"
			[multiple]="multiple()"
			[placeholder]="'keyword.capitalize.allServices' | translate"
			class="!min-h-0 px-4 py-3 border border-beeColor-300 rounded-2xl h-full"
			fill="solid"
			interface="popover">
			@for (service of services(); track service._id) {
				<ion-select-option [value]="service._id">
					<ion-label>{{ service.languageVersions[0].title }}</ion-label>
				</ion-select-option>
			}
		</ion-select>
	`,
	encapsulation: ViewEncapsulation.None,
	imports: [
		NgSelectModule,
		ReactiveFormsModule,
		TranslateModule,
		IonSelect,
		IonSelectOption,
		IonLabel,
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class IonSelectServiceComponent implements OnInit {

	public readonly multiple = input(true);

	public readonly id = input('');

	public readonly control = input(new FormControl());

	private readonly sharedUow = inject(SharedUow);

	public readonly services = signal<IService.DTO[]>([]);

	public ngOnInit() {
		this.sharedUow.service.repository.findAsync({
			page: 1,
			pageSize: 100,
		}).then((response) => {
			this.services.set(response.items);
		})
	}


}
