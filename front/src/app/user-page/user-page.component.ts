import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { JWTTokenService } from '../jwttoken-service.service';
import { Vote } from '../models/Vote';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.sass']
})
export class UserPageComponent implements OnInit {

  routeSlug = ''

  voting: boolean = false;
  hasVoted: boolean = false;

  RemainingTime: number = 0
  RemainingTimeDate: string = ""

  currentVote: Vote = new Vote()

  pour = 0;
  maxPour = 0;
  neutre = 0
  maxNeutre = 0;
  contre = 0
  maxContre = 0;

  private eventSource!: EventSource;



  //Test value => TODO:
  totalMax = 100;
  remainingVotes = 100;

  constructor(private route: ActivatedRoute,private tokenServ:JWTTokenService) {
    route.params.subscribe(params => this.routeSlug = params['slug'])
  }

  ngOnInit(): void {
    this.RemainingTimeDate = new Date(this.RemainingTime * 1000).toISOString().slice(11, 19)
    this.currentVote.title = "testVote"
    this.currentVote.description = "oui ou ioiu lorem sit amet dolor yes yes adfoiqsmdnv posdif qmosidnf poqisdfpo qishfpoiqhs pdf qsoifn"

    this.neutre = this.totalMax;
    this.maxNeutre = this.totalMax;
    this.subscribeUser(this.routeSlug)

  }

  //TODO: subscribe pour savoir quand le vote commence 


  ValidateVote() {
    this.hasVoted = true;
  }



  updateSlidders(slidderNum: number) {
    this.remainingVotes = this.totalMax-this.contre-this.pour-this.neutre;

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
  }

  //SSE listener handling

  public subscribeUser(slugPoll: string) {
    this.eventSource = new EventSourcePolyfill("/api/userPart/subscribe/" + slugPoll, {
      headers: {
        'Authorization': "Bearer " + this.tokenServ.jwtToken
      }
    });

    this.eventSource.onopen = ((ev) => console.log(ev));
    this.eventSource.onerror = (ev => null);
    this.eventSource.addEventListener("heartbeat",()=>{
      console.log("heartbeat")
    })
    this.eventSource.addEventListener("subscribed",(ev)=>{
      console.log(ev.data);
      console.log("subscribed");
    })
    this.eventSource.addEventListener("subscribed",(ev)=>{
      console.log(ev.data);
      console.log("subscribed");
    })
    this.eventSource.addEventListener("endVote",()=>{
      console.log("endVote");
    })
    this.eventSource.addEventListener("startVote",(ev)=>{
      console.log(ev.data);
      console.log("endVote");
    })

  }

}


//TODO: Les sse marches en partie, genre le subscribed a l'air bon, il faut vérifier le fonctionnement des autres.
/*
Il faut aussi vérifier dans le back startVote et nextVotes ce qu'ils font exactement parce que c'est pas ultra clair
Pas oublier que l'endpoint pour subscribe est plus sécurisé comme il fallais que je teste avec le navigateur
*/
