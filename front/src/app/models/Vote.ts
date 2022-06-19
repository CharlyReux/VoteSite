import { Participation } from "./Participation"

export class Vote{
    title?:string
    description?:string
    voteNumber?:number
    startTime?:Date
    Duration?:number
    participations?:Participation
    enCours?:boolean
}