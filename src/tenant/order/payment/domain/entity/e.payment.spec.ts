import {EPayment} from '@tenant/order/payment/domain/entity/e.payment';
import {IPayment} from '@tenant/order/payment/domain/interface/i.payment';
import {ICustomer} from '@tenant/customer/domain/interface/i.customer';
import {CurrencyCodeEnum} from '@core/shared/enum';
import {PaymentMethodEnum} from '@tenant/order/payment/domain/enum/payment.method.enum';
import {PaymentStatusEnum} from '@tenant/order/payment/domain/enum/payment.status.enum';
import {CustomerTypeEnum} from '@tenant/customer/domain/enum/customer-type.enum';
import {AnchorTypeEnum} from '@tenant/order/payment/domain/enum/anchor.type.enum';
import {StateEnum} from "@core/shared/enum/state.enum";

describe('EPayment', () => {
	let paymentData: IPayment.EntityRaw;

	beforeEach(() => {
		paymentData = {
			_id: '1',
			createdAt: '2023-01-01T00:00:00Z',
			amount: 100,
			currency: CurrencyCodeEnum.USD,
			method: PaymentMethodEnum.CASH,
			object: 'PaymentDto',
			orderId: 'order123',
			payer: {
				_id: 'customer1',
				createdAt: '2023-01-01T00:00:00Z',
				customerType: CustomerTypeEnum.new,
				email: 'test@example.com',
				firstName: 'John',
				lastName: 'Doe',
				note: 'Test note',
				object: 'CustomerDto',
				phone: '1234567890',
				state: 'active',
				stateHistory: [
					{
						state: 'active',
						setAt: new Date().toISOString(),
					},
				],
				updatedAt: '2023-01-01T00:00:00Z',
			} as ICustomer.EntityRaw,
			providerPaymentRef: 'ref123',
			anchorType: AnchorTypeEnum.order,
			state: StateEnum.active,
			stateHistory: [
				{
					state: StateEnum.active,
					setAt: new Date().toISOString(),
				},
			],
			status: PaymentStatusEnum.pending,
			updatedAt: '2023-01-01T00:00:00Z',
		};
	});

	it('should create an instance from raw data', () => {
		const payment = EPayment.fromRaw(paymentData);
		expect(payment).toBeInstanceOf(EPayment);
		expect(payment._id).toBe(paymentData._id);
	});

	it('should create an instance from DTO', () => {
		const paymentDTO = EPayment.toDTO(paymentData);
		const payment = EPayment.fromDTO(paymentDTO);
		expect(payment).toBeInstanceOf(EPayment);
		expect(payment._id).toBe(paymentDTO._id);
	});

	it('should convert an instance to DTO', () => {
		const payment = EPayment.fromRaw(paymentData);
		const paymentDTO = payment.toDTO();
		expect(paymentDTO).toEqual(paymentData);
	});

	it('should have correct default values', () => {
		const payment = EPayment.fromRaw(paymentData);
		expect(payment.object).toBe('PaymentDto');
	});

	it('should return correct payer string', () => {
		const payment = EPayment.fromRaw(paymentData);
		expect(payment.payerToString()).toBe('John Doe');
	});

	it('should return "-" for anonymous payer', () => {
		const anonymousPayerData = {
			...paymentData,
			payer: {...paymentData.payer, customerType: CustomerTypeEnum.anonymous}
		};
		const payment = EPayment.fromRaw(anonymousPayerData);
		expect(payment.payerToString()).toBe('-');
	});

	it('should return email if no name is provided', () => {
		const emailOnlyPayerData = {...paymentData, payer: {...paymentData.payer, firstName: null, lastName: null}};
		const payment = EPayment.fromRaw(emailOnlyPayerData);
		expect(payment.payerToString()).toBe('test@example.com');
	});

	it('should return phone if no name or email is provided', () => {
		const phoneOnlyPayerData = {
			...paymentData,
			payer: {...paymentData.payer, firstName: null, lastName: null, email: null}
		};
		const payment = EPayment.fromRaw(phoneOnlyPayerData);
		expect(payment.payerToString()).toBe('1234567890');
	});

	it('should return "-" if no payer information is provided', () => {
		const noPayerData = {...paymentData, payer: {} as ICustomer.EntityRaw};
		const payment = EPayment.fromRaw(noPayerData);
		expect(payment.payerToString()).toBe('-');
	});
});
