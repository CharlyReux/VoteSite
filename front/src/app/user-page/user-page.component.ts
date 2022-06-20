import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.sass']
})
export class UserPageComponent implements OnInit {
  
  routeSlug = ''

  constructor(private route: ActivatedRoute) {
    route.params.subscribe(params => this.routeSlug = params['slug'])
   }

  ngOnInit(): void {
  }

}
