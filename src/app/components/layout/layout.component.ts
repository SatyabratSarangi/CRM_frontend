import { Component, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnDestroy {
  username = '';
  sidebarCollapsed = false;
  private subs = new Subscription();
  deferredPrompt: any;
  showInstallButton = false;

  @HostListener('window:beforeinstallprompt', ['$event'])
  onbeforeinstallprompt(e: any) {
    e.preventDefault();
    this.deferredPrompt = e;
    this.showInstallButton = true;
  }

  installPwa(): void {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      this.deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        }
        this.deferredPrompt = null;
        this.showInstallButton = false;
      });
    }
  }

  navItems = [
    { icon: 'dashboard', label: 'Dashboard', route: '/dashboard' },
    { icon: 'people', label: 'Leads', route: '/leads' },
    { icon: 'person_add', label: 'Add Lead', route: '/leads/new' },
    { icon: 'category', label: 'Lead Types', route: '/lead-types' }
  ];

  constructor(
    private authService: AuthService, 
    private router: Router,
    private themeService: ThemeService
  ) {
    this.subs.add(
      this.authService.currentUser$.subscribe(u => this.username = u)
    );
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  isDarkTheme(): boolean {
    return this.themeService.isDark();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}

