import {ECustomer} from '@tenant/customer/domain/entity/e.customer';
import {ICustomer} from '@tenant/customer/domain/interface/i.customer';
import {CustomerTypeEnum} from '@tenant/customer/domain/enum/customer-type.enum';
import {StateEnum} from "@core/shared/enum/state.enum";

describe('ECustomer', () => {
	let customerData: ICustomer.EntityRaw;

	beforeEach(() => {
		customerData = {
			_id: '1',
			createdAt: '2023-01-01T00:00:00Z',
			customerType: CustomerTypeEnum.new,
			email: 'test@example.com',
			firstName: 'John',
			lastName: 'Doe',
			note: 'Test note',
			object: 'CustomerDto',
			phone: '1234567890',
			state: StateEnum.active,
			stateHistory: [
				{
					state: StateEnum.active,
					setAt: new Date().toISOString(),
				},
			],
			updatedAt: '2023-01-01T00:00:00Z',
		};
	});

	it('should create an instance from raw data', () => {
		const customer = ECustomer.fromRaw(customerData);
		expect(customer).toBeInstanceOf(ECustomer);
		expect(customer._id).toBe(customerData._id);
	});

	it('should create an instance from DTO', () => {
		const customerDTO = ECustomer.toDTO(customerData);
		const customer = ECustomer.fromDTO(customerDTO);
		expect(customer).toBeInstanceOf(ECustomer);
		expect(customer._id).toBe(customerDTO._id);
	});

	it('should convert an instance to DTO', () => {
		const customer = ECustomer.fromRaw(customerData);
		const customerDTO = customer.toDTO();
		expect(customerDTO).toEqual(customerData);
	});

	it('should have correct default values', () => {
		const customer = ECustomer.fromRaw(customerData);
		expect(customer.object).toBe('CustomerDto');
	});

	it('should compare customers correctly', () => {
		const customer1 = ECustomer.fromRaw(customerData);
		const customer2 = ECustomer.fromRaw({...customerData, _id: '2'});
		const customer3 = ECustomer.fromRaw({...customerData, customerType: CustomerTypeEnum.regular});

		expect(ECustomer.isEqual(customer1.toDTO(), customer2.toDTO())).toBe(true);
		expect(ECustomer.isEqual(customer1.toDTO(), customer3.toDTO())).toBe(false);
	});
});
