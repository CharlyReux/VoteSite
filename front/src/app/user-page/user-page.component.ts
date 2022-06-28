import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JWTTokenService } from '../jwttoken-service.service';
import { Vote } from '../models/Vote';
import { SseClient } from 'ngx-sse-client';
import { HttpHeaders } from '@angular/common/http';


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



  //Test value => TODO:
  totalMax = 100;
  remainingVotes = 100;

  constructor(private route: ActivatedRoute, private tokenServ: JWTTokenService, private sseClient: SseClient) {
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
    this.remainingVotes = this.totalMax - this.contre - this.pour - this.neutre;

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
    const headers = new HttpHeaders().set(
      'Authorization', "Bearer " + this.tokenServ.jwtToken
    )

    this.sseClient.stream("/api/userPart/subscribe/" + slugPoll, { keepAlive: true, reconnectionDelay: 1_000, responseType: 'event' }, { headers }).subscribe((event) => {
      console.log(event.type)
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
TODO:on reçoit bien les startVote mais pas les endvotes sans doute parce qu'il y a pas de données envoyé et c'est pareil pour les heartbeat
(et on s'en branle pas parce qu'il faut quand meme que la connection reste entre client/server isnon cé kc) en fait je sais pas si ça se trouve la conneciton reste quand meme meme si il montre pas les données
Dans le doute autant envoyer des données quand meme de la part du serv (mais le heartbeat envoie qd meme quelquechose donc what??) ah mais en fait le délai du heartbeat doit être vraiment long c'est pour ça
*/
