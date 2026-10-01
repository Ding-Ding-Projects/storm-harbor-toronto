import type { MarkerOptions } from 'leaflet';

export const selectedLocationMarkerOptions = {
  interactive: false,
  keyboard: false
} satisfies MarkerOptions;

export function hideDecorativeLocationIcon(element: HTMLElement | undefined): void {
  if (!element) return;
  element.setAttribute('aria-hidden', 'true');
  element.setAttribute('role', 'presentation');
}
