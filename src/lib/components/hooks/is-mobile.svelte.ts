import { writable, type Writable } from 'svelte/store';

const MOBILE_BREAKPOINT = 768; // Tailwind's md breakpoint

class IsMobile {
	private isMobileStore: Writable<boolean>;
	current: boolean = false;

	constructor() {
		// Initialize with server-side safe default
		this.isMobileStore = writable(false);

		// Only run client-side
		if (typeof window !== 'undefined') {
			const checkMobile = () => {
				const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
				this.current = isMobile;
				this.isMobileStore.set(isMobile);
			};

			// Initial check
			checkMobile();

			// Add resize listener
			window.addEventListener('resize', checkMobile);

			// Subscribe to store for reactivity
			this.isMobileStore.subscribe((value) => {
				this.current = value;
			});

			// Cleanup function (optional but good practice)
			if (typeof window !== 'undefined') {
				const cleanup = () => {
					window.removeEventListener('resize', checkMobile);
				};
				// Store cleanup reference if needed elsewhere
			}
		}
	}

	subscribe(fn: (value: boolean) => void) {
		return this.isMobileStore.subscribe(fn);
	}
}

export { IsMobile };
