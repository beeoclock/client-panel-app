export interface IBaseEntity {

  // Added by the system
  _id?: string;
  createdAt?: string;
  updatedAt?: string;

}
export type RIBaseEntity = Required<IBaseEntity>;
