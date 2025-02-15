import {Component, inject, Input, input, OnInit, viewChildren} from '@angular/core';
import {CurrencyPipe} from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {NgSelectModule} from "@ng-select/ng-select";

import {PrimaryLinkButtonDirective} from "@utility/presentation/directives/button/primary.link.button.directive";
import {InvalidTooltipComponent} from "@utility/presentation/component/invalid-message/invalid-message";
import {DurationVersionHtmlHelper} from "@utility/helper/duration-version.html.helper";
import {
	DurationVersionTypeRangeComponent
} from "@event/presentation/component/form/services/duration-version-type/duration-version-type.range.component";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {DurationVersionTypeEnum} from "@src/core/business-logic/service/enum/duration-version-type.enum";
import {
	SpecialistServiceComponent
} from "@event/presentation/component/form/services/specialist/specialist.service.component";
import {WhacAMoleProvider} from "@utility/presentation/whac-a-mole/whac-a-mole.provider";
import {Reactive} from "@utility/cdk/reactive";
import {RIMember} from "@src/core/business-logic/member";
import {BooleanState} from "@utility/domain";
import {TableState} from "@utility/domain/table.state";
import {
	LanguageVersionOrderControlComponent
} from "@event/presentation/component/form/services/language-version/language-version.order.control.component";
import {LanguageCodeEnum} from "@utility/domain/enum";
import {IServiceDto} from "@src/core/business-logic/order/interface/i.service.dto";
import {
	ModalSelectServiceListRepository
} from "@service/infrastructure/repository/modal-select-service.list.repository";
import {IService} from "@src/core/business-logic/service/interface/i.service";
import {MemberIndexedDBFacade} from "@member/infrastructure/facade/indexedDB/member.indexedDB.facade";

@Component({
	selector: 'event-service-component',
	templateUrl: './services.component.html',
	standalone: true,
	imports: [
		TranslateModule,
		NgSelectModule,
		ReactiveFormsModule,
		PrimaryLinkButtonDirective,
		InvalidTooltipComponent,
		DurationVersionTypeRangeComponent,
		CardComponent,
		SpecialistServiceComponent,
		LanguageVersionOrderControlComponent,
	],
	providers: [
		CurrencyPipe,
		DurationVersionHtmlHelper,
	],
})
export class ServicesComponent extends Reactive implements OnInit {

	@Input({required: true})
	public serviceListControl: FormControl<IServiceDto[]> = new FormControl([] as any);

	public readonly languageControl = input.required<FormControl<LanguageCodeEnum>>();

	public readonly editable = input(true);

	public readonly rememberLastSelectedMember = input(true);

	public readonly setMemberOnlyOnce = input(true);

	public readonly member = input<RIMember>();

	readonly durationVersionTypeRangeComponentList = viewChildren(DurationVersionTypeRangeComponent);

	public readonly durationVersionHtmlHelper = inject(DurationVersionHtmlHelper);
	private readonly whacAMaleProvider = inject(WhacAMoleProvider);
	private readonly modalSelectServiceListRepository = inject(ModalSelectServiceListRepository);
	public readonly loading$ = this.modalSelectServiceListRepository.loading$;
	// private readonly itemMemberApiAdapter = inject(ItemMemberApiAdapter);
	private readonly memberIndexedDBFacade = inject(MemberIndexedDBFacade);
	private readonly memberHasBeenSet = new BooleanState(false);

	private lastSelectedMember: RIMember | undefined;

	public ngOnInit(): void {

		this.initServices().then();

		// if (this.rememberLastSelectedMember) {
		// 	this.serviceListControl.valueChanges.pipe(this.takeUntil()).subscribe((value) => {
		// 		// Check if all services have member if not set the last selected member
		// 		if (value.some((service) => !service?.specialists?.[0]?.member)) {
		// 			if (this.lastSelectedMember) {
		// 				const member = this.lastSelectedMember;
		// 				value.forEach((service) => {
		// 					if (!service?.specialists?.[0]?.member) {
		// 						service.specialists = [{
		// 							object: 'SpecialistDto',
		// 							member,
		// 							wasSelectedAnybody: false,
		// 						}];
		// 					}
		// 				});
		// 				return;
		// 			}
		// 		}
		// 		this.lastSelectedMember = value?.[0]?.specialists?.[0]?.member;
		// 	});
		// }

	}

	public async openModalToSelectService() {

		const {SelectServiceWhacAMoleComponent} = await import("@service/presentation/push-box/select-service.whac-a-mole.component");

		let useTableStateFromStore = true;
		let tableState = new TableState<IServiceDto>().toCache();

		const member = this.lastSelectedMember || this.member();

		if (member) {
			if (!member.assignments.service.full) {
				const memberWithPopulateServices = this.memberIndexedDBFacade.source.findOne({
					_id: member._id
				});
				if (!memberWithPopulateServices) {
					return;
				}
				const items = memberWithPopulateServices.assignments.service.include.map(({service}) => service as unknown as IServiceDto);
				useTableStateFromStore = false;
				tableState = new TableState<IServiceDto>().setItems(items).setTotal(items.length).toCache();
			}
		}

		const pushBoxWrapperComponentRef = await this.whacAMaleProvider.buildItAsync({
			component: SelectServiceWhacAMoleComponent,
			componentInputs: {
				multiple: false,
				selectedServiceList: this.serviceListControl.value,
				useTableStateFromStore,
				tableState
			}
		});

		if (!pushBoxWrapperComponentRef) {
			return;
		}

		const {renderedComponentRef} = pushBoxWrapperComponentRef.instance;

		if (!renderedComponentRef) {
			return;
		}

		const {instance} = renderedComponentRef;

		if (instance instanceof SelectServiceWhacAMoleComponent) {
			instance.selectedServicesListener.pipe(this.takeUntil()).subscribe(async () => {

				let {newSelectedServiceList} = instance;

				newSelectedServiceList = this.setMember(newSelectedServiceList)

				this.serviceListControl.patchValue(newSelectedServiceList);
				await this.whacAMaleProvider.destroyComponent(SelectServiceWhacAMoleComponent);
			});
		}

	}

	public removeServiceFromSelectedList(service: IServiceDto): void {

		const newSelectedSpecialistList = this.serviceListControl.value.filter((value) => value._id !== service._id);

		this.serviceListControl.patchValue(newSelectedSpecialistList);

	}

	public isDurationVersionTypeRange(service: IServiceDto): boolean {
		return service.configuration.duration?.durationVersionType === DurationVersionTypeEnum.RANGE;
	}

	public checkValidationOfDurationVersionTypeRangeComponentList(): boolean {
		return this.durationVersionTypeRangeComponentList().every((component) => component.checkIfSelectedVariantIsValid());
	}

	private async initServices() {

		if (!this.serviceListControl.value.length) {

			this.modalSelectServiceListRepository.resetTableState();
			await this.modalSelectServiceListRepository.getPageAsync();

		}

	}

	/**
	 * Updates the list of services by setting a member to each service's specialists array if not already set.
	 * This method is designed to ensure that each service in the provided list has an associated member.
	 * It operates under the condition that if `setMemberOnlyOnce` is true, a member will only be set once
	 * across all service updates to prevent overriding existing member assignments.
	 *
	 * @param {IService.DTO[]} newSelectedServiceList - The list of services to update with a member.
	 * @returns {IService.DTO[]} The updated list of services with a member set for each service's specialists.
	 */
	private setMember(newSelectedServiceList: IService.DTO[]): IService.DTO[] {
		// Check if a member is available to be set
		const memberValue = this.member();
		if (memberValue) {
			// If setMemberOnlyOnce is true, check if a member has already been set
			if (this.setMemberOnlyOnce()) {
				// If a member has been set, return the list without making changes
				if (this.memberHasBeenSet.isOn) {
					return newSelectedServiceList;
				}
				// Mark that a member has been set to prevent future updates
				this.memberHasBeenSet.switchOn();
			}

			// Assign the member to each service's specialists array
			const member = memberValue;
			newSelectedServiceList = newSelectedServiceList.map((service) => {
				return {
					...service,
					specialists: [{
						object: 'SpecialistDto',
						member,
						wasSelectedAnybody: false,
					}],
				};
			})
		}

		// Return the updated list of services
		return newSelectedServiceList;
	}
}
