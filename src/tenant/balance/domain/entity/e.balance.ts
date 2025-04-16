import {CurrencyCodeEnum} from "@core/shared/enum";
import {ABaseEntity} from "@core/system/abstract/a.base-entity";
import {IBalance} from "@tenant/balance/domain";


export class EBalance extends ABaseEntity<'BalanceDto', IBalance.DTO, IBalance.EntityRaw> implements IBalance.EntityRaw {

	override object = 'BalanceDto' as const;

    action!: IBalance.IAction;
    amountAfterAction!: number;
    amountBeforeAction!: number;
    currency!: CurrencyCodeEnum;

	public override toDTO(): IBalance.DTO {
		return EBalance.toDTO(this);
	}

	public static toDTO(data: IBalance.EntityRaw): IBalance.DTO {
		return {
			amountBeforeAction: data.amountBeforeAction,
			amountAfterAction: data.amountAfterAction,
			currency: data.currency,
			action: data.action,

			_id: data._id,
			state: data.state,
			object: data.object,
			updatedAt: data.updatedAt,
			createdAt: data.createdAt,
			stateHistory: data.stateHistory,
		};
	}

	public amountIsPositive(): boolean {
		return this.amountAfterAction > 0;
	}

	public amountIsNegative(): boolean {
		return this.amountAfterAction < 0;
	}

	public amountIsZero(): boolean {
		return this.amountAfterAction === 0;
	}

	/**
	 * Use it to create new entity, e.g. from API or form
	 * @param data
	 */
	public static fromDTO(data: IBalance.DTO): EBalance {
		return new EBalance(data);
	}

	/**
	 * Use it to create entity from raw data, e.g. from database
	 * @param data
	 */
	public static fromRaw(data: IBalance.EntityRaw): EBalance {
		return new EBalance(data);
	}

}

export default EBalance;
