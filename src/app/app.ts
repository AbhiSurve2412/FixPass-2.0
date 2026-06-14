import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly isAdminRoute = signal(false);

  constructor() {
    const router = inject(Router);
    router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(e => {
        this.isAdminRoute.set((e as NavigationEnd).urlAfterRedirects.startsWith('/admin'));
      });
  }
}
