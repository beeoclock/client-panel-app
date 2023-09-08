import {RIBaseEntity} from "@src/module/utility/domain";

export interface IPresentation extends RIBaseEntity {
  object: 'Service.Presentation';
  banners: string[];
}
