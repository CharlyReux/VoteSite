import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-identify-admin',
  templateUrl: './identify-admin.component.html',
  styleUrls: ['./identify-admin.component.sass']
})
export class IdentifyAdminComponent implements OnInit {

  hide = true;

  logInForm = this.formBuilder.group({
    identifier: new FormControl('', [Validators.required, Validators.pattern("[a-zA-Z0-9]{8}")]),
    PollPassword: new FormControl('', [Validators.required])
  })


  constructor(private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
  }



  identifyAdmin() {//TODO: identify admin and send to server

    //send identifier and password and retrieve token and poll
    const slugPoll = this.logInForm.get("identifier")?.value

    //check if errors and throw message


    //Send admin to his poll
    this.router.navigate(["/adminPage", slugPoll])

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
