import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LanguageService } from '../core/language.service';
import { SeoService } from '../core/seo.service';
import { StudioDataService } from './studio-data.service';
import type { ProductFormValues } from '@/features/shop/types';
import {
  createEmptyProductForm,
  getGenderOptions,
  toCreateProductInput,
  validateProductForm,
} from '@/features/shop/utils/productForm';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-studio-product.component.html',
})
export class AddStudioProductComponent {
  readonly lang = inject(LanguageService);
  readonly t = this.lang.t;
  private readonly data = inject(StudioDataService);
  private readonly destroyRef = inject(DestroyRef);
  readonly categories = signal<Awaited<ReturnType<StudioDataService['categories']>>>([]);
  readonly images = signal<File[]>([]);
  readonly preview = signal('');
  readonly busy = signal(false);
  readonly error = signal('');
  readonly success = signal('');
  readonly fields = [
    { name: 'name', key: 'shop.itemName', type: 'text' },
    { name: 'price', key: 'shop.itemPrice', type: 'number' },
    { name: 'quantity', key: 'shop.itemQuantity', type: 'number' },
  ] as const;
  readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true }),
    category: new FormControl('', { nonNullable: true }),
    price: new FormControl('', { nonNullable: true }),
    quantity: new FormControl('', { nonNullable: true }),
    ageRange: new FormControl('', { nonNullable: true }),
    gender: new FormControl('', { nonNullable: true }),
  });
  readonly genders = computed(() => getGenderOptions(this.form.controls.ageRange.value));

  private previewUrl = '';

  constructor() {
    this.destroyRef.onDestroy(() => this.releasePreview());
    inject(SeoService).update(
      'Ajouter un produit | KUKUZA',
      'Publiez un produit dans votre boutique.',
      '/shop/produits/ajouter',
      undefined,
      undefined,
      true,
    );
    void this.data
      .categories()
      .then((categories) => this.categories.set(categories))
      .catch(() => this.error.set(this.t('shop.saveError')));
  }

  create(): ProductFormValues {
    return createEmptyProductForm();
  }

  select(event: Event): void {
    const files = Array.from((event.target as HTMLInputElement).files ?? []);
    this.images.set(files);
    this.releasePreview();
    if (files[0]) {
      this.previewUrl = URL.createObjectURL(files[0]);
      this.preview.set(this.previewUrl);
    }
  }

  async submit(): Promise<void> {
    if (this.busy()) return;
    const values = { ...this.form.getRawValue(), images: this.images() };
    const errors = validateProductForm(values);
    if (Object.keys(errors).length) {
      this.error.set(Object.values(errors).join(' · '));
      return;
    }

    this.busy.set(true);
    this.error.set('');
    this.success.set('');
    try {
      await this.data.create(toCreateProductInput(values));
      this.success.set(this.t('shop.published'));
      this.form.reset(this.create());
      this.images.set([]);
      this.releasePreview();
      this.preview.set('');
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : this.t('shop.saveError'));
    } finally {
      this.busy.set(false);
    }
  }

  private releasePreview(): void {
    if (!this.previewUrl) return;
    URL.revokeObjectURL(this.previewUrl);
    this.previewUrl = '';
  }
}
