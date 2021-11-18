import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";

export class ObjectType {
  constructor(
    public id: number,
    public name: number,
    public parentObjectTypeId: number
  ) {}
}

export class Attribute {
  constructor(
    id: number,
    name: string,
    attributeTypeId: number,
    objectTypeId: number
  ) {}
}

@Component({
  selector: 'app-object-type',
  templateUrl: './object-type.component.html',
  styleUrls: ['./object-type.component.css']
})


export class ObjectTypeComponent implements OnInit {
  allObjectTypes: ObjectType[] | undefined;

  objectTypesWithoutParent: ObjectType[] | undefined;

  constructor(
    private httpClient: HttpClient
  ) {}

  ngOnInit(): void {

    this.getObjectTypes().subscribe(objectTypes => this.allObjectTypes = objectTypes);

    this.getObjectTypesByParentId(null).subscribe(children => {
        this.objectTypesWithoutParent = children;
        let objectTypesList = document.getElementById('children_of_root');
    });



  }

  getObjectTypes() {
    return this.httpClient.get<ObjectType[]>("http://localhost:8080/object_types");
  }

  getAttributesByObjectTypeId(id: any) {
    return this.httpClient.get<Attribute[]>
      ("http://localhost:8080/attributes/getAttributesByObjectTypeId/" + id);
  }

  getObjectTypesByParentId(parentId: any) {
    return this.httpClient.get<ObjectType[]>
      ("http://localhost:8080/object_types/getChildrenByParentId/" + parentId);
  }



  createObjectTypeBlock(objectTypeId: any, objectName: any) {

    let block = document.createElement('div');
    block.id = 'children_of_' + objectTypeId;

    block = this.addClassesToElement(
      ['border', 'border-dark'], block
    );

    let header = document.createElement('h3');
    header.innerHTML =
      `<i class="fa fa-minus" id="icon_of_${objectTypeId}"></i>${objectName}`;

    header = this.addClassesToElement(
      ['border', 'border-dark', 'cursor-pointer', 'deny-select'], header
    );
    block.appendChild(header);

    let dropList = document.createElement('div');
    dropList.id = 'droplist_of_' + objectTypeId;

    dropList = this.addClassesToElement(
      ['ml-20'], dropList
    );
    block.appendChild(dropList);

    header.addEventListener('click', function (event) {
      dropList.classList.toggle('display-none');
      let icon = document.getElementById('icon_of_' + objectTypeId);     // @ts-ignore
      icon.classList.toggle('fa-plus');                                     // @ts-ignore
      icon.classList.toggle('fa-minus');
    });

    this.getObjectTypesByParentId(objectTypeId).subscribe(children => children.forEach(child => {

      dropList.appendChild(this.createObjectTypeBlock(child.id, child.name));

    }));

    return block;
  }


  addClassesToElement(classes: any[], element: any): any {
    classes.forEach(className => {
      element.classList.add(className);
    });
    return element;
  }

  test(id: any) {
    this.getAttributesByObjectTypeId(id).subscribe(a => console.log(a));
  }
}
