import {inject, Pipe, PipeTransform} from "@angular/core";
import {TENANT_ID} from "@src/token";

@Pipe({
    standalone: true,
    name: 'withTenantId'
})
export class WithTenantIdPipe implements PipeTransform {

    private readonly tenantId$ = inject(TENANT_ID);

    /**
     * Author: Ivan Karbashevskyi
     * @param target
     */
    public transform(target: string | string[] | undefined): string | string[] {

        if (!target) {
            return '';
        }

        const tenantId = this.tenantId$.value;

        if (!tenantId) {
            return target;
        }

        if (Array.isArray(target)) {
            return ['/', tenantId, ...target];
        }

        return `/${tenantId}/${target}`;

    }

}
