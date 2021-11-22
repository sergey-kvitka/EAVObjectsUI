import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";

export class ObjectType {
  constructor(
    public id: number,
    public name: number,
    public parentObjectTypeId: number
  ) {}
}

@Component({
  selector: 'app-object-type',
  templateUrl: './object-type.component.html',
  styleUrls: ['./object-type.component.css']
})


export class ObjectTypeComponent implements OnInit {
  allObjectTypes: ObjectType[] | undefined;

  currentObjectTypeId: any = 'null';

  constructor(
    private httpClient: HttpClient
  ) {}

  ngOnInit(): void {
    this.getObjectTypes().subscribe(objectTypes => this.allObjectTypes = objectTypes);
  }

  setCurrentObjectTypeId(id: number) {
      this.currentObjectTypeId = id;
  }

  getObjectTypes() {
    return this.httpClient.get<ObjectType[]>("http://localhost:8080/object_types");
  }

  addClassesToElement(classes: any[], element: any): any {
    classes.forEach(className => {
      element.classList.add(className);
    });
    return element;
  }

}
