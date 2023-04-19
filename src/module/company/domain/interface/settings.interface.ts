import {ActiveEnum} from '@utility/domain/enum/active.enum';

export interface ISettings {
  name: string;
  description: string;
  active: ActiveEnum;
}
