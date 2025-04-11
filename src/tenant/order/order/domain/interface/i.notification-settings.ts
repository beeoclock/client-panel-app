export interface INotificationSettings {
	object: "OrderNotificationSettingsDto";
	sendNotification: boolean;
	sendTypes: string[]; // email, sms
	sendReceivers: string[]; // business, client
}
