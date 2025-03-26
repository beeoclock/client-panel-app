import {HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest} from "@angular/common/http";
import {inject} from '@angular/core';
import {EMPTY, firstValueFrom, from, Observable, switchMap} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {AlertController} from "@ionic/angular/standalone";
import {Endpoint} from "@utility/domain/endpoint";
import {RequestMethodEnum} from "@core/shared/enum/request-method.enum";
import {OverlayEventDetail} from "@ionic/core/dist/types/utils/overlays-interface";
import {Store} from "@ngxs/store";
import {AppActions} from "@utility/state/app/app.actions";

/**
 *
 * @param request
 * @param next
 */
export const ApprovalInterceptor: HttpInterceptorFn = (request, next) => {

  return handleAccess(request, next);

}


/**
 *
 * @param request
 * @param next
 * @private
 */
function handleAccess(request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {

  const endpoint = Endpoint.endpointMap[request.method as RequestMethodEnum].get(request.url) ?? {} as any;
  const {before} = endpoint;

  if (before) {

    const {accept} = before;

    if (accept) {

      return from(isAccepted(request.url, request.method)).pipe(
        switchMap((accepted) => {
          if (!accepted) {
            return EMPTY;
          }
          return next(request);
        })
      )

    }

  }

  return next(request);

}


/**
 *
 * @param path
 * @param method
 */
async function isAccepted(path: string, method: string): Promise<boolean> {

  const translateService = inject(TranslateService);
  const store = inject(Store);
  const alertController = inject(AlertController);

  await firstValueFrom(store.dispatch(new AppActions.PageLoading(false)));

  return confirmAlert(alertController, {

    header: translateService.instant(`http.${method}.${path}.before.accept.header`),
    message: translateService.instant(`http.${method}.${path}.before.accept.message`),

    cancel: translateService.instant('keyword.capitalize.cancel'),
    confirm: translateService.instant('keyword.capitalize.confirm'),

  }).then(({role}) => {

    return role === 'confirm'

  }).then(async (confirmed) => {

    await firstValueFrom(store.dispatch(new AppActions.PageLoading(confirmed)));

    return confirmed;

  });

}

async function confirmAlert(
  alertController: AlertController,
  params: {
    header: string;
    message: string;
    confirm: string;
    cancel: string;
  }
): Promise<OverlayEventDetail> {

  const {header, message, cancel, confirm} = params;

  const alert = await alertController.create({
    header,
    message,
    buttons: [
      {
        text: cancel,
        role: 'cancel',
      },
      {
        text: confirm,
        role: 'confirm',
      }
    ]

  });

  await alert.present();

  return alert.onDidDismiss();

}
