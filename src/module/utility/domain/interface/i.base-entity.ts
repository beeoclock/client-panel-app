import {tags} from "typia";

export interface IBaseEntity<OBJECT_TYPE extends string> {

  // Added by the system
  _id: string & tags.Pattern<'^(?=[a-f\\d]{24}$)(\\d+[a-f]|[a-f]+\\d)'>;
  createdAt: string & tags.Format<'date-time'>;
  updatedAt: string & tags.Format<'date-time'>;
  object: OBJECT_TYPE;

}
export type RIBaseEntity<OBJECT_TYPE extends string> = Required<IBaseEntity<OBJECT_TYPE>>;
