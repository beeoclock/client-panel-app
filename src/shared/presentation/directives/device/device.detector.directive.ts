import {computed, DestroyRef, inject, Injectable, PLATFORM_ID, signal} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {BREAKPOINTS} from './device.tokens';
import type {BreakpointConfig, DeviceKind, Orientation} from './device.types';

@Injectable({ providedIn: 'root' })
export class DeviceDetectorService {
	private readonly platformId = inject(PLATFORM_ID);
	private readonly destroyRef = inject(DestroyRef);
	private readonly bps = inject<BreakpointConfig>(BREAKPOINTS);
	private readonly isBrowser = isPlatformBrowser(this.platformId);

	// 🇺🇦 розміри екрана
	private width  = signal<number>(this.getWidth());
	private height = signal<number>(this.getHeight());

	// 🇺🇦 орієнтація
	public readonly orientation = computed<Orientation>(() => {
		if (!this.isBrowser) return 'landscape';
		const mm = window.matchMedia?.('(orientation: portrait)');
		if (mm && typeof mm.matches === 'boolean') return mm.matches ? 'portrait' : 'landscape';
		return this.width() <= this.height() ? 'portrait' : 'landscape';
	});

	// 🇺🇦 тип пристрою
	readonly kind = computed<DeviceKind>(() => this.widthToKind(this.width(), this.bps));

	public constructor() {
		if (!this.isBrowser) return;

		const onResize = () => {
			queueMicrotask(() => {
				this.width.set(this.getWidth());
				this.height.set(this.getHeight());
			});
		};
		const onOri = onResize;

		window.addEventListener('resize', onResize, { passive: true });
		window.addEventListener('orientationchange', onOri, { passive: true });
		const mm = window.matchMedia?.('(orientation: portrait)');
		mm?.addEventListener?.('change', onOri);

		this.destroyRef.onDestroy(() => {
			window.removeEventListener('resize', onResize);
			window.removeEventListener('orientationchange', onOri);
			mm?.removeEventListener?.('change', onOri as EventListener);
		});
	}

	// 🇺🇦 предикати
	public matchesKind(k: DeviceKind | DeviceKind[]) {
		const list = Array.isArray(k) ? k : [k];
		return list.includes(this.kind());
	}

	public matchesOrientation(o: Orientation | Orientation[]) {
		const list = Array.isArray(o) ? o : [o];
		return list.includes(this.orientation());
	}

	public matches(k: DeviceKind | DeviceKind[], o?: Orientation | Orientation[]) {
		return this.matchesKind(k) && (o ? this.matchesOrientation(o) : true);
	}

	// helpers
	private getWidth(): number {
		if (!this.isBrowser) return 1024;
		return window.innerWidth || document.documentElement.clientWidth || 1024;
	}
	private getHeight(): number {
		if (!this.isBrowser) return 768;
		return window.innerHeight || document.documentElement.clientHeight || 768;
	}
	private widthToKind(w: number, bp: BreakpointConfig): DeviceKind {
		if (w <= bp.phoneMax) return 'phone';
		if (w <= bp.tabletMax) return 'tablet';
		if (w <= bp.computerMax) return 'computer';
		return 'tv';
	}
}
