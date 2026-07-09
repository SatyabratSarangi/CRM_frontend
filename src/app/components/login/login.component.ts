import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnDestroy {
  loginForm: FormGroup;
  loading = false;
  hidePassword = true;
  private subs = new Subscription();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private themeService: ThemeService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  isDarkTheme(): boolean {
    return this.themeService.isDark();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.loading = true;

    this.subs.add(
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.snackBar.open('Login successful!', 'Close', { duration: 2000 });
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.loading = false;
          this.snackBar.open(err.error?.message || 'Invalid credentials', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
