import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Participant } from '../models/Participant';
import { Poll } from '../models/Poll';
import { Vote } from '../models/Vote';
import { FormControl, Validators } from '@angular/forms'
import { PollService } from '../poll-service';
import { tokenPoll } from '../models/tokenPoll';
import { JWTTokenService } from '../jwttoken-service.service';
import { AppCookieService } from '../app-cookie-service.service';
import { Router } from '@angular/router';




const COLUMNS_SCHEMA_PART = [
  {
    key: "name",
    type: "text",
    label: "Nom"
  },
  {
    key: "mail",
    type: "text",
    label: "Mail"
  },
  {
    key: "points",
    type: "number",
    label: "Votes Attribués"
  },
  {
    key: "isEdit",
    type: "isEdit",
    label: ""
  }
]


const COLUMNS_SCHEMA_VOTE = [
  {
    key: "title",
    type: "text",
    label: "titre"
  },
  {
    key: "description",
    type: "text",
    label: "Description"
  },
  {
    key: "duration",
    type: "number",
    label: "Temps du vote"
  },
  {
    key: "isEdit",
    type: "isEdit",
    label: ""
  }
]





@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.sass'],
  providers: [PollService],
  encapsulation: ViewEncapsulation.None
})



export class CreateRoomComponent implements OnInit {
  //password hiding
  hide = true;

  poll: Poll = new Poll;

  displayedColumnsPart: string[] = COLUMNS_SCHEMA_PART.map((col) => col.key);
  displayedColumnsVote: string[] = COLUMNS_SCHEMA_VOTE.map((col) => col.key);

  participants: Participant[] = [];
  votes: Vote[] = [];

  columnsSchemaPart: any = COLUMNS_SCHEMA_PART;
  columnsSchemaVote: any = COLUMNS_SCHEMA_VOTE;

  positiveNumber = new FormControl('', [Validators.required, Validators.min(1)])
  isMail = new FormControl('', [Validators.required, Validators.email])
  requiredNamePart = new FormControl('', [Validators.required])

  positiveDuration = new FormControl('', [Validators.required, Validators.min(1)])
  requiredTitleVote = new FormControl('', [Validators.required])

  alreadyUsedMail = ""
  alreadyUsedBoolean =false;


  constructor(private router:Router,private pollServ: PollService, private jwtServ: JWTTokenService, private cookieServ: AppCookieService) { }

  ngOnInit(): void {

  }

  //admin Setting methods

  updatePollSettings(gfg: any) {
    this.poll.name = gfg.PollTitle
    this.poll.adminPass = gfg.PollPassword
    this.poll.description = gfg.PollDescription
  }


  //Participant relative methods
  addParticipant() {
    var p = new Participant()
    p.name = "Nom"
    p.mail = "ex@mple.com"
    p.points = 0
    this.participants.push(p)
    this.participants = [...this.participants]
  }

  deleteParticipant(currentParticipant: Participant) {
    const index = this.participants.indexOf(currentParticipant)
    this.participants.splice(index, 1)
    this.participants = [...this.participants]
  }

  //Vote relative methods
  addVote() {
    var v = new Vote()
    v.title = "titre"
    v.duration = 5
    v.description = ""
    this.votes.push(v)
    this.votes = [...this.votes]
  }

  deleteVote(currentVote: Vote) {
    const index = this.participants.indexOf(currentVote)
    this.votes.splice(index, 1)
    this.votes = [...this.votes]
  }


  //TODO: Create the poll and send it to the server
  //and then send the admin to the next page 
  CreatePoll() {
    this.poll.participants = this.participants;
    this.poll.votes = this.votes;

    var tkPoll: tokenPoll
    this.pollServ.createPoll(this.poll).subscribe(tkpollRec => {
      tkPoll = tkpollRec;

      if(tkPoll.alreadyExists!=null){
        this.alreadyUsedBoolean = true;
        this.alreadyUsedMail = tkPoll.alreadyExists
        return
      }


      this.cookieServ.set("tokenCFDT",tkPoll['jwt-token']);
      this.cookieServ.set("slugPoll",tkPoll.pollSlug);
      this.jwtServ.setToken(tkPoll['jwt-token'])
      this.router.navigate(["adminPage/"+tkPoll.pollSlug])
    });
  }




  AllFormIsValid() {
    return !(this.positiveNumber.invalid && this.isMail.invalid && this.requiredNamePart.invalid && this.positiveDuration.invalid && this.requiredTitleVote.invalid)
  }



  ///Error messages

  getErrorMessagePositiveNumber() {
    if (this.positiveNumber.hasError("required")) {
      return "Des valeures ne sont pas remplies"
    }
    return "Les valeures doivent être positives"
  }
  getErrorMessageMail() {
    if (this.isMail.hasError("required")) {
      return "Des valeures ne sont pas remplies"
    }
    return "Le format de mail n'est pas valide"
  }
  getErrorMessageRequiredNamePart() {
    return "Des valeures ne sont pas remplies"
  }

  getErrorMessagePositiveDuration() {
    if (this.positiveDuration.hasError("required")) {
      return "Des valeures ne sont pas remplies"
    }
    return "Les valeures doivent être positives"
  }

  getErrorMessageRequiredTitleVote() {
    return "Des valeures ne sont pas remplies"
  }
}
