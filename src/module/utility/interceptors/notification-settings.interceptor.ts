import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from "@angular/core";
import {ModalController} from "@ionic/angular";
import {from, switchMap} from "rxjs";
import {
	NotificationSettingsComponent
} from "@order/presentation/component/notification-settings/notification-settings.component";
import {Store} from "@ngxs/store";
import {ClientState} from "@client/state/client/client.state";
import {SendNotificationConditionEnum} from "@utility/domain/enum/send-notification-condition.enum";
import {OverlayEventDetail} from "@ionic/core/dist/types/utils/overlays-interface";


export const NotificationSettingsInterceptor: HttpInterceptorFn = (req, next) => {

	const handledMethods = ['POST', 'PUT', 'DELETE'];
	const store = inject(Store);
	const notificationSettings = store.selectSnapshot(ClientState.notificationSettings);
	const askEmailNotifications = notificationSettings?.emailNotificationSettings.sendNotificationConditionType === SendNotificationConditionEnum.ALLOW_BUT_ASK;
	const askSmsNotifications = notificationSettings?.smsNotificationSettings.sendNotificationConditionType === SendNotificationConditionEnum.ALLOW_BUT_ASK;
	const needToShowNotificationsSettingModal = handledMethods.includes(req.method) && req.url.includes('/order') && (askEmailNotifications || askSmsNotifications)

	if (needToShowNotificationsSettingModal) {
		return from(notificationSettingsFromModal({
			askEmailNotifications,
			askSmsNotifications
		})).pipe(switchMap((resp) => {
			const updatedBody = {
				...req.body as object,
				// TODO move Receivers to UI settings
				notificationSettings: {sendNotification: resp.data?.length, sendTypes: resp.data, sendReceivers: ['business', 'client']}
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

