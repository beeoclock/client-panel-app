import {EBusinessProfile} from '@tenant/business-profile/domain/entity/e.business-profile';
import {IBusinessProfile} from '@tenant/business-profile/domain/interface/i.business-profile';
import {ActiveEnum} from '@core/shared/enum';
import {BusinessClientStatusEnum} from '../enum/business-client-status.enum';
import {IBookingSettings} from "@tenant/business-profile/domain/interface/i.booking-settings";
import {IBusinessSettings, INotificationsSettings} from "@tenant/business-profile/domain";
import {StateEnum} from "@core/shared/enum/state.enum";

describe('EBusinessProfile', () => {
	let businessProfileData: IBusinessProfile.EntityRaw;

	beforeEach(() => {
		businessProfileData = {
			_id: '1',
			_version: '1.0',
			addresses: [],
			banners: [],
			bookingSettings: {} as IBookingSettings,
			businessSettings: {} as IBusinessSettings,
			contacts: [],
			createdAt: '2023-01-01T00:00:00Z',
			description: 'Test Business',
			facilities: [],
			feature: 'Feature',
			gallery: [],
			logo: null,
			name: 'Test Business',
			notificationSettings: {} as unknown as INotificationsSettings,
			object: 'BusinessProfileDto',
			paymentSettings: {externalApiCredentials: {stripe: {secretKey: 'sk_test', webhookSecret: 'wh_test'}}},
			publicPageSettings: {primaryColor: '#000000'},
			published: ActiveEnum.YES,
			schedules: [],
			socialNetworkLinks: [],
			specialSchedules: [],
			state: StateEnum.active,
			stateHistory: [
				{
					state: StateEnum.active,
					setAt: new Date().toISOString(),
				},
			],
			status: BusinessClientStatusEnum.ACTIVE,
			updatedAt: '2023-01-01T00:00:00Z',
			username: 'testuser',
		};
	});

	it('should create an instance from raw data', () => {
		const businessProfile = EBusinessProfile.fromRaw(businessProfileData);
		expect(businessProfile).toBeInstanceOf(EBusinessProfile);
		expect(businessProfile._id).toBe(businessProfileData._id);
	});

	it('should create an instance from DTO', () => {
		const businessProfileDTO = EBusinessProfile.toDTO(businessProfileData);
		const businessProfile = EBusinessProfile.fromDTO(businessProfileDTO);
		expect(businessProfile).toBeInstanceOf(EBusinessProfile);
		expect(businessProfile._id).toBe(businessProfileDTO._id);
	});

	it('should convert an instance to DTO', () => {
		const businessProfile = EBusinessProfile.fromRaw(businessProfileData);
		const businessProfileDTO = businessProfile.toDTO();
		expect(businessProfileDTO).toEqual(businessProfileData);
	});

	it('should have correct default values', () => {
		const businessProfile = EBusinessProfile.fromRaw(businessProfileData);
		expect(businessProfile.object).toBe('BusinessProfileDto');
	});

	it('should have 2 items in stateHistory when state changes', () => {
		const businessProfile = EBusinessProfile.fromRaw(businessProfileData);
		businessProfile.changeState(StateEnum.inactive);

		expect(businessProfile.stateHistory.length).toBe(2);
		expect(businessProfile.stateHistory[1].state).toBe(StateEnum.inactive);
		expect(businessProfile.state).toBe(StateEnum.inactive);
	});

	it('should be new', () => {
		const businessProfile = EBusinessProfile.fromRaw(businessProfileData);
		expect(businessProfile.isNew()).toBe(true);
	});

	it('should be synced', () => {
		const businessProfile = EBusinessProfile.fromRaw(businessProfileData);
		businessProfile.initSyncedAt();
		expect(businessProfile.isNew()).toBe(false);
	});

	it('should be synced and not updated', () => {
		const businessProfile = EBusinessProfile.fromRaw(businessProfileData);
		businessProfile.initSyncedAt();
		expect(businessProfile.isNew()).toBe(false);
		expect(businessProfile.isUpdated()).toBe(false);
	});

	it('should be updated', () => {
		const businessProfile = EBusinessProfile.fromRaw(businessProfileData);
		businessProfile.initSyncedAt();
		businessProfile.changeState(StateEnum.inactive);
		expect(businessProfile.isUpdated()).toBe(true);
		expect(businessProfile.isNew()).toBe(false);
	});

	it('should not be updated', () => {
		const businessProfile = EBusinessProfile.fromRaw(businessProfileData);
		// If syncedAt is not set, it should be as new entity
		businessProfile.changeState(StateEnum.inactive);
		expect(businessProfile.isUpdated()).toBe(false);
		expect(businessProfile.isNew()).toBe(true);
	});
});
