import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LanguageService } from '../core/language.service';
import { HeaderComponent } from '../shared/ui/header.component';
import { FooterComponent } from '../shared/ui/footer.component';
@Component({
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template:
    '<div class="min-h-screen overflow-x-hidden bg-slate-50"><a href="#main-content" class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-white focus:p-3">{{lang.t(\'accessibility.skipToContent\')}}</a><k-header /><div id="main-content" tabindex="-1"><router-outlet /></div><k-footer /></div>',
})
export class StorefrontShellComponent {
  readonly lang = inject(LanguageService);
}
