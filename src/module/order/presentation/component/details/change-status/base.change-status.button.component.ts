import {Directive, HostBinding, HostListener, inject, input} from "@angular/core";
import {Reactive} from "@utility/cdk/reactive";
import {IOrderDto} from "@src/core/business-logic/order/interface/details/i.order.dto";
import {Store} from "@ngxs/store";
import {AlertController} from "@ionic/angular";
import {TranslateService} from "@ngx-translate/core";

@Directive()
export abstract class BaseChangeStatusButtonComponent extends Reactive {

	public readonly item = input.required<IOrderDto>();

	@HostListener('click')
	public onClick() {
		this.changeStatus();
	}

	protected readonly store = inject(Store);
	protected readonly alertController = inject(AlertController);
	protected readonly translateService = inject(TranslateService);

	@HostBinding()
	public class = `
		cursor-pointer
        flex
        items-center
        justify-center
        rounded-2xl
        bg-white
        hover:bg-beeColor-50
        dark:bg-beeDarkColor-800
        dark:hover:bg-beeDarkColor-600
        px-4
        py-2
        text-sm
        font-semibold
        text-beeColor-900
        dark:text-beeColor-200
        shadow-sm
        ring-1
        ring-inset
        ring-beeColor-300
    `;

	public abstract changeStatus(): void;

	protected confirm(): Promise<boolean> {
		return new Promise((resolve) => {
			this.alertController.create({
				header: this.translateService.instant('keyword.capitalize.confirm'),
				message: this.translateService.instant('order.confirmation.change-status.message'),
				buttons: [
					{
						text: this.translateService.instant('keyword.capitalize.cancel'),
						role: 'cancel',
						handler: () => resolve(false)
					},
					{
						text: this.translateService.instant('keyword.capitalize.yes'),
						handler: () => resolve(true)
					}
				]
			}).then((alert) => alert.present());
		});
	}

}
