import {ActiveEnum} from '@company/form/settings.form';

export interface ISettings {
  name: string;
  description: string;
  active: ActiveEnum;
}
