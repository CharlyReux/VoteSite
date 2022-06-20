import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Vote } from '../models/Vote';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.sass']
})
export class AdminPageComponent implements OnInit {

  started = false
  routeSlug = ''
  myAngularxQrCode

  //TODO:on button click start voteRoom

  RemainingTime: number = 0
  RemainingTimeDate: string = ""
  currentVote: Vote = new Vote()
  voteState = "begin";

  constructor(private route: ActivatedRoute) {
    route.params.subscribe(params => this.routeSlug = params['slug'])
    this.myAngularxQrCode = "http://localhost:4200/identify/" + this.routeSlug
  }

  ngOnInit(): void {
    this.RemainingTimeDate = new Date(this.RemainingTime * 1000).toISOString().slice(11, 19);

    //Temporary to test the thing
    this.currentVote.title = "testVote"
    this.currentVote.description = "oui ou ioiu lorem sit amet dolor yes yes adfoiqsmdnv posdif qmosidnf poqisdfpo qishfpoiqhs pdf qsoifn"

  }

  startVote() {
    this.voteState="voting";
    //TODO: send data to server and start timer
    //if timer = 0 set voteencour to false and go on
  }

  nextVote() {
    //TODO: send data to server
    //
  }

  


}
