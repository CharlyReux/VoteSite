import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Participation } from '../models/Participation';
import { Poll } from '../models/Poll';
import { Vote } from '../models/Vote';

@Component({
  selector: 'app-recap-page',
  templateUrl: './recap-page.component.html',
  styleUrls: ['./recap-page.component.sass']
})
export class RecapPageComponent implements OnInit {

  routeSlug =""

  //TODO: make a function in the backEnd to get the participant associated with a participation
  finalScores:Participation[] =[{contre:5,pour:10,neutre:30}]

  poll:Poll={
    votes: [
      {
        title: "test1", participations: [
          { contre: 5, pour: 10, neutre: 30 }, { contre: 5, pour: 7, neutre: 30 }, { contre: 28, pour: 35, neutre: 1 }
        ]
      }, {
        title: "test2", participations: [
          { contre: 5, pour: 10, neutre: 30 }, { contre: 5, pour: 7, neutre: 30 }, { contre: 28, pour: 35, neutre: 1 }
        ]
      }
    ],
    participants: []
  }//Testing data

  displayedColumns =["pour","neutre","contre"]

  constructor(private route: ActivatedRoute) {
    route.params.subscribe(params => this.routeSlug = params['slug'])
  }

  ngOnInit(): void {

    const votesTest:Vote[] = this.poll.votes


  //testing data //TODO:


  }

  sumContre(participations:Participation[]){
   return participations.reduce((totalContre,obj)=>{
      return totalContre+obj.contre;
    },0)
  }
  sumNeutre(participations:Participation[]){
    return participations.reduce((totalNeutre,obj)=>{
       return totalNeutre+obj.neutre;
     },0)
   }  
   sumPour(participations:Participation[]){
    return participations.reduce((totalPour,obj)=>{
       return totalPour+obj.pour;
     },0)
   }

}
