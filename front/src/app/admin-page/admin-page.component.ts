import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.sass']
})
export class AdminPageComponent implements OnInit {

  started = false
  routeSlug=''
  myAngularxQrCode 

  constructor(private route: ActivatedRoute) {
    route.params.subscribe(params=>this.routeSlug=params['slug'])
    this.myAngularxQrCode= "http://localhost:4200/identify/"+this.routeSlug
   }

  ngOnInit(): void {
  }

}
