import {Component, inject, input, ViewEncapsulation} from "@angular/core";
import {RIMember} from "@member/domain";
import {PushBoxService} from "@utility/presentation/component/push-box/push-box.service";
import {Store} from "@ngxs/store";
import {OrderActions} from "@order/state/order/order.actions";
import {AbsenceActions} from "@absence/state/absence/absence.actions";

@Component({
    selector: 'app-additional-menu',
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    template: `
        <div class="grid grid-cols-1 gap-4 p-4">
            <button type="button" (click)="openOrderForm()" class="text-start bg-gray-50 hover:bg-gray-100 p-4 cursor-pointer rounded-md border border-gray-300 transition-colors duration-300">
                <h3 class="text-lg font-semibold text-black mb-2">
                    <i class="w-6 h-6 me-1 text-beeColor-500 transition duration-75 dark:text-beeDarkColor-400 bi bi-cart"></i>
                    Dodaj nowe zamówienie
                </h3>
                <p class="text-gray-600">
                    Przez tą opcji będziesz dodawać nowe zamówienie wraz z usługą i produktem.
                </p>
            </button>
            <button type="button" (click)="openAbsenceForm()" class="text-start bg-gray-50 hover:bg-gray-100 p-4 cursor-pointer rounded-md border border-gray-300 transition-colors duration-300">
                <h3 class="text-lg font-semibold text-black mb-2">
                    <i class="w-6 h-6 me-1 text-beeColor-500 transition duration-75 dark:text-beeDarkColor-400 bi bi-calendar2-x"></i>
                    Dodaj nową przerwę
                </h3>
                <p class="text-gray-600">
                    Przez tą opcji będziesz dodawać nową przerwę w swoim kalendarzu dla siebie lub dla innych.
                </p>
            </button>
        </div>
    `
})
export class AdditionalMenuComponent {

    public readonly datetimeISO = input<string>();
    public readonly member = input<RIMember | undefined>();
    public readonly callback = input<() => void>(() => {
    });

    private readonly pushBoxService = inject(PushBoxService);
    private readonly store = inject(Store);

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
