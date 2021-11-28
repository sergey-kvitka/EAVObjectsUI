import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NgForm} from "@angular/forms";

export class ObjectType {
    constructor(
        public id: number,
        public name: string,
        public parentObjectTypeId: number
    ) {
    }
}

@Component({
    selector: 'app-object-type',
    templateUrl: './object-type.component.html',
    styleUrls: ['./object-type.component.css']
})


export class ObjectTypeComponent implements OnInit {

    allObjectTypes: ObjectType[] | undefined;
    closeResult: string | undefined;
    currentObjectTypeId: any = 'null';
    varToUpdate: any = 1;

    constructor(
        private httpClient: HttpClient,
        private modalService: NgbModal
    ) {
    }

    ngOnInit(): void {
        this.getObjectTypes().subscribe(objectTypes => this.allObjectTypes = objectTypes);
    }

    setCurrentObjectTypeId(id: any) {
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

    open(content: any) {
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${ObjectTypeComponent.getDismissReason(reason)}`;
        });
    }

    private static getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    onSubmit(f: NgForm) {
        f.value.parentObjectId = null;
        f.value.name = f.value.name.trim();
        if (f.value.name == '') {
            alert("Object type name can't be empty");
            return;
        }

        this.httpClient.get<ObjectType[]>('http://localhost:8080/object_types').subscribe(objectTypes => {
            let length = objectTypes.length;
            let flag = true;
            for (let i = 0; i < length; i++) {
                if (objectTypes[i].name == f.value.name) {
                    flag = false;
                    alert('Object type with such name already exists');
                    break;
                }
            }
            if (flag) {
                this.httpClient.post('http://localhost:8080/object_types/add_new', f.value)
                .subscribe(() => {
                    this.varToUpdate++;
                    this.ngOnInit();
                    this.modalService.dismissAll();
                });
            }
        })
    }

}
