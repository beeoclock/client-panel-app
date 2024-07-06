import {Component, inject, Input, OnInit, QueryList, ViewChildren} from '@angular/core';
import {AsyncPipe, CurrencyPipe, NgForOf, NgIf, NgTemplateOutlet} from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {FormTextareaComponent} from "@utility/presentation/component/input/form.textarea.component";
import {NgSelectModule} from "@ng-select/ng-select";
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
import {WhacAMoleProvider} from "@utility/presentation/whac-a-mole/whac-a-mole.provider";
import {Reactive} from "@utility/cdk/reactive";
import {RIMember} from "@member/domain";
import {BooleanState} from "@utility/domain";
import {TableState} from "@utility/domain/table.state";
import {ItemMemberApiAdapter} from "@member/adapter/external/api/item.member.api.adapter";
import {
	LanguageVersionOrderControlComponent
} from "@event/presentation/component/form/services/language-version/language-version.order.control.component";

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
		LanguageVersionOrderControlComponent,
	],
	providers: [
		CurrencyPipe,
		DurationVersionHtmlHelper,
	],
})
export class ServicesComponent extends Reactive implements OnInit {

	@Input({required: true})
	public serviceListControl: FormControl<IService[]> = new FormControl([] as any);

	@Input()
	public editable = true;

	@Input()
	public rememberLastSelectedMember = true;

	@Input()
	public setMemberOnlyOnce = true;

	@Input()
	public member: RIMember | undefined;

	@ViewChildren(DurationVersionTypeRangeComponent)
	public durationVersionTypeRangeComponentList!: QueryList<DurationVersionTypeRangeComponent>;

	public readonly durationVersionHtmlHelper = inject(DurationVersionHtmlHelper);
	private readonly whacAMaleProvider = inject(WhacAMoleProvider);
	private readonly modalSelectServiceListAdapter = inject(ModalSelectServiceListAdapter);
	private readonly itemMemberApiAdapter = inject(ItemMemberApiAdapter);

	public readonly loading$ = this.modalSelectServiceListAdapter.loading$;

	private readonly memberHasBeenSet = new BooleanState(false);

	private lastSelectedMember: RIMember | undefined;

	public ngOnInit(): void {

		this.initServices().then();

		if (this.rememberLastSelectedMember) {
			this.serviceListControl.valueChanges.pipe(this.takeUntil()).subscribe((value) => {
				// Check if all services have member if not set the last selected member
				if (value.some((service) => !service?.specialists?.[0]?.member)) {
					if (this.lastSelectedMember) {
						const member = this.lastSelectedMember;
						value.forEach((service) => {
							if (!service?.specialists?.[0]?.member) {
								service.specialists = [{
									object: 'SpecialistDto',
									member,
									wasSelectedAnybody: false,
								}];
							}
						});
						return;
					}
				}
				this.lastSelectedMember = value?.[0]?.specialists?.[0]?.member;
			});
		}

	}


	private async initServices() {

		if (!this.serviceListControl.value.length) {

			this.modalSelectServiceListAdapter.resetTableState();
			await this.modalSelectServiceListAdapter.getPageAsync();

		}

	}

	public async openModalToSelectService() {

		const {SelectServicePushBoxComponent} = await import("@service/presentation/push-box/select-service.push-box.component");

		let useTableStateFromStore = true;
		let tableState = new TableState<IService>().toCache();

		const member = this.lastSelectedMember || this.member;

		if (member) {
			if (!member.assignments.service.full) {
				const memberWithPopulateServices = await this.itemMemberApiAdapter.executeAsync(member._id);
				const items = memberWithPopulateServices.assignments.service.include.map(({service}) => service as unknown as IService);
				useTableStateFromStore = false;
				tableState = new TableState<IService>().setItems(items).setTotal(items.length).toCache();
			}
		}

		const pushBoxWrapperComponentRef = await this.whacAMaleProvider.buildItAsync({
			component: SelectServicePushBoxComponent,
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

		if (instance instanceof SelectServicePushBoxComponent) {
			instance.selectedServicesListener.pipe(this.takeUntil()).subscribe(async () => {

				let {newSelectedServiceList} = instance;

				newSelectedServiceList = this.setMember(newSelectedServiceList)

				this.serviceListControl.patchValue(newSelectedServiceList);
				await this.whacAMaleProvider.destroyComponent(SelectServicePushBoxComponent);
			});
		}

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

	/**
	 * Updates the list of services by setting a member to each service's specialists array if not already set.
	 * This method is designed to ensure that each service in the provided list has an associated member.
	 * It operates under the condition that if `setMemberOnlyOnce` is true, a member will only be set once
	 * across all service updates to prevent overriding existing member assignments.
	 *
	 * @param {IService[]} newSelectedServiceList - The list of services to update with a member.
	 * @returns {IService[]} The updated list of services with a member set for each service's specialists.
	 */
	private setMember(newSelectedServiceList: IService[]): IService[] {
		// Check if a member is available to be set
		if (this.member) {
			// If setMemberOnlyOnce is true, check if a member has already been set
			if (this.setMemberOnlyOnce) {
				// If a member has been set, return the list without making changes
				if (this.memberHasBeenSet.isOn) {
					return newSelectedServiceList;
				}
				// Mark that a member has been set to prevent future updates
				this.memberHasBeenSet.switchOn();
			}

			// Assign the member to each service's specialists array
			const member = this.member;
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
