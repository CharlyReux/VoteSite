import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl,FormGroup,Validators} from '@angular/forms'
import { Router } from '@angular/router';
import { Poll } from '../models/Poll';
import { PollService } from '../poll-service';

@Component({
  selector: 'app-join-page',
  templateUrl: './join-page.component.html',
  styleUrls: ['./join-page.component.sass']
})
export class JoinPageComponent implements OnInit {

  slugPoll = new FormControl('',[Validators.required,Validators.pattern("[a-zA-Z0-9]{8}")])
  scannerEnabled = false
  slugValue!: FormGroup;

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

  joinPoll(){
    var slugValue:string = this.slugValue.get('slug')?.value
    this.pollServ.verifyExists(slugValue).subscribe(exists=>{
      if(exists){
        this.router.navigate(["/identifyUser/"+slugValue])
    }else{
        alert("Aucune salle de vote n'existe avec cet identifiant")
    }})
  }

  onCodeResult(resultString:string){
    var url = new URL(resultString);
    if(url.pathname.startsWith("/identify")){
      var slug:string[] = url.pathname.split("/")
      console.log(slug[slug.length-1])
      this.pollServ.verifyExists(slug[slug.length-1]).subscribe(exists=>{
        if(exists){
          this.router.navigate(["/identifyUser/"+slug[slug.length-1]])
        }else{
          alert("Aucune salle de vote n'existe avec cet identifiant")
      }})
    }

  
  }



  constructor(private router:Router,private pollServ:PollService,private formBuilder: FormBuilder) { 

    this.slugValue = this.formBuilder.group({
      slug: ''
    });
  }

  ngOnInit(): void {
  }

}
