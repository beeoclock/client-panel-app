import {RIBaseEntity} from "@src/module/utility/domain";

export interface IPresentation extends RIBaseEntity<'Service.Presentation'> {
  banners: string[];
}
