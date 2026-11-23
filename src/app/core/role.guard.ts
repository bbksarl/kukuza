import { inject } from '@angular/core';
import { type CanMatchFn, Router } from '@angular/router';
import { SessionService } from './session.service';

export function roleGuard(roles: ('admin' | 'creator')[]): CanMatchFn {
  return async () => {
    const session = inject(SessionService);
    const router = inject(Router);
    await session.check();
    const user = session.user();
    if (!user) {
      const returnUrl = router.getCurrentNavigation()?.extractedUrl.toString() ?? '/';
      // A recoverable network error must not silently treat the visitor as logged out.
      return session.error()
        ? router.createUrlTree(['/session-unavailable'], { queryParams: { returnUrl } })
        : router.createUrlTree(['/auth/login'], { queryParams: { returnUrl } });
    }
    return roles.includes(user.role as 'creator' | 'admin') || router.parseUrl('/forbidden');
  };
}
