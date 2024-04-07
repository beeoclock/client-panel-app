import {Component, inject, Input, OnInit, QueryList, ViewChildren} from '@angular/core';
import {AsyncPipe, CurrencyPipe, NgForOf, NgIf, NgTemplateOutlet} from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {FormTextareaComponent} from "@utility/presentation/component/input/form.textarea.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {
	ModalSelectServiceService
} from "@utility/presentation/component/modal-select-service/modal-select-service.service";
import {IService} from "@service/domain";
import {ModalSelectServiceListAdapter} from "@service/adapter/external/component/modal-select-service.list.adapter";
import {PrimaryLinkButtonDirective} from "@utility/presentation/directives/button/primary.link.button.directive";
import {HumanizeDurationPipe} from "@utility/presentation/pipes/humanize-duration.pipe";
import {InvalidTooltipComponent} from "@utility/presentation/component/invalid-message/invalid-message";
import {DurationVersionHtmlHelper} from "@utility/helper/duration-version.html.helper";
import {
	DurationVersionTypeRangeComponent
} from "@event/presentation/component/form/services/duration-version-type/duration-version-type.range.component";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {RowActionButtonComponent} from "@service/presentation/component/row-action-button/row-action-button.component";
import {DurationVersionTypeEnum} from "@service/domain/enum/duration-version-type.enum";
import {
	SpecialistServiceComponent
} from "@event/presentation/component/form/services/specialist/specialist.service.component";

@Component({
	selector: 'event-service-component',
	templateUrl: './services.component.html',
	standalone: true,
	imports: [
		NgIf,
		TranslateModule,
		FormInputComponent,
		FormTextareaComponent,
		NgSelectModule,
		ReactiveFormsModule,
		NgForOf,
		CurrencyPipe,
		NgTemplateOutlet,
		PrimaryLinkButtonDirective,
		HumanizeDurationPipe,
		InvalidTooltipComponent,
		DurationVersionTypeRangeComponent,
		AsyncPipe,
		CardComponent,
		RowActionButtonComponent,
		SpecialistServiceComponent,
	],
	providers: [
		CurrencyPipe,
		DurationVersionHtmlHelper,
	],
})
export class ServicesComponent implements OnInit {

	@Input({required: true})
	public serviceListControl: FormControl<IService[]> = new FormControl([] as any);

	@Input()
	public editable = true;

	@ViewChildren(DurationVersionTypeRangeComponent)
	public durationVersionTypeRangeComponentList!: QueryList<DurationVersionTypeRangeComponent>;

	public readonly durationVersionHtmlHelper = inject(DurationVersionHtmlHelper);
	private readonly modalSelectServiceService = inject(ModalSelectServiceService);
	private readonly modalSelectServiceListAdapter = inject(ModalSelectServiceListAdapter);

	public readonly loading$ = this.modalSelectServiceListAdapter.loading$;

	public ngOnInit(): void {

		// this.serviceListControl.valueChanges.subscribe((value) => {
		//
		//   this.modalSelectServiceService.selectedServiceList = value;
		//
		// });

		this.initServices().then(() => {

			// this.modalSelectServiceService.selectedServiceList = this.serviceListControl.value;

		});

	}


	private async initServices() {

		if (!this.serviceListControl.value.length) {

			this.modalSelectServiceListAdapter.resetTableState();
			await this.modalSelectServiceListAdapter.getPageAsync();

		}

	}

	public openModalToSelectService(): void {

		this.modalSelectServiceService.openServiceModal({
			multiSelect: false,
			selectedServiceList: this.serviceListControl.value
		}).then((newSelectedSpecialistList) => {

			this.serviceListControl.patchValue(newSelectedSpecialistList);

		});

	}

	public removeServiceFromSelectedList(service: IService): void {

		const newSelectedSpecialistList = this.serviceListControl.value.filter((value) => value._id !== service._id);

		this.serviceListControl.patchValue(newSelectedSpecialistList);

	}

	public isDurationVersionTypeRange(service: IService): boolean {
		return service.configuration.duration?.durationVersionType === DurationVersionTypeEnum.RANGE;
	}

	public checkValidationOfDurationVersionTypeRangeComponentList(): boolean {
		return this.durationVersionTypeRangeComponentList.toArray().every((component) => component.checkIfSelectedVariantIsValid());
	}

}
