import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppCookieService } from '../app-cookie-service.service';
import { JWTTokenService } from '../jwttoken-service.service';
import { PollService } from '../poll-service';


export interface DialogData {
  slug: string,
  token:string
}

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.sass']
})
export class WelcomePageComponent implements OnInit {

  constructor(private cookieServ:AppCookieService,public dialog:MatDialog,public pollServ:PollService) { }

  ngOnInit(): void {

    const slug:string|null = this.cookieServ.get("slugPoll");
    const token:string|null = this.cookieServ.get("tokenCFDT");

    if(token && slug){
      this.pollServ.verifyExists(slug).subscribe(exists=>{
        if(exists){
          this.dialog.open(DialogUserHasPreviousPoll,{height:"25%",data:{slug:slug,token:token}})
        }else{
          return
        }
      })
    }
  }


}


@Component({
  selector:'dialog-user-previous-poll',
  templateUrl:'./dialog-user-previous-poll.html',
  styleUrls: ['./welcome-page.component.sass']
})
export class DialogUserHasPreviousPoll{ 
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,private router:Router, private cookieServ:AppCookieService,private tokenServ:JWTTokenService){}

  joinPage(){
    this.tokenServ.setToken(this.data.token)
    const userType = this.tokenServ.getUser()
    if(userType=="admin"){
      this.router.navigate(["/adminPage/"+this.data.slug])
    }else{
      this.router.navigate(["/userPage/"+this.data.slug])
    }
  }
}