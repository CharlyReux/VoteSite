import { Component, OnInit } from '@angular/core';
import {FormControl,Validators} from '@angular/forms'
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-identify-user-page',
  templateUrl: './identify-user-page.component.html',
  styleUrls: ['./identify-user-page.component.sass']
})
export class IdentifyUserPageComponent implements OnInit {
  email = new FormControl('',[Validators.required,Validators.email])
  routeSlug = ""

  getErrorMessage(){
    if(this.email.hasError('required')){
      return 'Vous devez rentrer un email'
    }

    return this.email.hasError('email') ? "email non valide":"";
  }



  constructor(private route: ActivatedRoute) { 
    route.params.subscribe(params=>this.routeSlug=params['slug'])
  }

  ngOnInit(): void {
  }

}
