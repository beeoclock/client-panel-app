import {inject} from "@angular/core";
import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from "@angular/router";
import {IEvent} from "@event/domain";
import {FormRepository} from "@event/repository/form.repository";

export const eventPreviewResolver: ResolveFn<IEvent | undefined> = (
  route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot
) => {

  const formRepository = inject(FormRepository);
  const data = formRepository.form.getRawValue() as IEvent;

  if (!data || formRepository.form.invalid) {
    return undefined;
  }

  return data;
};
