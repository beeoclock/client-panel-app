import {inject, Injectable} from "@angular/core";
import {ModalController} from "@ionic/angular/standalone";
import {
	ConfirmChangeTariffPlanComponent
} from "@tariffPlan/presentation/component/modal/confirm-change-tariff-plan/confirm-change-tariff-plan.component";
import {ITariffPlan} from "@core/business-logic/tariif-plan/interface/i.tariff-plan";
import {ITariffPlanHistory} from "@core/business-logic/tariif-plan-history/interface/i.tariff-plan-history";

@Injectable()
export class ConfirmChangeTariffPlanModalController {
	private readonly modalController = inject(ModalController);

	public async present(
		tariffPlan: ITariffPlan.DTO,
		currentTariffPlan: ITariffPlanHistory.DTO
	): Promise<HTMLIonModalElement> {
		const modal = await this.modalController.create({
			component: ConfirmChangeTariffPlanComponent,
			componentProps: {
				tariffPlan,
				currentTariffPlan,
				closeModal: async (result: boolean) => {
					await modal.dismiss(result);
				},
			}
		});
		console.log({modal})
		await modal.present();
		return modal;
	}
}
