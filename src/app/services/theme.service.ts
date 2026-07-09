import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkThemeSubject = new BehaviorSubject<boolean>(this.getInitialTheme());
  isDarkTheme$ = this.darkThemeSubject.asObservable();

  constructor() {
    this.applyTheme(this.darkThemeSubject.value);
  }

  toggleTheme(): void {
    const newValue = !this.darkThemeSubject.value;
    this.darkThemeSubject.next(newValue);
    localStorage.setItem('crm_dark_theme', JSON.stringify(newValue));
    this.applyTheme(newValue);
  }

  isDark(): boolean {
    return this.darkThemeSubject.value;
  }

  private getInitialTheme(): boolean {
    const saved = localStorage.getItem('crm_dark_theme');
    if (saved !== null) {
      return JSON.parse(saved);
    }
    return false;
  }

  private applyTheme(isDark: boolean): void {
    if (isDark) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }
}
