import { Inject, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
  })
export class AppCookieService {
    
    private cookieStore:{[key:string]:string} = {};

    constructor() {
        this.parseCookies(document.cookie);
    }

    public parseCookies(cookies = document.cookie) {
        this.cookieStore = {};
        if (!!cookies === false) { return; }
        const cookiesArr = cookies.split(';');
        for (const cookie of cookiesArr) {
            const cookieArr = cookie.split('=');
            this.cookieStore[cookieArr[0].trim()] = cookieArr[1];
        }
    }

    get(key: string) {
        this.parseCookies();
        return !!this.cookieStore[key] ? this.cookieStore[key] : null;
    }

    remove(key: string) {
      document.cookie = `${key} = ; expires=Thu, 1 jan 1990 12:00:00 UTC; path=/`;
    }

    set(key: string, value: string) {
        document.cookie = `${key} = ; expires=Thu, 1 jan 1990 12:00:00 UTC; path=/`;

        var date = new Date;
        date.setDate(date.getDate()+1);

        document.cookie = key + '=' + (value || '')+";"+"Samesite = Lax;"+"expires="+date;
    }

    removeAll(){
        this.remove("curMail")
        this.remove("curParticipant")
        this.remove("curParticipantPoints")
        this.remove("slugPoll")
        this.remove("tokenCFDT")
    }
}