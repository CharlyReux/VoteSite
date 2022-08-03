# VoteSite

I wanted to find a project that could make me learn popular frameworks, So i develloped a real-time voting website.<br>
Basically, any user can create a voting room by defining a password, the votes and their duration, as well as the users and their number of votes allowed.
Once the room is created the admin of this room can either start it instantly or let it as is and launch it later.
Every room gets an ID and the users only have to enter this ID or scan a QR code that is provided on the admin page before launching, and then enter their email that the admin defined previously.
The Admin can start the votes whenever he wants, it will pause between each vote and the admin can start the next one.


## Front-end
The front-end is made using angular and I really took advantage of angular material to make the UI.<br>
This was pretty much my first real experience with angular and I think it is somewhat "decent".<br>

## Back-end
The back-end is made with spring-boot, which was also my first experience with. I had some prior knowledge with java so it helped me get into it pretty quickly.<br>

## More details
For the "real-time" part of things, I used sse-emitters and for the database I used a mysql container.<br>
I have in mind to dockerize this application and to put it in a kubernetes cluster but I am working on other projects for now.
