import {inject, Injectable} from "@angular/core";
import {ModalController} from "@ionic/angular/standalone";
import {
	ConfirmChangeTariffPlanComponent
} from "@tariffPlan/presentation/component/modal/confirm-change-tariff-plan/confirm-change-tariff-plan.component";
import {ITariffPlan} from "@core/business-logic/tariif-plan/interface/i.tariff-plan";

@Injectable()
export class ConfirmChangeTariffPlanModalController {
	private readonly modalController = inject(ModalController);

	public async present(tariffPlan: ITariffPlan.DTO): Promise<void> {
		const modal = await this.modalController.create({
			component: ConfirmChangeTariffPlanComponent,
			componentProps: {
				tariffPlan
			}
		});
		console.log({modal})
		await modal.present();
	}
}
