export interface IBaseEntity<OBJECT_TYPE extends string> {

  // Added by the system
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
  object?: OBJECT_TYPE;

}
export type RIBaseEntity<OBJECT_TYPE extends string> = Required<IBaseEntity<OBJECT_TYPE>>;
