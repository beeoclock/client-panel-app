// app-if-not-device.directive.ts
import {Directive, effect, input, TemplateRef, ViewContainerRef} from '@angular/core';
import type {DeviceKind, Orientation} from './device.types';
import {DeviceDetectorService} from "@shared/presentation/directives/device/device.detector.directive";

type Filter =
	| DeviceKind
	| `${DeviceKind}:${Orientation}`;

@Directive({
	selector: '[ifNotDevice]',
	standalone: true,
})
export class AppIfNotDeviceDirective {
	public readonly ifNotDevice = input.required<Filter | Filter[]>();
	public readonly ifNotDeviceOrientation = input<Orientation | Orientation[] | null>(null);
	public readonly ifNotDeviceElse = input<TemplateRef<unknown> | null>(null);

	private hasView = false;

	public constructor(
		private readonly tpl: TemplateRef<unknown>,
		private readonly vcr: ViewContainerRef,
		private readonly device: DeviceDetectorService
	) {
		effect(() => {
			const filters = this.normalize(this.ifNotDevice());
			const explicitOri = this.ifNotDeviceOrientation();

			const matched = filters.some(f => {
				const kindOk = this.device.matchesKind(f.kinds);
				const oriOk =
					explicitOri
						? this.device.matchesOrientation(explicitOri)
						: f.orientation
							? this.device.matchesOrientation(f.orientation)
							: true;
				return kindOk && oriOk;
			});

			this.render(!matched); // показуємо, якщо НЕ збіглось
		});
	}

	private normalize(val: Filter | Filter[]): { kinds: DeviceKind | DeviceKind[]; orientation?: Orientation | Orientation[] }[] {
		const arr = Array.isArray(val) ? val : [val];
		return arr.map(item => {
			if (typeof item === 'string' && item.includes(':')) {
				const [k, o] = item.split(':') as [DeviceKind, Orientation];
				return { kinds: k, orientation: o };
			}
			return { kinds: item as DeviceKind };
		});
	}

	private render(show: boolean) {
		if (show && !this.hasView) {
			this.vcr.clear();
			this.vcr.createEmbeddedView(this.tpl);
			this.hasView = true;
		} else if (!show) {
			this.vcr.clear();
			const elseT = this.ifNotDeviceElse();
			if (elseT) this.vcr.createEmbeddedView(elseT);
			this.hasView = false;
		}
	}
}
