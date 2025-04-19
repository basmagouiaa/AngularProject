import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return router.parseUrl('/login');
  }

  const role = authService.getUserRole();

  if (role === 'Client') {
    return router.parseUrl('/');
  }else if (role === 'Admin') {
    return router.parseUrl('/dashboard');

  }

  return router.parseUrl('/login');
};
