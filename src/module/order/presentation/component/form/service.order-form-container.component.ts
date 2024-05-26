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
import {PushBoxService} from "@utility/presentation/component/push-box/push-box.service";
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
    ChangeStatusOnBookedComponent
} from "@event/presentation/component/change-status/change-status-on-booked.component";
import {
    ChangeStatusOnRejectedComponent
} from "@event/presentation/component/change-status/change-status-on-rejected.component";
import {EventStatusStyleDirective} from "@event/presentation/directive/event-status-style/event-status-style.directive";
import {NoDataPipe} from "@utility/presentation/pipes/no-data.pipe";
import {DurationVersionHtmlHelper} from "@utility/helper/duration-version.html.helper";


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
        ChangeStatusOnBookedComponent,
        ChangeStatusOnRejectedComponent,
        EventStatusStyleDirective,
        NgIf,
        NoDataPipe
    ],
    standalone: true,
    template: `

        <bee-card>

            <div class="font-bold">{{ 'keyword.capitalize.services' | translate }}</div>

            <div class="flex flex-wrap gap-4">

                <bee-card class="text-sm w-full" gap="gap-2" *ngFor="let service of form.controls.services.value">

                    <div class="flex justify-between items-center gap-8">

                        <div class="flex items-center gap-2 w-full">
                            <div class="bg-neutral-100 text-neutral-800 font-medium inline-flex gap-1 items-center px-2 py-0.5 rounded-2xl dark:bg-gray-700 dark:text-neutral-400 border border-neutral-400">
                                {{ (service.serviceSnapshot?.durationVersions?.[0]?.prices?.[0]?.price ?? 0) | currency: (service.serviceSnapshot?.durationVersions?.[0]?.prices?.[0]?.currency ?? 'USD') : 'symbol-narrow'  }}
                            </div>
                            <div class="bg-neutral-100 text-neutral-800 font-medium inline-flex gap-1 items-center px-2 py-0.5 rounded-2xl dark:bg-gray-700 dark:text-neutral-400 border border-neutral-400">
                                <i class="bi bi-clock text-beeColor-500"></i>
                                {{ (service.serviceSnapshot?.durationVersions?.[0]?.durationInSeconds ?? 0) | humanizeDuration }}
                            </div>
                        </div>

                    </div>
                    <div class="cursor-pointer inline-flex gap-4 items-center">
                        <i class="bi bi-calendar text-beeColor-500"></i>
                        <div class="inline-flex gap-2">
                            {{ service.orderServiceDetails?.start | date: 'yyyy-MM-dd HH:mm' }}
                        </div>
                    </div>
                    <div class="cursor-pointer inline-flex gap-4 items-center">
                        <i class="bi bi-cart text-beeColor-500"></i>
                        {{ service.serviceSnapshot?.languageVersions?.[0]?.title | noData }}
                    </div>
                    <div class="cursor-pointer inline-flex gap-4 items-center">
                        <i class="bi bi-file-person text-beeColor-500"></i>
                        {{ service.orderServiceDetails?.specialists?.[0]?.member?.firstName }}
                        {{ service.orderServiceDetails?.specialists?.[0]?.member?.lastName }}
                    </div>
                    <event-attendee-card-component
                            *ngFor="let attendee of (service.orderServiceDetails?.attendees ?? [])"
                            [attendee]="attendee"/>
                    <ng-container *ngIf="service?.customerNote?.length">
                        <hr class="mt-2">
                        <div class="text-neutral-500 dark:text-neutral-400 py-2">
                            {{ service.customerNote }}
                        </div>
                    </ng-container>
                </bee-card>


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
    public form!: OrderForm;

    public readonly durationVersionHtmlHelper = inject(DurationVersionHtmlHelper);

    private readonly pushBoxService = inject(PushBoxService<ContainerFormComponent>);
    private readonly ngxLogger = inject(NGXLogger);
    private readonly translateService = inject(TranslateService);

    public ngOnInit(): void {

        this.ngxLogger.info('ServiceOrderFormContainerComponent.ngOnInit()');

    }

    public async addService() {

        this.ngxLogger.info('ServiceOrderFormContainerComponent.addService()');

        const componentRef = await this.pushBoxService.buildItAsync({
            title: this.translateService.instant('event.form.title.create'),
            component: ContainerFormComponent,
            componentInputs: {
                useDefaultFlow: false,
                // forceStart: componentInputs?.datetimeISO,
                // isEditMode: !!componentInputs?.event,
            },
        }).then((test) => {
            console.log('test', test)
            return test;
        });

        console.log('componentRef', componentRef);

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
                orderServiceDetails: {
                    object: 'OrderServiceDetailsDto',
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


            componentRef.instance.destroySelf();

        })

        const {instance} = renderedComponentRef;

        console.log('instance', instance);

    }

}