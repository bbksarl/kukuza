import { Component, inject, input, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LanguageService } from '../core/language.service';
@Component({
  selector: 'k-auth-field',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: ` <div class="space-y-0.5 xs:space-y-1 sm:space-y-1.5">
    <label [for]="name()" class="block text-[0.688rem] xs:text-xs sm:text-sm font-medium text-white/80">{{
      label()
    }}</label>
    <div class="relative">
      <input
        [formControl]="control()"
        [type]="type() === 'password' && visible() ? 'text' : type()"
        [id]="name()"
        [name]="name()"
        [autocomplete]="autocomplete()"
        [placeholder]="placeholder()"
        class="auth-input"
        [class.pr-10]="type() === 'password'"
        [attr.aria-invalid]="!!error() && control().touched"
        [attr.aria-describedby]="error() && control().touched ? name() + '-error' : null"
        (blur)="control().markAsTouched()"
      />
      @if (type() === 'password') {
        <button
          type="button"
          class="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-white/60"
          [attr.aria-label]="visible() ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
          [attr.aria-pressed]="visible()"
          (click)="visible.set(!visible())"
        >
          ◉
        </button>
      }
    </div>
    @if (error() && control().touched) {
      <p [id]="name() + '-error'" class="text-xs text-red-300">{{ lang.text(error()) }}</p>
    }
  </div>`,
})
export class AuthFieldComponent {
  readonly control = input.required<FormControl<string>>();
  readonly name = input.required<string>();
  readonly label = input.required<string>();
  readonly type = input('text');
  readonly placeholder = input('');
  readonly error = input('');
  readonly autocomplete = input('off');
  readonly visible = signal(false);
  readonly lang = inject(LanguageService);
}
