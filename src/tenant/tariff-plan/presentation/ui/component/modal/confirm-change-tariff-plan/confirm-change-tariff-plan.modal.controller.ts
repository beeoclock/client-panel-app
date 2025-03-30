import {inject, Injectable} from "@angular/core";
import {ModalController} from "@ionic/angular/standalone";
import {
	ConfirmChangeTariffPlanComponent
} from "@tenant/tariff-plan/presentation/ui/component/modal/confirm-change-tariff-plan/confirm-change-tariff-plan.component";
import {ITariffPlan} from "@tenant/tariff-plan/domain/interface/i.tariff-plan";
import {ITariffPlanHistory} from "@tenant/tariff-plan-history/domain/interface/i.tariff-plan-history";

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
		await modal.present();
		return modal;
	}

	public close() {
		return this.modalController.dismiss();
	}
}
