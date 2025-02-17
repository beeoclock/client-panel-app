import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from "@angular/core";
import {ModalController} from "@ionic/angular";
import {from, switchMap} from "rxjs";
import {
	NotificationSettingsComponent
} from "@order/presentation/component/notification-settings/notification-settings.component";
import {Store} from "@ngxs/store";
import {SendNotificationConditionEnum} from "@core/shared/enum/send-notification-condition.enum";
import {OverlayEventDetail} from "@ionic/core/dist/types/utils/overlays-interface";
import {RequestMethodEnum} from "@core/shared/enum/request-method.enum";
import {BusinessProfileState} from "@businessProfile/infrastructure/state/business-profile/business-profile.state";


export const NotificationSettingsInterceptor: HttpInterceptorFn = (req, next) => {
	const handledMethods = [RequestMethodEnum.POST, RequestMethodEnum.PUT, RequestMethodEnum.PATCH];

	if (!handledMethods.includes(req.method as RequestMethodEnum) || !req.url.includes('/order')) {
		return next(req);
	}


	const store = inject(Store);
	const notificationSettings = store.selectSnapshot(BusinessProfileState.notificationSettings);
	const askEmailNotifications = notificationSettings?.emailNotificationSettings?.sendNotificationConditionType === SendNotificationConditionEnum.ALLOW_BUT_ASK;
	const askSmsNotifications = notificationSettings?.smsNotificationSettings?.sendNotificationConditionType === SendNotificationConditionEnum.ALLOW_BUT_ASK;
	const needToShowNotificationsSettingModal = askEmailNotifications || askSmsNotifications;

	if (needToShowNotificationsSettingModal) {
		return from(notificationSettingsFromModal({
			askEmailNotifications,
			askSmsNotifications
		})).pipe(switchMap((resp) => {
			const updatedBody = {
				...req.body as object,
				// TODO move Receivers to UI settings
				notificationSettings: {
					sendNotification: Boolean(resp.data?.length),
					sendTypes: resp.data,
					sendReceivers: ['business', 'client']
				}
			}
			return next(req.clone({body: updatedBody}))
		}))
	}
	return next(req);
};

const notificationSettingsFromModal: (data: {
	askEmailNotifications: boolean,
	askSmsNotifications: boolean
}) => Promise<OverlayEventDetail<string[]>> = async (data) => {
	const {askEmailNotifications, askSmsNotifications} = data;
	const modalController = inject(ModalController);
	const modal = await modalController.create({
		component: NotificationSettingsComponent,
		backdropDismiss: false,
		componentProps: {
			askEmailNotifications,
			askSmsNotifications,
		}
	});
	await modal.present();
	return modal.onWillDismiss<string[]>();
}

