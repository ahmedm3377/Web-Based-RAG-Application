import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UsersService } from './Users/user.service';

export const addTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(UsersService).$user().jwt;
  if (token) {
    const reqWithToken = req.clone(
      { headers: req.headers.set('Authorization', `Bearer ${token}`) });

    return next(reqWithToken);
  } else {
    return next(req);
  }


};
