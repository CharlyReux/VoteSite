import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppCookieService } from './app-cookie-service.service';
import { JWTTokenService } from './jwttoken-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizeGuard implements CanActivate {
  constructor(
    private cookieService: AppCookieService,
    private jwtService: JWTTokenService,
    private router: Router) {
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {


    if (this.jwtService.isTokenExpired()) {

      let curSlug = this.cookieService.get("slugPoll")
      if (curSlug) {
        if (this.jwtService.getUser() == "admin") {
          this.router.navigate(["identifyAdmin/" + curSlug])
        } else {
          this.router.navigate(["identifyUser/" + curSlug])
        }
        return false;
      }
      this.router.navigate(["join"])
    } else {
      return true;
    }
    this.router.navigate(["join"])
    return false;
  }
}