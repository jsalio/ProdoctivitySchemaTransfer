import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { Credentials } from '../../types/models/Credentials';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private readonly formBuilder = inject(FormBuilder);

  form: FormGroup = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    serverInformation: this.formBuilder.group({
      server: ['', Validators.required],
      apiKey: ['', Validators.required],
      apiSecret: ['', Validators.required],
      organization: ['', Validators.required],
      dataBase: ['', Validators.required]
    }),
    store: [''],
    token: ['']
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const credentials = this.form.value as Credentials;
    // console.log('Submitting credentials', credentials);
  }
} 