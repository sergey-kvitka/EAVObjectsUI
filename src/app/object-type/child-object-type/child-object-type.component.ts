import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ObjectType} from "../object-type.component";

@Component({
    selector: 'app-test-component',
    templateUrl: './child-object-type.component.html',
    styleUrls: ['./child-object-type.component.css']
})
export class ChildObjectTypeComponent implements OnInit {
    @Input() parentId: any
    @Input() actualChildren: any

    constructor(
        private httpClient: HttpClient
    ) {
    }

    ngOnInit(): void {
        this.getObjectTypesByParentId(this.parentId).subscribe(children => {
            this.actualChildren = children
        });
    }

    getObjectTypesByParentId(parentId: any) {
        return this.httpClient.get<ObjectType[]>
        ("http://localhost:8080/object_types/getChildrenByParentId/" + parentId);
    }


    openChildren(id: any) {
        let icon = document.getElementById('icon_of_' + id);
        let dropList = document.getElementById('children_of_' + id);
        icon?.classList.toggle('fa-plus');
        icon?.classList.toggle('fa-minus');
        dropList?.classList.toggle('display-none');
    }
}
