import {HttpInterceptorFn} from "@angular/common/http";
import {inject} from "@angular/core";
import {ToastController} from "@ionic/angular";
import {Endpoint} from "@utility/domain/endpoint";
import {RequestMethodEnum} from "@utility/domain/enum/request-method.enum";
import {EndpointInterface} from "@utility/domain/interface/i.endpoint/i.endpoint-replace";
import {TranslateService} from "@ngx-translate/core";
import {tap} from "rxjs";


/**
 * TODO Check which paths require to show some notification like toast or another type of notification, before and/or after the request is executed.
 * TODO Show the notifications in "flows", i.e.: show success notification after success request.
 *
 * @param request
 * @param next
 */
export const NotificationInterceptor: HttpInterceptorFn = (request, next) => {

	const endpoint = Endpoint.endpointMap[request.method as RequestMethodEnum].get(request.url) ?? {} as EndpointInterface;
	const toastController = inject(ToastController);
	const translateService = inject(TranslateService);


	return next(request).pipe(
		tap(() => {

			if (endpoint) {

				const {after} = endpoint;

				if (after) {

					const {success} = after;

					if (success) {

						const {notification} = success;

						if (notification) {

							const {execute} = notification;

							if (execute) {

								const {title: header, message} = execute(translateService);

								toastController.create({
									header,
									message,
									duration: 10_000,
									buttons: [
										{
											text: 'Close',
											role: 'cancel',
										},
									],
									position: 'top',
									color: 'success',
								}).then((toast) => {
									toast.present();
								});

							}

						}

					}

				}

			}
			
		})
	);

}
