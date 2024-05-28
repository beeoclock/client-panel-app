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

@Component({
    selector: 'app-additional-menu',
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    imports: [
        TranslateModule,
        SelectedMemberAdditionalMenuComponent,
        NgIf,
        SelectedDatetimeAdditionalMenuComponent
    ],
    template: `
        <div class="grid grid-cols-1 gap-2 p-2">
            <div class="flex gap-2">
                <app-selected-member-additional-menu class="flex-1" *ngIf="member" [member]="member"/>
                <app-selected-datetime-additional-menu class="flex-1" *ngIf="datetimeISO"  [datetimeISO]="datetimeISO"/>
            </div>
            <button type="button" (click)="openOrderForm()"
                    class="text-start bg-white hover:bg-gray-100 p-4 cursor-pointer rounded-md border border-gray-300 transition-colors duration-300">
                <h3 class="text-lg font-semibold text-black mb-2">
                    <i class="w-6 h-6 me-1 text-beeColor-500 transition duration-75 dark:text-beeDarkColor-400 bi bi-cart"></i>
                    {{ 'event.additionalMenu.items.addNewOrder.title' | translate }}
                </h3>
                <p class="text-gray-600">
                    {{ 'event.additionalMenu.items.addNewOrder.hint' | translate }}
                </p>
            </button>
            <button type="button" (click)="openAbsenceForm()"
                    class="text-start bg-white hover:bg-gray-100 p-4 cursor-pointer rounded-md border border-gray-300 transition-colors duration-300">
                <h3 class="text-lg font-semibold text-black mb-2">
                    <i class="w-6 h-6 me-1 text-beeColor-500 transition duration-75 dark:text-beeDarkColor-400 bi bi-calendar2-x"></i>
                    {{ 'event.additionalMenu.items.addNewAbsence.title' | translate }}
                </h3>
                <p class="text-gray-600">
                    {{ 'event.additionalMenu.items.addNewAbsence.hint' | translate }}
                </p>
            </button>
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

    public openAbsenceForm() {
        // TODO: set datetimeISO, member and callback in store
        this.store.dispatch(new AbsenceActions.OpenForm());
        this.closeSelf();
    }

    public closeSelf() {
        this.pushBoxService.destroyByComponentName$.next(AdditionalMenuComponent.name);
    }

}
