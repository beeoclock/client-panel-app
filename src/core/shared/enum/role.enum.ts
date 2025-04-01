/**
 * Example how to use role for user: [RoleEnum.CUSTOMER]
 * Example how to use role for user who has access to any company: [RoleEnum.CUSTOMER, RoleEnum.MEMBER]
 */
export enum RoleEnum {
  GUEST = 'GUEST', // Any guest which is unauthorized
  CUSTOMER = 'CUSTOMER', // Any authorized user
  ADMIN = 'ADMIN',
  OWNER = 'OWNER',
  SPECIALIST = 'SPECIALIST', // Any authorized user who has access to any company, user can have more than 1 access, the role only for to know if user can go to panel.beeoclock.com
}
