import {HttpErrorResponse, HttpInterceptorFn} from "@angular/common/http";
import {catchError, throwError} from 'rxjs';
import {inject} from "@angular/core";
import {ToastController} from "@ionic/angular";

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
			const {error} = response;

			let message = 'Unknown';

			if (typeof error === 'string') {
				message = error;
			} else {
				message = error?.message ?? message;
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
			return throwError(error);
		})
	);

}
