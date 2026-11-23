import { Component, computed, inject, input } from '@angular/core';
import { LanguageService } from '../../core/language.service';
@Component({
  selector: 'k-chart',
  standalone: true,
  template: `<article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <h2 class="text-lg font-semibold">{{ title() }}</h2>
    <div class="mt-5 overflow-x-auto">
      <svg viewBox="0 0 640 260" role="img" [attr.aria-label]="title()" class="h-64 min-w-[360px] w-full">
        <path d="M30 220H630M30 155H630M30 90H630M30 25H630" stroke="#e5e7eb" />
        @for (point of data(); track $index) {
          <g>
            <rect
              [attr.x]="40 + $index * width()"
              [attr.y]="220 - (point.value / max()) * 180"
              [attr.width]="width() - 12"
              [attr.height]="(point.value / max()) * 180"
              rx="5"
              fill="#297560"
            >
              <title>{{ point.label }}: {{ point.value }}</title>
            </rect>
            <text
              [attr.x]="40 + $index * width() + (width() - 12) / 2"
              y="246"
              text-anchor="middle"
              font-size="12"
              fill="#6b7280"
            >
              {{ point.label }}
            </text>
          </g>
        }
      </svg>
    </div>
  </article>`,
})
export class ChartComponent {
  readonly title = input.required<string>();
  readonly data = input.required<{ label: string; value: number }[]>();
  readonly lang = inject(LanguageService);
  readonly max = computed(() => Math.max(1, ...this.data().map((point) => point.value)));
  readonly width = computed(() => 580 / Math.max(1, this.data().length));
}
