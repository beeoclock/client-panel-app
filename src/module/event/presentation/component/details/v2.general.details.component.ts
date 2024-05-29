import {Component, HostBinding, inject, Input, OnChanges, SimpleChange, SimpleChanges} from "@angular/core";
import {IAttendee, IEvent_V2} from "@event/domain";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {TranslateModule} from "@ngx-translate/core";
import {CurrencyPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {HumanizeDurationPipe} from "@utility/presentation/pipes/humanize-duration.pipe";
import {DurationVersionHtmlHelper} from "@utility/helper/duration-version.html.helper";
import {IOrderDto} from "@order/external/interface/details/i.order.dto";
import {IOrderServiceDto} from "@order/external/interface/i.order-service.dto";
import {ISpecialist} from "@service/domain/interface/i.specialist";
import {ICustomer} from "@customer/domain";
import {OrderServiceStatusEnum} from "@order/domain/enum/order-service.status.enum";
import {
    OrderServiceStatusStyleDirective
} from "@event/presentation/directive/order-service-status-style/order-service-status-style.directive";

@Component({
    selector: 'event-v2-general-details',
    standalone: true,
    imports: [
        DynamicDatePipe,
        TranslateModule,
        CurrencyPipe,
        NgForOf,
        NgIf,
        HumanizeDurationPipe,
        NgClass,
        OrderServiceStatusStyleDirective,
    ],
    providers: [
        CurrencyPipe,
        DurationVersionHtmlHelper,
    ],
    template: `

        <div class="p-4 flex justify-between">
            <div *ngIf="isNotPreview && status" orderServiceStatusStyle [status]="status"></div>
            <div
                    *ngIf="isPreview"
                    class="px-2 py-1 flex items-center justify-center h-6 text-xs rounded-full border text-white uppercase bg-blue-500 border-blue-500 dark:bg-blue-900 dark:text-blue-400 dark:border-blue-800">
                {{ 'keyword.capitalize.preview' | translate }}
            </div>
        </div>
        <div class="border-t border-gray-100">
            <dl class="divide-y divide-gray-100">
                <div class="px-4 py-6">
                    <dt class="text-sm font-medium leading-6 text-gray-900">
                        {{ 'keyword.capitalize.service' | translate }}
                    </dt>
                    <dd class="mt-2 text-sm text-gray-900 ">
                        <ul role="list" class="divide-y divide-gray-100 rounded-md border border-gray-200">
                            <li class="flex">
                                <img
                                        *ngIf="bannerUrl"
                                        [src]="bannerUrl"
                                        class="object-cover bg-beeColor-200 rounded-l-md w-14"
                                        alt=""/>
                                <div class="flex flex-col justify-center text-sm leading-6 p-4">
                                    <strong>{{ title }}</strong>
                                    <div class="flex w-full gap-4">
                                        <div
                                                class="flex flex-col"
                                                [innerHTML]="durationVersionHtmlHelper.getDurationValue(event.originalData.service.serviceSnapshot)">
                                        </div>
                                        <div
                                                class="flex flex-col"
                                                [innerHTML]="durationVersionHtmlHelper.getPriceValue(event.originalData.service.serviceSnapshot)">
                                        </div>
                                    </div>
                                    <p class="text-beeColor-500 line-clamp-2">{{ description }}</p>
                                </div>
                            </li>
                        </ul>
                    </dd>
                </div>
                <div class="px-4 py-6">
                    <dt class="text-sm font-medium leading-6 text-gray-900">
                        {{ 'keyword.capitalize.clients' | translate }}
                    </dt>
                    <dd class="mt-2 text-sm text-gray-900">
                        <ul role="list" class="divide-y divide-gray-100 rounded-md border border-gray-200">
                            <ng-container *ngFor="let customer of attendantMap.customers; let index = index;">
                                <li
                                        *ngIf="customer"
                                        class="grid grid-cols-1 py-4 pl-4 pr-5 text-sm leading-6">
                                    <div class="">
                                        {{ customer.firstName }} {{ customer.lastName }}
                                    </div>
                                    <div class="">
                                        {{ customer.email }}
                                    </div>
                                    <div class="">
                                        {{ customer.phone }}
                                    </div>
                                </li>
                            </ng-container>
                        </ul>
                    </dd>
                </div>
                <div class="px-4 py-6">
                    <dt class="text-sm font-medium leading-6 text-gray-900">
                        {{ 'keyword.capitalize.specialist' | translate }}
                    </dt>
                    <dd *ngFor="let specialist of attendantMap.specialists"
                        class="mt-1 text-sm leading-6 text-gray-700 flex items-center gap-2">
                        <div class="rounded-full bg-beeColor-400 min-h-8 min-w-8 flex justify-center items-center font-bold text-white">
                            {{ specialist.member.firstName[0] }}{{ specialist.member.lastName[0] }}
                        </div>
                        {{ specialist.member.firstName }} {{ specialist.member.lastName }}
                    </dd>
                </div>
                <div class="px-4 py-6 ">
                    <dt class="text-sm font-medium leading-6 text-gray-900">
                        {{ 'keyword.capitalize.dateAndTime' | translate }}
                    </dt>
                    <dd class="mt-1 text-sm leading-6 text-gray-700">
                        {{ event.start | dynamicDate: 'medium' }}
                    </dd>
                </div>
                <div class="px-4 py-6 ">
                    <dt class="text-sm font-medium leading-6 text-gray-900">
                        {{ 'keyword.capitalize.note' | translate }}
                    </dt>
                    <dd
                            class="mt-1 text-sm leading-6"
                            [ngClass]="{
							'text-beeColor-500 italic': !thereIsDescription,
							'text-gray-700': thereIsDescription
						}">
                        {{ thereIsDescription ? event.note : ('keyword.capitalize.noData' | translate) }}
                    </dd>
                </div>
            </dl>
        </div>

    `
})
export class V2GeneralDetailsComponent implements OnChanges {

    @Input({required: true})
    public event!: IEvent_V2<{ order: IOrderDto; service: IOrderServiceDto; }>;

    @Input()
    public isPreview = false;

    @HostBinding()
    public class = 'block bg-white';

    public readonly durationVersionHtmlHelper = inject(DurationVersionHtmlHelper);

    public readonly attendantMap: {
        specialists: ISpecialist[];
        customers: ICustomer[];
    } = {
        specialists: [],
        customers: [],
    };

    public bannerUrl: string = '';
    public title: string = '';
    public description: string = '';
    public status: OrderServiceStatusEnum | null = null;

    public ngOnChanges(changes: SimpleChanges & { event: SimpleChange }) {

        const {event} = changes;

        if (event) {

            const {attendees} = event.currentValue as IEvent_V2<{ order: IOrderDto; service: IOrderServiceDto; }>;
            attendees.forEach((attendee) => {
                console.log(attendee);
                (attendee.is === 'specialist') && this.attendantMap.specialists.push(attendee.originalData as ISpecialist);
                (attendee.is === 'customer') && this.attendantMap.customers.push((attendee.originalData as IAttendee).customer);
            });

            this.bannerUrl = this.event?.originalData?.service?.serviceSnapshot?.presentation?.banners?.[0] ?? '';
            this.title = this.event?.originalData?.service?.serviceSnapshot?.languageVersions?.[0]?.title ?? '';
            this.description = this.event?.originalData?.service?.serviceSnapshot?.languageVersions?.[0]?.description ?? '';
            this.status = this.event?.originalData?.service?.status ?? null;

        }

    }

    public get isNotPreview(): boolean {
        return !this.isPreview;
    }

    public get thereIsDescription(): boolean {
        return !!this.event?.note?.length;
    }

}
