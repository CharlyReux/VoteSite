import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Participation } from "./models/Participation";
import { Poll } from "./models/Poll";
import { environment } from './../environments/environment';
import { Observable } from "rxjs";
import { tokenPoll } from "./models/tokenPoll";
import { JWTTokenService } from "./jwttoken-service.service";


@Injectable()
export class PollService {

constructor(private http:HttpClient,private jwtTokenServ:JWTTokenService){
}



requestOptions(){

    const token = this.jwtTokenServ.jwtToken;
    var headerDict = {
        'content-type': 'application/json',
        'Accept': 'application/json',
        "Authorization":""
      }
    if(token){
        headerDict['Authorization'] = token;
    }

    return {                                                                                                                                                                             
        headers: new HttpHeaders(headerDict), 
      };
}


///POLL SPECIFIC ENDPOINTS
createPoll(poll:Poll):Observable<tokenPoll>{
    return this.http.post<tokenPoll>('/api/log/polls',poll,this.requestOptions());
} 


verifyExists(slugPoll:string):Observable<boolean>{
    return this.http.get<boolean>("/api/log/verify/"+slugPoll);
}

getAllPoll(){

}

nextVote(slugPoll:string){

}

startVote(slugPoll:string){

}

//PARTICIPATION SPECIFIC ENDPOINTS
addParticipation(slugPoll:string,mailUser:string,participation:Participation){
}

subscribePoll(slugPoll:string){
}

///LOG IN SPECIFIC ENDPOINTS
logAdmin(slugPoll:string,password:string){

}

logParticipant(slugPoll:string,mail:string){

}




}
