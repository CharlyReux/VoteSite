import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JWTTokenService } from '../jwttoken-service.service';
import { Poll } from '../models/Poll';
import { Vote } from '../models/Vote';
import { PollService } from '../poll-service';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.sass']
})
export class AdminPageComponent implements OnInit {

  started = false
  routeSlug = ''
  myAngularxQrCode

  RemainingTime: number = 0
  RemainingTimeDate: string = ""
  interval:any
  poll:Poll = new Poll()
  currentVote: Vote = new Vote()
  currentVoteNumber:number = 0
  voteState = "begin";

  constructor(private jwtServ:JWTTokenService,private route: ActivatedRoute,private router:Router,private pollServ:PollService) {
    route.params.subscribe(params => this.routeSlug = params['slug'])
    this.myAngularxQrCode = "http://localhost:4200/identify/" + this.routeSlug
  }

  ngOnInit(): void {

    this.pollServ.getPoll(this.routeSlug).subscribe(p=>{
      this.poll = p
      this.currentVote = this.poll.votes[0]
      console.log(this.poll.votes[0])
      console.log(this.currentVote);
      if(this.currentVote.duration==null){
        console.log("nop")
        return
      }
      
      this.RemainingTime = this.currentVote.duration
      this.RemainingTimeDate = new Date(this.RemainingTime * 1000).toISOString().slice(11, 19);

    })
  
  }

  startVote() {
    this.voteState="voting";
    this.pollServ.startVote(this.routeSlug).subscribe(()=>{
      if(this.currentVote.duration!=null){
        this.RemainingTime = this.currentVote.duration
      }
      this.startTimer()
    })

  }

  nextVote() {
    this.pollServ.nextVote(this.routeSlug).subscribe(()=>{
      this.currentVoteNumber++
      this.currentVote = this.poll.votes[this.currentVoteNumber]
      this.voteState="begin"
    })
  }

  
  startTimer() {
    this.interval= setInterval(() => {
      if(this.RemainingTime > 0) {
        this.RemainingTime--;
      } else {
        this.RemainingTime = 0;
        if(this.currentVote == this.poll.votes[this.poll.votes.length-1]){
          this.voteState =""
          this.router.navigate(["recapPage/"+this.routeSlug])
        }
        this.voteState = "ended"
        clearInterval(this.interval)
      }
      this.RemainingTimeDate = new Date(this.RemainingTime * 1000).toISOString().slice(11, 19)
    },1000)
  }


}
