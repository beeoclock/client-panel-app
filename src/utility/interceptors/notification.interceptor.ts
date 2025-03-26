import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from "@angular/common/http";
import {inject, Injectable, Injector} from "@angular/core";
import {ToastController} from "@ionic/angular/standalone";
import {Endpoint} from "@utility/domain/endpoint";
import {RequestMethodEnum} from "@core/shared/enum/request-method.enum";
import {EndpointInterface} from "@utility/domain/interface/i.endpoint/i.endpoint-replace";
import {TranslateService} from "@ngx-translate/core";
import {Observable, tap} from "rxjs";
import {NGXLogger} from "ngx-logger";


/**
 * TODO Check which paths require to show some notification like toast or another type of notification, before and/or after the request is executed.
 * TODO Show the notifications in "flows", i.e.: show success notification after success request.
 *
 * @param request
 * @param next
 */
@Injectable()
export class NotificationInterceptor implements HttpInterceptor {

	private readonly logger = inject(NGXLogger);

	constructor(
		private readonly injector: Injector,
	) {
		this.logger.info(NotificationInterceptor.name, 'constructor')
	}

	public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

		// log using translate service
		return next.handle(request).pipe(
			tap((httpEvent) => {

				if (!(httpEvent instanceof HttpResponse)) {
					return; // If it is request, then return
				}

				const endpoint = Endpoint.endpointMap[request.method as RequestMethodEnum].get(request.url) ?? {} as EndpointInterface;

				if (endpoint) {

					const {after} = endpoint;

					if (after) {

						const {success} = after;

						if (success) {

							const {notification} = success;

							if (notification) {

								const translateService = this.injector.get(TranslateService);
								const toastController = this.injector.get(ToastController);
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
										toast.present().then();
									});

								}

							}

						}

					}

				}

			})
		);
	}
}
