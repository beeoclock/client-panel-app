import {Component, inject, Input, OnInit, ViewEncapsulation} from "@angular/core";
import {RIMember} from "@member/domain";
import {PushBoxService} from "@utility/presentation/component/push-box/push-box.service";
import {Store} from "@ngxs/store";
import {OrderActions} from "@order/state/order/order.actions";
import {AbsenceActions} from "@absence/state/absence/absence.actions";
import {TranslateModule} from "@ngx-translate/core";
import {NGXLogger} from "ngx-logger";
import {
    SelectedMemberAdditionalMenuComponent
} from "@event/presentation/component/additional-menu/selected-member.additional-menu.component";
import {NgIf} from "@angular/common";
import {
    SelectedDatetimeAdditionalMenuComponent
} from "@event/presentation/component/additional-menu/selected-datetime.additional-menu.component";
import {DateTime} from "luxon";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";

@Component({
    selector: 'app-additional-menu',
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    imports: [
        TranslateModule,
        SelectedMemberAdditionalMenuComponent,
        NgIf,
        SelectedDatetimeAdditionalMenuComponent,
        DynamicDatePipe
    ],
    template: `
        <div class="grid grid-cols-1 gap-2 p-2">
            <div class="flex gap-2">
                <app-selected-member-additional-menu class="flex-1" *ngIf="member" [member]="member"/>
                <app-selected-datetime-additional-menu class="flex-1" *ngIf="datetimeISO"  [datetimeISO]="datetimeISO"/>
            </div>
            <button type="button" (click)="openOrderForm()"
                    class="text-start bg-blue-100 border border-blue-300 cursor-pointer duration-300 hover:bg-blue-200 p-4 rounded-md transition-colors">
                <h3 class="text-lg font-semibold text-blue-500 mb-2">
                    <i class="w-6 h-6 me-1 text-3xl transition duration-75 bi bi-cart"></i>
                    {{ 'event.additionalMenu.items.addNewOrder.title' | translate }}
                </h3>
                <p class="text-blue-500">
                    {{ 'event.additionalMenu.items.addNewOrder.hint' | translate }}
                </p>
            </button>
            <div class="flex flex-col gap-4">
                <div class="font-bold text-lg text-beeColor-600">
                    {{ 'keyword.capitalize.break' | translate }}
                </div>
                <ng-container *ngIf="datetimeISO">
                    <div class="flex flex-col gap-2">
                        <div class="text-beeColor-500 flex justify-between">
                            <div>{{ 'keyword.capitalize.from' | translate }}:</div>
                            <div>{{ datetimeISO | dynamicDate }}</div>
                        </div>
                        <div class="grid grid-cols-4 gap-2 text-blue-500">
                            <button type="button" (click)="openAbsenceForm(5, true)"
                                    class="bg-blue-100 border border-blue-300 cursor-pointer duration-300 hover:bg-blue-200 p-4 rounded-md text-center transition-colors">
                                <span class="text-2xl font-bold">5</span>{{ 'keyword.lowercase.short.minutes' | translate }}
                            </button>
                            <button type="button" (click)="openAbsenceForm(10, true)"
                                    class="bg-blue-100 border border-blue-300 cursor-pointer duration-300 hover:bg-blue-200 p-4 rounded-md text-center transition-colors">
                                <span class="text-2xl font-bold">10</span>{{ 'keyword.lowercase.short.minutes' | translate }}
                            </button>
                            <button type="button" (click)="openAbsenceForm(15, true)"
                                    class="bg-blue-100 border border-blue-300 cursor-pointer duration-300 hover:bg-blue-200 p-4 rounded-md text-center transition-colors">
                                <span class="text-2xl font-bold">15</span>{{ 'keyword.lowercase.short.minutes' | translate }}
                            </button>
                            <button type="button" (click)="openAbsenceForm(30, true)"
                                    class="bg-blue-100 border border-blue-300 cursor-pointer duration-300 hover:bg-blue-200 p-4 rounded-md text-center transition-colors">
                                <span class="text-2xl font-bold">30</span>{{ 'keyword.lowercase.short.minutes' | translate }}
                            </button>
                            <button type="button" (click)="openAbsenceForm(45, true)"
                                    class="bg-blue-100 border border-blue-300 cursor-pointer duration-300 hover:bg-blue-200 p-4 rounded-md text-center transition-colors">
                                <span class="text-2xl font-bold">45</span>{{ 'keyword.lowercase.short.minutes' | translate }}
                            </button>
                            <button type="button" (click)="openAbsenceForm(60, true)"
                                    class="bg-blue-100 border border-blue-300 cursor-pointer duration-300 hover:bg-blue-200 p-4 rounded-md text-center transition-colors">
                                <span class="text-2xl font-bold">1</span>{{ 'keyword.lowercase.short.hour' | translate }}
                            </button>
                            <button type="button" (click)="openAbsenceForm(120, true)"
                                    class="bg-blue-100 border border-blue-300 cursor-pointer duration-300 hover:bg-blue-200 p-4 rounded-md text-center transition-colors">
                                <span class="text-2xl font-bold">2</span>{{ 'keyword.lowercase.short.hour' | translate }}
                            </button>
                        </div>
                    </div>
                </ng-container>
                <div class="flex flex-col gap-2">
                    <div class="text-beeColor-500 flex justify-between">
                        <div>{{ 'keyword.capitalize.from' | translate }}: {{ 'keyword.lowercase.now' | translate }}</div>
                        <div>{{ now | dynamicDate }}</div>
                    </div>
                    <div class="grid grid-cols-4 gap-2 text-blue-500">
                        <button type="button" (click)="openAbsenceForm(5, false)"
                                class="bg-blue-100 border border-blue-300 cursor-pointer duration-300 hover:bg-blue-200 p-4 rounded-md text-center transition-colors">
                            <span class="text-2xl font-bold">5</span>{{ 'keyword.lowercase.short.minutes' | translate }}
                        </button>
                        <button type="button" (click)="openAbsenceForm(10, false)"
                                class="bg-blue-100 border border-blue-300 cursor-pointer duration-300 hover:bg-blue-200 p-4 rounded-md text-center transition-colors">
                            <span class="text-2xl font-bold">10</span>{{ 'keyword.lowercase.short.minutes' | translate }}
                        </button>
                        <button type="button" (click)="openAbsenceForm(15, false)"
                                class="bg-blue-100 border border-blue-300 cursor-pointer duration-300 hover:bg-blue-200 p-4 rounded-md text-center transition-colors">
                            <span class="text-2xl font-bold">15</span>{{ 'keyword.lowercase.short.minutes' | translate }}
                        </button>
                        <button type="button" (click)="openAbsenceForm(30, false)"
                                class="bg-blue-100 border border-blue-300 cursor-pointer duration-300 hover:bg-blue-200 p-4 rounded-md text-center transition-colors">
                            <span class="text-2xl font-bold">30</span>{{ 'keyword.lowercase.short.minutes' | translate }}
                        </button>
                        <button type="button" (click)="openAbsenceForm(45, false)"
                                class="bg-blue-100 border border-blue-300 cursor-pointer duration-300 hover:bg-blue-200 p-4 rounded-md text-center transition-colors">
                            <span class="text-2xl font-bold">45</span>{{ 'keyword.lowercase.short.minutes' | translate }}
                        </button>
                        <button type="button" (click)="openAbsenceForm(60, false)"
                                class="bg-blue-100 border border-blue-300 cursor-pointer duration-300 hover:bg-blue-200 p-4 rounded-md text-center transition-colors">
                            <span class="text-2xl font-bold">1</span>{{ 'keyword.lowercase.short.hour' | translate }}
                        </button>
                        <button type="button" (click)="openAbsenceForm(120, false)"
                                class="bg-blue-100 border border-blue-300 cursor-pointer duration-300 hover:bg-blue-200 p-4 rounded-md text-center transition-colors">
                            <span class="text-2xl font-bold">2</span>{{ 'keyword.lowercase.short.hour' | translate }}
                        </button>
                    </div>
                </div>
            </div>
<!--            <button type="button" (click)="openAbsenceForm()"-->
<!--                    class="bg-blue-100 border border-blue-300 cursor-pointer duration-300 hover:bg-gray-100 p-4 rounded-md text-center transition-colors">-->
<!--                <h3 class="text-lg font-semibold text-black mb-2">-->
<!--                    <i class="w-6 h-6 me-1 text-beeColor-500 transition duration-75 dark:text-beeDarkColor-400 bi bi-calendar2-x"></i>-->
<!--                    {{ 'event.additionalMenu.items.addNewAbsence.title' | translate }}-->
<!--                </h3>-->
<!--                <p class="text-gray-600">-->
<!--                    {{ 'event.additionalMenu.items.addNewAbsence.hint' | translate }}-->
<!--                </p>-->
<!--            </button>-->
        </div>
    `
})
export class AdditionalMenuComponent implements OnInit {

    @Input()
    public member: RIMember | undefined;

    @Input()
    public datetimeISO: string | undefined;

    @Input()
    public callback: (() => void) = () => {
    };

    public readonly now = new Date().toISOString();

    private readonly pushBoxService = inject(PushBoxService);
    private readonly store = inject(Store);
    private readonly ngxLogger = inject(NGXLogger);

    public ngOnInit() {
        this.ngxLogger.info('AdditionalMenuComponent initialized', this);
    }

    public openOrderForm() {
        // TODO: set datetimeISO, member and callback in store
        this.store.dispatch(new OrderActions.OpenForm());
        this.closeSelf();
    }

    public openAbsenceForm(differenceInMinutes: number = 15, useDatetimeISO: boolean = true) {

        const item = {
            memberIds: [] as string[],
            start: DateTime.now().toJSDate().toISOString(),
            end: DateTime.now().plus({minutes: differenceInMinutes}).toJSDate().toISOString(),
        };

        if (this.member) {
            item.memberIds = [this.member._id];
        }

        if (useDatetimeISO && this.datetimeISO) {
            item.start = this.datetimeISO;
            item.end = DateTime.fromISO(this.datetimeISO).plus({minutes: differenceInMinutes}).toJSDate().toISOString();
        }

        this.store.dispatch(new AbsenceActions.OpenForm({
            componentInputs: {
                item
            }
        }));
        this.closeSelf();
    }

    public closeSelf() {
        this.pushBoxService.destroyByComponentName$.next(AdditionalMenuComponent.name);
    }

}
