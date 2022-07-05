import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { PollService } from '../poll-service';
import { AppCookieService } from '../app-cookie-service.service';
import { JWTTokenService } from '../jwttoken-service.service';

@Component({
  selector: 'app-identify-admin',
  templateUrl: './identify-admin.component.html',
  styleUrls: ['./identify-admin.component.sass']
})
export class IdentifyAdminComponent implements OnInit {

  hide = true;
  WrongCredentials = false;


  logInForm = this.formBuilder.group({
    identifier: new FormControl('', [Validators.required, Validators.pattern("[a-zA-Z0-9]{8}")]),
    PollPassword: new FormControl('', [Validators.required])
  })


  constructor(private router: Router, private formBuilder: FormBuilder
    ,private pollServ: PollService,private cookieServ: AppCookieService,private jwtServ:JWTTokenService) { }

  ngOnInit(): void {
  }



  identifyAdmin() {

    //send identifier and password and retrieve token and poll
    const slugPoll = this.logInForm.get("identifier")?.value
    const pass = this.logInForm.get("PollPassword")?.value
    this.pollServ.logAdmin(slugPoll,pass).subscribe({
      next: tokenJson =>{
        this.WrongCredentials =false
        const token:string = tokenJson["jwt-token"]
        this.cookieServ.set("tokenCFDT",token)
        this.cookieServ.set("slugPoll",slugPoll)
        this.jwtServ.setToken(token)
        this.router.navigate(["/adminPage", slugPoll])
      },
      error: (e) =>{
        this.WrongCredentials = true;
      }
    }) 
  }


  getErrorMessage() {
    if (this.logInForm.get('identifier')?.hasError("required")) {
      return 'Vous devez rentrer un identifiant pour vous connecter'
    }
    if (this.logInForm.get('identifier')?.hasError("pattern")) {
      return "Le format n'est pas valide"
    }
    return "Cette salle n'existe pas"
  }

  getErrorMessageRequired() {
    return "Ne peut pas être vide"
  }

}
