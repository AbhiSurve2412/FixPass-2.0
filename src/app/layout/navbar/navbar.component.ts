import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LogoComponent } from '../../shared/logo/logo.component';

interface NavItem {
  label: string;
  route: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LogoComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  readonly menuOpen = signal(false);

  readonly navItems: NavItem[] = [
    { label: 'Study Material',      route: '/study' },
    { label: 'Placement Material',  route: '/placement' },
    { label: 'Jobs',                route: '/jobs' },
    { label: 'Discussion Hub',      route: '/discussion' },
    { label: 'Tools',               route: '/tools' },
    { label: 'Pricing',             route: '/pricing' },
  ];

  toggleMenu(): void {
    this.menuOpen.update(open => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
