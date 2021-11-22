import {Component, Input, OnInit} from '@angular/core';
import {Timestamp} from "rxjs/internal-compatibility";
import {HttpClient} from "@angular/common/http";

export class Attribute {
    constructor(
        public id: number,
        public name: string,
        public attributeTypeId: number,
        public objectTypeId: number
    ) {}
}

@Component({
    selector: 'app-attribute',
    templateUrl: './attribute.component.html',
    styleUrls: ['./attribute.component.css']
})
export class AttributeComponent implements OnInit {

    @Input() objectTypeId : any;

    attributes : Attribute[] = []

    constructor(
        private httpClient: HttpClient
    ) {
    }

    ngOnInit(): void {
        this.getAttributesByObjectTypeId(this.objectTypeId).subscribe(
            attributes => { this.attributes = attributes }
        );
    }

    getAttributesByObjectTypeId(id: any) {
        return this.httpClient.get<Attribute[]>
        ("http://localhost:8080/attributes/getAttributesByObjectTypeId/" + id);
    }



}
