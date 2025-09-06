import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import {AuthService} from '../auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);

    const handle = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authService.token()}`
        }
    })

    return next(handle);
}
