import {ActiveEnum} from '@utility/domain/enum/active.enum';

export interface ISettings {
  _id: string;
  id: 'settings';

  name: string;
  description: string;
  active: ActiveEnum;
}
