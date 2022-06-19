import { Participant } from "./Participant"
import { Vote } from "./Vote"

export class Poll{
    id?:number
    name?:string
    description?:string
    slug?:string
    isEnded?:boolean
    participants?:Participant[]
    votes?:Vote[]
    adminPass?:string
}