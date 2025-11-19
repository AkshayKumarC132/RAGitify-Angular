import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      identifier: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const identifier: string = (this.loginForm.get('identifier')?.value || '').trim();
      const password: string = this.loginForm.get('password')?.value;

      if (!identifier) {
        this.isLoading = false;
        this.errorMessage = 'Please enter your email or username.';
        return;
      }

      const credentials: LoginRequest = { password };
      if (identifier.includes('@')) {
        credentials.email = identifier;
      } else {
        credentials.username = identifier;
      }

      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Login failed. Please check your credentials.';
        }
      });
    }
  }

  get identifier() { return this.loginForm.get('identifier'); }
  get password() { return this.loginForm.get('password'); }
}