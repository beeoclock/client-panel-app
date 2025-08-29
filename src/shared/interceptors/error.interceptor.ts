import {HttpErrorResponse, HttpInterceptorFn} from "@angular/common/http";
import {catchError, throwError} from 'rxjs';
import {inject} from "@angular/core";
import {IonicSafeString, ToastController} from "@ionic/angular/standalone";
import {HttpStatusEnum} from "@core/shared/enum/http-status.enum";
import {
	CustomerPresentationActions
} from "@tenant/customer/infrastructure/state/presentation/customer.presentation.actions";
import ECustomer from "@tenant/customer/domain/entity/e.customer";
import {ICustomer} from "@tenant/customer/domain";
import {IAbsence} from "@tenant/member/absence/domain/interface/i.absence";
import EAbsence from "@tenant/member/absence/domain/entity/e.absence";
import {
	AbsencePresentationActions
} from "@tenant/member/absence/infrastructure/state/presentation/absence.presentation.actions";
import EService from "@tenant/service/domain/entity/e.service";
import {IService} from "@tenant/service/domain/interface/i.service";
import {IOrder} from "@tenant/order/order/domain/interface/i.order";
import EOrder from "@tenant/order/order/domain/entity/e.order";
import {OrderActions} from "@tenant/order/order/infrastructure/state/order/order.actions";
import {ServiceActions} from "@tenant/service/infrastructure/state/service/service.actions";
import {IPayment} from "@tenant/order/payment/domain/interface/i.payment";
import EPayment from "@tenant/order/payment/domain/entity/e.payment";
import {
	PaymentPresentationActions
} from "@tenant/order/payment/infrastructure/state/presentation/payment.presentation.actions";
import {IBaseDTO} from "@core/shared/interface/i-base-entity.raw";
import {Store} from "@ngxs/store";

/**
 * TODO Handle any error on response
 * TODO Implement code which will serve any error in the system, perhaps some communicate of error will prepare in translate file, i.e. beeOClock.
 *
 * @param request
 * @param next
 */
export const ErrorInterceptor: HttpInterceptorFn = (request, next) => {

	const toastController = inject(ToastController);
	const store = inject(Store);

	return next(request).pipe(
		catchError((response: HttpErrorResponse) => {

			if (response.status === HttpStatusEnum.Unauthorized) {
				// TODO send some data into Sentry
				return throwError(() => response);
			}

			const {error} = response;

			let message: string | IonicSafeString = 'Unknown';

			if (typeof error === 'string') {
				message = error;
			} else {
				if ('errors' in error) {
					message = `<div>`;
					error.errors.forEach((error: {
						error: string;
						message: string;
						detail: string;
					}) => {
						message += `
							<div class="flex flex-col gap-2">
								<div>${error.error}</div>
								<div>${error.message}</div>
								<div>${error.detail}</div>
							</div>
						`;
					});
					message += `</div>`;
				} else {
					message = error?.message ?? message;
				}
			}

			const payload = request.body;
			const payloadIsObject = payload && typeof payload === 'object' && 'object' in payload;
			const payloadAsDTO = payload as IBaseDTO<string>;
			const userCanUseAction = payloadIsObject && payloadAsDTO.object in actionMapByOptionType;
			const buttons = [];

			if (userCanUseAction) {
				buttons.push({
					text: 'Details', //translateService.instant('keyword.capitalize.details'),
					role: 'details',
					handler: () => {
						const actionCreator = actionMapByOptionType[payloadAsDTO.object as keyof typeof actionMapByOptionType];
						const action = actionCreator(payloadAsDTO as any);
						store.dispatch(action);
					}
				});
			}
			buttons.push({
				text: 'Close', // translateService.instant('keyword.capitalize.close'),
				role: 'cancel',
			});

			toastController.create({
				header: error?.error ?? 'Error',
				message,
				duration: 10_000,
				buttons,
				position: 'top',
				color: 'danger',
			}).then((toast) => {
				toast.present().then();
			});
			return throwError(() => response);
		})
	);

}

const actionMapByOptionType = {
	CustomerDto: (dto: ICustomer.DTO) => {
		const entity = ECustomer.fromDTO(dto);
		return new CustomerPresentationActions.OpenDetails(entity)
	},
	AbsenceDto: (dto: IAbsence.DTO) => {
		const entity = EAbsence.fromDTO(dto);
		return new AbsencePresentationActions.OpenDetails(entity)
	},
	ServiceDto: (dto: IService.DTO) => {
		const entity = EService.fromDTO(dto);
		return new ServiceActions.OpenDetails(entity)
	},
	OrderDto: (dto: IOrder.DTO) => {
		const entity = EOrder.fromDTO(dto);
		return new OrderActions.OpenDetails(entity)
	},
	PaymentDto: (dto: IPayment.DTO) => {
		const entity = EPayment.fromDTO(dto);
		return new PaymentPresentationActions.OpenDetails(entity)
	},
}
