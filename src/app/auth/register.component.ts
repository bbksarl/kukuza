import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { registerValidationSchema, boutiqueValidationSchema } from '@/features/auth/utils/validation';
import { LanguageService } from '../core/language.service';
import { SessionService } from '../core/session.service';
import { SeoService } from '../core/seo.service';
import { AuthLayoutComponent } from './auth-layout.component';
import { AuthFieldComponent } from './auth-field.component';
@Component({
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, AuthLayoutComponent, AuthFieldComponent],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  readonly lang = inject(LanguageService);
  readonly t = this.lang.t;
  readonly session = inject(SessionService);
  private readonly router = inject(Router);
  readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true }),
    username: new FormControl('', { nonNullable: true }),
    email: new FormControl('', { nonNullable: true }),
    password: new FormControl('', { nonNullable: true }),
    confirmPassword: new FormControl('', { nonNullable: true }),
    isBoutique: new FormControl(false, { nonNullable: true }),
  });
  readonly boutique = new FormGroup({
    shopName: new FormControl('', { nonNullable: true }),
    address: new FormControl('', { nonNullable: true }),
    postalCode: new FormControl('', { nonNullable: true }),
    country: new FormControl('Mali', { nonNullable: true }),
    phoneNumber: new FormControl('', { nonNullable: true }),
    description: new FormControl('', { nonNullable: true }),
    countryCode: new FormControl('+221', { nonNullable: true }),
  });
  readonly fields = [
    { name: 'name', key: 'fullName', type: 'text' },
    { name: 'username', key: 'username', type: 'text' },
    { name: 'email', key: 'email', type: 'email' },
    { name: 'password', key: 'password', type: 'password' },
    { name: 'confirmPassword', key: 'confirmPassword', type: 'password' },
  ] as const;
  readonly shopFields = [
    { name: 'shopName', key: 'shopName' },
    { name: 'address', key: 'address' },
    { name: 'postalCode', key: 'postalCode' },
    { name: 'phoneNumber', key: 'phone' },
    { name: 'description', key: 'description' },
  ] as const;
  readonly countries = [
    'Mali',
    'Sénégal',
    "Côte d'Ivoire",
    'Burkina Faso',
    'Niger',
    'Bénin',
    'Togo',
    'Guinée',
    'France',
    'Autre',
  ];
  readonly errors = signal<Record<string, string>>({});
  readonly shopStep = signal(false);
  readonly logo = signal<File | null>(null);
  readonly logoPreview = signal('');
  readonly imageError = signal('');
  constructor() {
    inject(SeoService).update(
      'Inscription | KUKUZA',
      'Créez votre compte KUKUZA.',
      '/auth/register',
      undefined,
      undefined,
      true,
    );
    inject(DestroyRef).onDestroy(() => this.clearPreview());
  }
  private clearPreview(): void {
    if (this.logoPreview()) URL.revokeObjectURL(this.logoPreview());
  }
  chooseLogo(file?: File): void {
    if (this.session.busy() || !file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      this.imageError.set(this.t('shop.invalidEditImage'));
      return;
    }
    this.imageError.set('');
    this.clearPreview();
    this.logo.set(file);
    this.logoPreview.set(URL.createObjectURL(file));
  }
  drop(event: DragEvent): void {
    event.preventDefault();
    this.chooseLogo(event.dataTransfer?.files[0]);
  }
  async submit(): Promise<void> {
    if (this.session.busy()) return;
    this.form.markAllAsTouched();
    const account = registerValidationSchema.safeParse(this.form.getRawValue());
    this.errors.set(
      account.success
        ? {}
        : Object.fromEntries(account.error.issues.map((issue) => [String(issue.path[0]), issue.message])),
    );
    if (!account.success) return;
    if (this.form.controls.isBoutique.value && !this.shopStep()) {
      this.shopStep.set(true);
      return;
    }
    const shop = boutiqueValidationSchema.safeParse(this.boutique.getRawValue());
    if (this.form.controls.isBoutique.value) {
      this.boutique.markAllAsTouched();
      if (!shop.success) {
        this.errors.set(
          Object.fromEntries(shop.error.issues.map((issue) => [String(issue.path[0]), issue.message])),
        );
        return;
      }
    }
    const { confirmPassword: _confirmation, ...user } = account.data;
    try {
      const result = await this.session.register({
        ...user,
        isBoutique: this.form.controls.isBoutique.value,
        ...(this.form.controls.isBoutique.value && shop.success
          ? {
              boutique: {
                ...shop.data,
                phoneNumber: this.boutique.controls.countryCode.value + shop.data.phoneNumber,
                logo: this.logo(),
              },
            }
          : {}),
      });
      await this.router.navigateByUrl(result.role === 'creator' ? '/shop/dashboard' : '/', {
        replaceUrl: true,
      });
    } catch {
      /* Inputs remain available for retry. */
    }
  }
}
