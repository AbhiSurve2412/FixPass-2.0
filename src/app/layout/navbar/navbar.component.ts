import { Component, HostListener, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LogoComponent } from '../../shared/logo/logo.component';
import { NAV_ITEMS, NavItem } from './nav.config';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LogoComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  readonly navItems: NavItem[] = NAV_ITEMS;

  // Desktop mega-menu: tracks which item label has its menu open
  readonly activeMenu = signal<string | null>(null);

  // Mobile: overall panel visibility
  readonly mobileOpen = signal(false);

  // Mobile: which accordion section is expanded
  readonly expandedMobileItem = signal<string | null>(null);

  // ── Desktop ──────────────────────────────────────────────────

  openDesktopMenu(label: string): void {
    this.activeMenu.set(label);
  }

  closeDesktopMenu(): void {
    this.activeMenu.set(null);
  }

  // ── Mobile ───────────────────────────────────────────────────

  toggleMobileMenu(): void {
    const next = !this.mobileOpen();
    this.mobileOpen.set(next);
    if (!next) this.expandedMobileItem.set(null);
  }

  closeMobileMenu(): void {
    this.mobileOpen.set(false);
    this.expandedMobileItem.set(null);
  }

  toggleMobileItem(label: string): void {
    this.expandedMobileItem.update(current =>
      current === label ? null : label
    );
  }

  // ── Global ───────────────────────────────────────────────────

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeDesktopMenu();
    this.closeMobileMenu();
  }
}
