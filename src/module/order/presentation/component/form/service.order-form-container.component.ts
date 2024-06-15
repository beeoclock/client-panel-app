import {Component, inject, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {DatetimeLocalInputComponent} from "@utility/presentation/component/input/datetime-local.input.component";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {FormTextareaComponent} from "@utility/presentation/component/input/form.textarea.component";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {
	FormBusinessProfileComponent
} from "@client/presentation/component/business-profile/form-business-profile.component";
import {SwitchComponent} from "@utility/presentation/component/switch/switch.component";
import {
	ButtonSaveContainerComponent
} from "@utility/presentation/component/container/button-save/button-save.container.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {NGXLogger} from "ngx-logger";
import {CurrencyPipe, DatePipe, NgForOf, NgIf} from "@angular/common";
import {NgSelectModule} from "@ng-select/ng-select";
import {DefaultLabelDirective} from "@utility/presentation/directives/label/default.label.directive";
import {OrderForm} from "@order/presentation/form/order.form";
import {PrimaryLinkButtonDirective} from "@utility/presentation/directives/button/primary.link.button.directive";
import {WhacAMoleProvider} from "@utility/presentation/whac-a-mole/whac-a-mole.provider";
import {ContainerFormComponent} from '@event/presentation/component/form/container.form.component';
import {IEvent} from "@event/domain";
import {ActiveEnum} from "@utility/domain/enum";
import {ReservationTypeEnum} from "@order/domain/enum/reservation.type.enum";
import {IServiceDto} from "@order/external/interface/i.service.dto";
import {HumanizeDurationPipe} from "@utility/presentation/pipes/humanize-duration.pipe";
import {ActionComponent} from "@utility/presentation/component/table/column/action.component";
import {
	AttendeeCardComponent
} from "@event/presentation/component/requsted/list-of-card-collection-by-date/attendee-card/attendee.card.component";
import {
	ChangeStatusOnAcceptedComponent
} from "@event/presentation/component/change-status/change-status-on-accepted.component";
import {
	ChangeStatusOnRejectedComponent
} from "@event/presentation/component/change-status/change-status-on-rejected.component";
import {EventStatusStyleDirective} from "@event/presentation/directive/event-status-style/event-status-style.directive";
import {NoDataPipe} from "@utility/presentation/pipes/no-data.pipe";
import {DurationVersionHtmlHelper} from "@utility/helper/duration-version.html.helper";
import {LinkButtonDirective} from "@utility/presentation/directives/button/link.button.directive";
import {IOrderServiceDto} from "@order/external/interface/i.order-service.dto";
import {RIMember} from "@member/domain";
import {
	OrderServiceDetailsComponent
} from "@order/presentation/component/details/service/order-service-details.component";


@Component({
    selector: 'app-service-order-form-container',
    encapsulation: ViewEncapsulation.None,
	imports: [
		FormInputComponent,
		DatetimeLocalInputComponent,
		TranslateModule,
		FormTextareaComponent,
		CardComponent,
		FormBusinessProfileComponent,
		SwitchComponent,
		ButtonSaveContainerComponent,
		FormsModule,
		PrimaryButtonDirective,
		CurrencyPipe,
		NgSelectModule,
		ReactiveFormsModule,
		DefaultLabelDirective,
		PrimaryLinkButtonDirective,
		NgForOf,
		HumanizeDurationPipe,
		DatePipe,
		ActionComponent,
		AttendeeCardComponent,
		ChangeStatusOnAcceptedComponent,
		ChangeStatusOnRejectedComponent,
		EventStatusStyleDirective,
		NgIf,
		NoDataPipe,
		LinkButtonDirective,
		OrderServiceDetailsComponent
	],
    standalone: true,
    template: `

        <bee-card>

            <div class="font-bold">{{ 'keyword.capitalize.services' | translate }}</div>

            <div class="flex flex-wrap gap-4" *ngIf="form.controls.services.value.length">

				<app-order-service-details
					*ngFor="let service of form.controls.services.getRawValue(); let index = index"
					[service]="service">

					<div slot="footer" class="flex justify-between">

						<button type="button" link (click)="delete(index)">
							<i class="bi bi-trash"></i>
							{{ 'keyword.capitalize.delete' | translate }}
						</button>
						<button type="button" primaryLink (click)="edit(service, index)">
							<i class="bi bi-pencil"></i>
							{{ 'keyword.capitalize.edit' | translate }}
						</button>

					</div>

				</app-order-service-details>

            </div>

            <div class="block">

                <button type="button" primaryLink (click)="addService()">
                    <i class="bi bi-plus-lg"></i>
                    {{ 'event.form.section.service.button.add' | translate }}
                </button>

            </div>
        </bee-card>

    `,
    providers: [
        DurationVersionHtmlHelper,
        CurrencyPipe
    ]
})
export class ServiceOrderFormContainerComponent implements OnInit {

    @Input()
    public setupPartialData: {
        defaultAppointmentStartDateTimeIso?: string;
        defaultMemberForService?: RIMember;
    } = {};

    @Input()
    public form!: OrderForm;

    public readonly durationVersionHtmlHelper = inject(DurationVersionHtmlHelper);

    private readonly whacAMaleProvider = inject(WhacAMoleProvider<ContainerFormComponent>);
    private readonly ngxLogger = inject(NGXLogger);
    private readonly translateService = inject(TranslateService);

    public ngOnInit(): void {

        this.ngxLogger.info('ServiceOrderFormContainerComponent.ngOnInit()');

    }

    public async addService() {

        this.ngxLogger.info('ServiceOrderFormContainerComponent.addService()');

        const componentInputs: {
            useDefaultFlow: boolean;
            isEditMode: boolean;
            forceStart?: string;
            member?: RIMember;
        } = {
            isEditMode: false,
            useDefaultFlow: false,
            // forceStart: componentInputs?.datetimeISO,
            // isEditMode: !!componentInputs?.event,
        };

        if (this.setupPartialData.defaultAppointmentStartDateTimeIso) {
            componentInputs.forceStart = this.setupPartialData.defaultAppointmentStartDateTimeIso;
        }

        if (this.setupPartialData.defaultMemberForService) {
            componentInputs.member = this.setupPartialData.defaultMemberForService;
        }

				this.ngxLogger.info('componentInputs', componentInputs);

        const componentRef = await this.whacAMaleProvider.buildItAsync({
            title: this.translateService.instant('event.form.title.create'),
            component: ContainerFormComponent,
            componentInputs,
        });

        if (!componentRef) {
            return;
        }

        const {renderedComponentRef} = componentRef.instance;

        if (!renderedComponentRef) {
            return;
        }

        renderedComponentRef.setInput('callback', (component: ContainerFormComponent, formValue: IEvent) => {
            this.ngxLogger.info('callback', component, formValue);

            if (!formValue.services || !formValue.services.length) {
                return;
            }

            if (!formValue.attendees || !formValue.attendees.length) {
                return;
            }

            if (!formValue.timeZone) {
                return;
            }

            if (!formValue.start) {
                return;
            }

            if (!formValue.end) {
                return;
            }

            this.form.controls.services.pushNewOne({
                customerNote: formValue.note,
                orderAppointmentDetails: {
                    object: 'OrderAppointmentDetailsDto',
                    active: ActiveEnum.YES,
                    start: formValue.start,
                    end: formValue.end,
                    type: ReservationTypeEnum.service,
                    // languageCodes: LanguageCodeEnum[];
                    // attachments: IAttachmentDto[];
                    specialists: formValue.services[0].specialists,
                    attendees: formValue.attendees,
                    // locations: ILocationsDto[];
                    timeZone: formValue.timeZone,
                    createdAt: formValue.createdAt,
                    updatedAt: formValue.updatedAt,
                },
                serviceSnapshot: {
                    ...formValue.services[0],
                    object: "ServiceDto",
                } as unknown as IServiceDto,
            });

            // TODO: call function to increase defaultAppointmentStartDateTimeIso

            componentRef.instance.destroySelf();

        });

        const {instance} = renderedComponentRef;

        console.log('instance', instance);

    }

    public delete(index: number) {
        this.form.controls.services.removeAt(index);
    }

    public async edit(service: Partial<IOrderServiceDto>, index: number) {

        this.ngxLogger.info('ServiceOrderFormContainerComponent.edit()');

        const componentInputs: {
            orderServiceDto: Partial<IOrderServiceDto>;
            useDefaultFlow: boolean;
            isEditMode: boolean;
            forceStart?: string;
        } = {
            isEditMode: true,
            useDefaultFlow: false,
            orderServiceDto: service,
        };

        if (this.setupPartialData.defaultAppointmentStartDateTimeIso) {
            componentInputs.forceStart = this.setupPartialData.defaultAppointmentStartDateTimeIso;
        }

        const componentRef = await this.whacAMaleProvider.buildItAsync({
            title: this.translateService.instant('event.form.title.edit'),
            component: ContainerFormComponent,
            componentInputs,
        });

        if (!componentRef) {
            return;
        }

        const {renderedComponentRef} = componentRef.instance;

        if (!renderedComponentRef) {
            return;
        }

        renderedComponentRef.setInput('callback', (component: ContainerFormComponent, formValue: IEvent) => {
            this.ngxLogger.info('callback', component, formValue);

            if (!formValue.services || !formValue.services.length) {
                return;
            }

            if (!formValue.attendees || !formValue.attendees.length) {
                return;
            }

            if (!formValue.timeZone) {
                return;
            }

            if (!formValue.start) {
                return;
            }

            if (!formValue.end) {
                return;
            }

            this.form.controls.services.at(index).patchValue({
                customerNote: formValue.note,
                orderAppointmentDetails: {
                    object: 'OrderAppointmentDetailsDto',
                    active: ActiveEnum.YES,
                    start: formValue.start,
                    end: formValue.end,
                    type: ReservationTypeEnum.service,
                    // languageCodes: LanguageCodeEnum[];
                    // attachments: IAttachmentDto[];
                    specialists: formValue.services[0].specialists,
                    attendees: formValue.attendees,
                    // locations: ILocationsDto[];
                    timeZone: formValue.timeZone,
                    createdAt: formValue.createdAt,
                    updatedAt: formValue.updatedAt,
                },
                serviceSnapshot: {
                    ...formValue.services[0],
                    object: "ServiceDto",
                } as unknown as IServiceDto,
            });

            // TODO: call function to increase defaultAppointmentStartDateTimeIso

            componentRef.instance.destroySelf();

        });

    }

}
