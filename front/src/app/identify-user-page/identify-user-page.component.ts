import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router';
import { AppCookieService } from '../app-cookie-service.service';
import { JWTTokenService } from '../jwttoken-service.service';
import { PollService } from '../poll-service';
@Component({
  selector: 'app-identify-user-page',
  templateUrl: './identify-user-page.component.html',
  styleUrls: ['./identify-user-page.component.sass']
})
export class IdentifyUserPageComponent implements OnInit {

  routeSlug = ""
  noMailInRoom = false;


  logInForm = this.formBuilder.group({
    email: new FormControl('', [Validators.required, Validators.email])
  })


  getErrorMessage() {
    if (this.logInForm.get("email")?.hasError('required')) {
      return 'Vous devez rentrer un email'
    }

    return this.logInForm.get("email")?.hasError('email') ? "email non valide" : "";
  }



  constructor(private router:Router,private route: ActivatedRoute, private formBuilder: FormBuilder,private pollServ: PollService,private cookieServ: AppCookieService,private jwtServ:JWTTokenService) {
    route.params.subscribe(params => this.routeSlug = params['slug'])
  }

  ngOnInit(): void {

    this.pollServ.verifyExists(this.routeSlug).subscribe(exists=>{
      if(!exists){
        alert("Aucune salle de vote n'existe avec cet identifiant")
        this.router.navigate(["/join"])
    }})
  }

  identifyUser() {
    const mail:string = this.logInForm.get("email")?.value
    this.pollServ.logParticipant(this.routeSlug,mail).subscribe({
      next: tokenJson =>{
        this.noMailInRoom =false
        const token:string = tokenJson["jwt-token"]
        this.cookieServ.set("tokenCFDT",token)
        this.cookieServ.set("slugPoll",this.routeSlug)
        this.cookieServ.set("curParticipant",tokenJson["name"])
        this.cookieServ.set("curMail",tokenJson["mail"])
        this.cookieServ.set("curParticipantPoints",tokenJson["userPoints"])
        this.jwtServ.setToken(token)
        this.router.navigate(["userPage/"+this.routeSlug])  
      },
      error: (e) =>{
        this.noMailInRoom = true;
      }
    }) 
  }


}
