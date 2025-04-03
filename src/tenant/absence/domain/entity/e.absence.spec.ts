import {EAbsence} from '@tenant/absence/domain/entity/e.absence';
import {IAbsence} from '@tenant/absence/domain/interface/i.absence';
import {AbsenceTypeEnum} from '@tenant/absence/domain/enums/absence.type.enum';
import {StateEnum} from "@core/shared/enum/state.enum";

describe('EAbsence', () => {
	let absenceData: IAbsence.EntityRaw;

	beforeEach(() => {
		absenceData = {
			_id: '1',
			_version: '1',
			entireBusiness: true,
			members: [],
			note: 'Vacation',
			object: 'AbsenceDto',
			state: StateEnum.active,
			start: '2023-01-01T00:00:00Z',
			end: '2023-01-10T00:00:00Z',
			stateHistory: [
				{
					state: StateEnum.active,
					setAt: new Date().toISOString(),
				},
			],
			timeZone: 'UTC',
			type: AbsenceTypeEnum.vacation,
			updatedAt: '2023-01-01T00:00:00Z',
			createdAt: '2023-01-01T00:00:00Z',
		};
	});

	it('should create an instance from raw data', () => {
		const absence = EAbsence.fromRaw(absenceData);
		expect(absence).toBeInstanceOf(EAbsence);
		expect(absence._id).toBe(absenceData._id);
	});

	it('should create an instance from DTO', () => {
		const absenceDTO = EAbsence.toDTO(absenceData);
		const absence = EAbsence.fromDTO(absenceDTO);
		expect(absence).toBeInstanceOf(EAbsence);
		expect(absence._id).toBe(absenceDTO._id);
	});

	it('should convert an instance to DTO', () => {
		const absence = EAbsence.fromRaw(absenceData);
		const absenceDTO = absence.toDTO();
		expect(absenceDTO).toEqual(absenceData);
	});

	it('should have correct default values', () => {
		const absence = EAbsence.fromRaw(absenceData);
		expect(absence.object).toBe('AbsenceDto');
	});

	it('should have 2 items in stateHistory when state changes', () => {
		const absence = EAbsence.fromRaw(absenceData);
		absence.changeState(StateEnum.inactive);

		expect(absence.stateHistory.length).toBe(2);
		expect(absence.stateHistory[1].state).toBe(StateEnum.inactive);
		expect(absence.state).toBe(StateEnum.inactive);
	});

	it('should be new', () => {
		const absence = EAbsence.fromRaw(absenceData);
		expect(absence.isNew()).toBe(true);
	});

	it('should be synced', () => {
		const absence = EAbsence.fromRaw(absenceData);
		absence.initSyncedAt();
		expect(absence.isNew()).toBe(false);
	});

	it('should be synced and not updated', () => {
		const absence = EAbsence.fromRaw(absenceData);
		absence.initSyncedAt();
		expect(absence.isNew()).toBe(false);
		expect(absence.isUpdated()).toBe(false);
	});

	it('should be updated', () => {
		const absence = EAbsence.fromRaw(absenceData);
		absence.initSyncedAt();
		absence.changeState(StateEnum.inactive);
		expect(absence.isUpdated()).toBe(true);
		expect(absence.isNew()).toBe(false);
	});

	it('should not be updated', () => {
		const absence = EAbsence.fromRaw(absenceData);
		// If syncedAt is not set, it should be as new entity
		absence.changeState(StateEnum.inactive);
		expect(absence.isUpdated()).toBe(false);
		expect(absence.isNew()).toBe(true);
	});

});
