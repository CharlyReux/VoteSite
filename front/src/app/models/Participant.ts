import { Participation } from "./Participation"

export class Participant{
    id?:number
    name?:string
    mail?:string
    participations!:Participation[]
    points?:number
    DefaultPass?:string
}