import {Directive, effect, input, TemplateRef, ViewContainerRef} from '@angular/core';
import type {DeviceKind, Orientation} from './device.types';
import {DeviceDetectorService} from "@shared/presentation/directives/device/device.detector.directive";

// 🇺🇦 Підтримка shorthand: 'phone:portrait'
type Filter =
	| DeviceKind
	| `${DeviceKind}:${Orientation}`;

@Directive({
	selector: '[ifDevice]',
	standalone: true,
})
export class AppIfDeviceDirective {
	// 🇺🇦 що включати: kind або масив kind/shorthand
	public readonly ifDevice = input.required<Filter | Filter[]>();

	// 🇺🇦 орієнтація як окремий параметр (необов’язково)
	// приклад: *appIfDevice="'phone'; orientation: 'portrait'"
	public readonly ifDeviceOrientation = input<Orientation | Orientation[] | null>(null);

	// 🇺🇦 else-шаблон
	public readonly ifDeviceElse = input<TemplateRef<unknown> | null>(null);

	private hasView = false;

	public constructor(
		private readonly tpl: TemplateRef<unknown>,
		private readonly vcr: ViewContainerRef,
		private readonly device: DeviceDetectorService
	) {
		effect(() => {
			const filters = this.normalize(this.ifDevice());
			const explicitOri = this.ifDeviceOrientation();

			const show = filters.some(f => {
				const kindOk = this.device.matchesKind(f.kinds);
				const oriOk =
					explicitOri
						? this.device.matchesOrientation(explicitOri)
						: f.orientation
							? this.device.matchesOrientation(f.orientation)
							: true;
				return kindOk && oriOk;
			});

			this.render(show);
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
			const elseT = this.ifDeviceElse();
			if (elseT) this.vcr.createEmbeddedView(elseT);
			this.hasView = false;
		}
	}
}
