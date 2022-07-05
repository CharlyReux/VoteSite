import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Participation } from "./models/Participation";
import { Poll } from "./models/Poll";
import { environment } from './../environments/environment';
import { catchError, Observable, of } from "rxjs";
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
        headerDict['Authorization'] = "Bearer "+token;
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


nextVote(slugPoll:string){
    return this.http.put<Poll>("/api/poll/nextVote/"+slugPoll,null,this.requestOptions())
}

startVote(slugPoll:string){
    return this.http.get<any>("/api/poll/startVote/"+slugPoll,this.requestOptions())
}

getPoll(slugPoll:string){
    return this.http.get<Poll>("api/poll/getPoll/"+slugPoll,this.requestOptions())
}

deletePoll(slugPoll:string):Observable<Poll>{
    return this.http.delete<Poll>("/api/poll/delPoll/"+slugPoll,this.requestOptions());
}

//PARTICIPATION SPECIFIC ENDPOINTS
addParticipation(slugPoll:string,mailUser:string,participation:Participation){
    return this.http.post<any>("/api/userPart/"+slugPoll+"/participation/"+mailUser,participation,this.requestOptions());
}


///LOG IN SPECIFIC ENDPOINTS
logAdmin(slugPoll:string,password:string):Observable<any>{
    return this.http.post<any>("/api/log/admin/"+slugPoll,password);
}

logParticipant(slugPoll:string,mail:string):Observable<any>{
    return this.http.post<any>("/api/log/participant/"+slugPoll,mail)
    
}


 

}
