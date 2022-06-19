import { Component, OnInit } from '@angular/core';
import {FormControl,Validators} from '@angular/forms'
import { Router } from '@angular/router';

@Component({
  selector: 'app-join-page',
  templateUrl: './join-page.component.html',
  styleUrls: ['./join-page.component.sass']
})
export class JoinPageComponent implements OnInit {

  slugPoll = new FormControl('',[Validators.required,Validators.pattern("[a-zA-Z0-9]{8}")])
  scannerEnabled = false

  getErrorMessage(){
    if(this.slugPoll.hasError("required")){
      return 'Vous devez rentrer un identifiant pour vous connecter'
    }
    if(this.slugPoll.hasError("pattern")){
      return "Le format n'est pas valide"
    }
    return "Cette salle n'existe pas"
  }

  enableScanner(){
    this.scannerEnabled=!this.scannerEnabled
  }


  onCodeResult(resultString:string){
    var url = new URL(resultString);
    //TODO: verify that the poll exists
    if(url.pathname.startsWith("/identify")){
      this.router.navigate([url.pathname])
    }
  }



  constructor(private router:Router) { }

  ngOnInit(): void {
  }

}
