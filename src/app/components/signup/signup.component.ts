import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnDestroy {
  form: FormGroup;
  loading = false;
  private subs = new Subscription();

  roles = [
    { value: 'EXECUTIVE', label: 'Executive' },
    { value: 'MANAGER', label: 'Manager' },
    { value: 'SALES', label: 'Sales Representative' },
    { value: 'SUPPORT', label: 'Support Specialist' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private themeService: ThemeService
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      confirmPassword: ['', Validators.required],
      role: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  isDarkTheme(): boolean {
    return this.themeService.isDark();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  passwordMatchValidator(g: FormGroup) {
    const pass = g.get('password')?.value;
    const confirmPass = g.get('confirmPassword')?.value;
    return pass === confirmPass ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;

    const { username, password, role } = this.form.value;

    this.subs.add(
      this.authService.signup({ username, password, role }).subscribe({
        next: () => {
          this.snackBar.open('Registration successful! Please login.', 'Close', { duration: 3000 });
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.loading = false;
          this.snackBar.open(err.error?.message || 'Registration failed', 'Close', { duration: 3000 });
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
