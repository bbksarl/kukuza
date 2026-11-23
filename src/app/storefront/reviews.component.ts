import { Component, effect, inject, input, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReviewsDataService, type ProductReview } from './reviews-data.service';
import { LanguageService } from '../core/language.service';
@Component({
  selector: 'k-reviews',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: ` <section class="mt-12 rounded-lg bg-white p-8">
    <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4 rounded-lg bg-gray-50 p-4">
      <h2 class="font-semibold">{{ t('reviews.add') }}</h2>
      <label class="block"
        >{{ t('reviews.rating')
        }}<select formControlName="rating" class="ml-3 rounded border p-2">
          @for (rating of [1, 2, 3, 4, 5]; track rating) {
            <option [ngValue]="rating">{{ rating }} ★</option>
          }
        </select>
      </label>
      <label for="review-content" class="block">{{ t('reviews.yourReview') }}</label>
      <textarea
        id="review-content"
        formControlName="content"
        rows="4"
        class="w-full rounded-lg border p-2"
        [placeholder]="t('reviews.placeholder')"
      ></textarea>
      <button
        type="submit"
        [disabled]="busy() || form.invalid"
        class="rounded bg-teal-700 px-4 py-2 text-white disabled:opacity-50"
      >
        {{ busy() ? t('reviews.submitting') : t('reviews.submit') }}
      </button>
    </form>
    <h2 class="my-5 font-semibold">{{ t('reviews.title', { value: reviews().length }) }}</h2>
    @if (error()) {
      <p role="alert" class="text-red-600">{{ error() }}</p>
    }
    @if (loading()) {
      <p role="status">{{ t('reviews.loading') }}</p>
    } @else if (!reviews().length) {
      <p class="text-slate-500">{{ t('reviews.empty') }}</p>
    }
    @for (review of reviews(); track review.id) {
      <article class="border-b py-4">
        <h3>{{ review.userName }} · {{ review.rating }} ★</h3>
        <p class="mt-2 text-slate-700">{{ review.content }}</p>
      </article>
    }
  </section>`,
})
export class ReviewsComponent {
  readonly productId = input.required<string>();
  readonly t = inject(LanguageService).t;
  private readonly data = inject(ReviewsDataService);
  readonly reviews = signal<ProductReview[]>([]);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly busy = signal(false);
  readonly form = new FormGroup({
    rating: new FormControl(5, { nonNullable: true, validators: [Validators.min(1), Validators.max(5)] }),
    content: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });
  constructor() {
    effect(() => {
      void this.load(this.productId());
    });
  }
  private async load(id: string): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    try {
      const reviews = await this.data.list(id);
      if (id === this.productId()) this.reviews.set(reviews);
    } catch {
      this.error.set(this.t('catalog.unavailable'));
    } finally {
      this.loading.set(false);
    }
  }
  async submit(): Promise<void> {
    if (this.busy() || this.form.invalid || !this.form.controls.content.value.trim()) return;
    this.busy.set(true);
    this.error.set('');
    try {
      const review = await this.data.create(this.productId(), this.form.getRawValue());
      this.reviews.update((reviews) => [...reviews, review]);
      this.form.reset();
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : this.t('catalog.unavailable'));
    } finally {
      this.busy.set(false);
    }
  }
}
