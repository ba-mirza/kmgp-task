import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, throwError } from "rxjs";
import {ToastService} from '../../shared/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError(err => {
      if (err.status >= 400 && err.status < 500) {
        console.error("Client error:", err);

        if (err.status === 401) {
          toast.warn("Ошибка", "Необходима авторизация");
        } else {
          toast.error("Ошибка", err.error?.message || "Ошибка клиента");
        }
      } else if (err.status >= 500) {
        console.error("Server error:", err);
        toast.error("Ошибка сервера", "Попробуйте позже");
      }

      return throwError(() => err);
    })
  );
};
