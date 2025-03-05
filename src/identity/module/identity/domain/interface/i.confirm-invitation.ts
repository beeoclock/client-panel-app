export interface IConfirmInvitation {
	invitationCode: string;
	password: string;
	tenantId: string;
	email: string;
	businessName: string;
}

export type IQueryParamsConfirmInvitation = Partial<IConfirmInvitation>;
export type IBodyConfirmInvitation = Pick<IConfirmInvitation, 'invitationCode' | 'password' | 'tenantId'>
