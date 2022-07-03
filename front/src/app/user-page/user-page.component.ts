import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JWTTokenService } from '../jwttoken-service.service';
import { Vote } from '../models/Vote';
import { SseClient } from 'ngx-sse-client';
import { HttpHeaders } from '@angular/common/http';
import { SimpleVote } from '../models/SimpleVote';
import { AppCookieService } from '../app-cookie-service.service';
import { PollService } from '../poll-service';
import { Participation } from '../models/Participation';


@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.sass']
})
export class UserPageComponent implements OnInit {

  routeSlug = ''

  voting: boolean = false;
  hasVoted: boolean = false;
  lastVote:boolean = false;

  RemainingTime: number = 0
  RemainingTimeDate: string = ""
  interval:any

  currentVote: SimpleVote ={
    title: '',
    description: '',
    startTime: "",
    Duration: 0,
    isEnded: false
  };

  pour = 0;
  maxPour = 0;
  neutre = 0
  maxNeutre = 0;
  contre = 0
  maxContre = 0;



  //Test value => TODO:
  totalMax = 0;
  remainingVotes = 0;

  constructor(private zone:NgZone,private router:Router,private route: ActivatedRoute,private cookieServ:AppCookieService, private tokenServ: JWTTokenService, private sseClient: SseClient,private pollServ:PollService) {
    route.params.subscribe(params => this.routeSlug = params['slug'])
  }

  ngOnInit(): void {
    this.RemainingTimeDate = new Date(this.RemainingTime * 1000).toISOString().slice(11, 19)
    const total:string | null =this.cookieServ.get("curParticipantPoints");
    if(total==null){
      alert("une erreur est survenue, veuillez retournez au menu et vous ré-identifier")
      return
    }
    this.totalMax = +total
    this.remainingVotes = +total;
    this.neutre = this.totalMax;
    this.maxNeutre = this.totalMax;
    this.subscribeUser(this.routeSlug)

  }



  ValidateVote() {
    this.hasVoted = true;
    const mail:string|null = this.cookieServ.get("curMail");
    const name:string|null = this.cookieServ.get("curParticipant");
    if(mail==null || name==null){
      alert("une erreur est survenue, veuillez retournez au menu et vous ré-identifier")
      return
    }
    const userPart:Participation = {nameUser:name,contre:this.contre,neutre:this.neutre,pour:this.pour}
    this.pollServ.addParticipation(this.routeSlug,mail,userPart).subscribe()
  }



  updateSlidders(slidderNum: number) {

    switch (slidderNum) {
      case 3:
        if (this.contre < 0) this.contre = 0;
        if (this.contre > this.maxContre) this.contre = this.maxContre;

        this.maxNeutre = this.totalMax - this.pour - this.contre
        this.maxPour = this.totalMax - this.neutre - this.contre
        break;
      case 2:
        if (this.neutre < 0) this.neutre = 0;
        if (this.neutre > this.maxNeutre) this.neutre = this.maxNeutre;

        this.maxContre = this.totalMax - this.neutre - this.pour
        this.maxPour = this.totalMax - this.neutre - this.contre
        break;
      case 1:
        if (this.pour < 0) this.pour = 0;
        if (this.pour > this.maxPour) this.pour = this.maxPour;

        this.maxNeutre = this.totalMax - this.pour - this.contre
        this.maxContre = this.totalMax - this.neutre - this.pour
        break;
      default:
        break;
    }
    this.remainingVotes = this.totalMax - this.contre - this.pour - this.neutre;

  }


  startTimer() {
    this.interval= setInterval(() => {
      if(this.RemainingTime > 0) {
        this.RemainingTime--;
      } else {
        this.RemainingTime = 0;
        if(this.lastVote){
          this.router.navigate([""])
        }
        this.hasVoted = true;
        clearInterval(this.interval)
      }
      this.RemainingTimeDate = new Date(this.RemainingTime * 1000).toISOString().slice(11, 19)
    },1000)
  }


  //SSE listener handling

  public subscribeUser(slugPoll: string) {
    const headers = new HttpHeaders().set(
      'Authorization', "Bearer " + this.tokenServ.jwtToken
    )

    this.sseClient.stream("/api/userPart/subscribe/" + slugPoll, { keepAlive: true, reconnectionDelay: 1_000, responseType: 'event' }, { headers }).subscribe((event) => {
      switch(event.type){
        case "heartbeat":
        break;
        case "startVote":
          this.zone.run(()=>{
            //parsing json
            const sv:string = (event as MessageEvent).data
            let tmpJSONobj = JSON.parse(sv);
            this.currentVote = <SimpleVote>tmpJSONobj
            
            const currentStartTime = new Date(this.currentVote.startTime)

            //changing the current data
            this.hasVoted =false;
            this.voting = true;
            this.RemainingTime =this.currentVote.Duration - (new Date().getSeconds() - currentStartTime.getSeconds())
            this.lastVote = this.currentVote.isEnded;
            this.startTimer();

          })
          break;
        case "endVote":
          this.zone.run(()=>{
 
            if(this.lastVote){
              alert("Les votes sont désormais finis")
              this.router.navigate([""])
              this.cookieServ.removeAll()
            }
          this.hasVoted = true;
        })
        break;
      }


    })


    /*
  "heartbeat"
  "subscribed"
  "endVote"
  "startVote"
    */


  }

}


/*
TODO:Pas oublier que l'endpoint pour subscribe est plus sécurisé comme il fallais que je teste avec le navigateur
*/
