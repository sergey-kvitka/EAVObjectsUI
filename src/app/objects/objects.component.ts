import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";

export class Object {
  constructor(
    public id: number,
    public name: string,
    public objectTypeId: number,
    public parentObjectId: number
  ) {
  }
}

@Component({
  selector: 'app-objects',
  templateUrl: './objects.component.html',
  styleUrls: ['./objects.component.css']
})
export class ObjectsComponent implements OnInit {

  objects: Object[] | undefined;


  constructor(
    private httpClient: HttpClient
  ) { }

  ngOnInit(): void {
    this.getObjects();
  }

  getObjects() {
    this.httpClient.get<any>('http://localhost:8080/objects').subscribe(
      response => {
        console.log(response);
        this.objects = response;
      }
    );
  }

}
