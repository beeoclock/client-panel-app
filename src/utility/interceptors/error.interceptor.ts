import {HttpErrorResponse, HttpInterceptorFn} from "@angular/common/http";
import {catchError, throwError} from 'rxjs';
import {inject} from "@angular/core";
import {IonicSafeString, ToastController} from "@ionic/angular";
import {HttpStatusEnum} from "@core/shared/enum/http-status.enum";

/**
 * TODO Handle any error on response
 * TODO Implement code which will serve any error in the system, perhaps some communicate of error will prepare in translate file, i.e. beeOClock.
 *
 * @param request
 * @param next
 */
export const ErrorInterceptor: HttpInterceptorFn = (request, next) => {

	const toastController = inject(ToastController);

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

			toastController.create({
				header: error?.error ?? 'Error',
				message,
				duration: 10_000,
				buttons: [
					{
						text: 'Close',
						role: 'cancel',
					},
				],
				position: 'top',
				color: 'danger',
			}).then((toast) => {
				toast.present().then();
			});
			return throwError(() => response);
		})
	);

}
