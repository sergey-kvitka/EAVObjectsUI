import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, NgForm} from "@angular/forms";

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
    closeResult: string | undefined;
    editForm!: FormGroup;
    private deleteId!: number;

    constructor(
        private httpClient: HttpClient,
        private modalService: NgbModal,
        private fb: FormBuilder
    ) {
    }

    ngOnInit(): void {
        this.getObjects();

        this.editForm = this.fb.group({
            id: [''],
            name: [''],
            objectTypeId: [''],
            parentObjectId: ['']
        });
    }

    getObjects() {
        this.httpClient.get<any>('http://localhost:8080/objects').subscribe(
            response => {
                //console.log(response);
                this.objects = response;
            }
        );
    }

    open(content: any) {
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${ObjectsComponent.getDismissReason(reason)}`;
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
        let object: Object = f.value;
        let empty: string = '';

        if (object.name.trim() == empty) {
            alert('Name can\'t be empty string.');
            return;
        }
        if (object.objectTypeId.toString().trim() == empty) {
            alert('Object must has object type ID.');
            return;
        }

        const url = 'http://localhost:8080/objects/isAvailableObject/' +
            object.name.trim() + '/' +
            object.objectTypeId.toString().trim() + '/' +
            (object.parentObjectId.toString().trim() == empty
                ? "null"
                : object.parentObjectId.toString().trim());

        this.httpClient.get<string>(url).subscribe(result => {
            if (result[0] != 'true') {
                alert(result[0]);
            } else {
                this.httpClient.post('http://localhost:8080/objects/add_new', object)
                    .subscribe(() => {
                        this.ngOnInit();
                    });
                this.modalService.dismissAll(); //dismiss the modal
            }
        });
    }

    openDetails(targetModal: any, object: Object) {
        this.modalService.open(targetModal, {centered: true, backdrop: true, size: "lg"});

        // @ts-ignore
        document.getElementById('name_')
            .setAttribute('value', object.name);
        // @ts-ignore
        document.getElementById('object_type_id')
            .setAttribute('value', String(object.objectTypeId));
        // @ts-ignore
        document.getElementById('parent_object_id')
            .setAttribute('value', String(object.parentObjectId));
    }

    openEdit(targetModal: any, object: Object) {
        this.modalService.open(targetModal, {centered: true, backdrop: true, size: "lg"});

        this.editForm.patchValue({
            id: object.id,
            name: object.name,
            objectTypeId: object.objectTypeId,
            parentObjectId: object.parentObjectId
        });
    }

    onSave() {
        this.httpClient.put('http://localhost:8080/objects/' + this.editForm.value.id + '/edit',
            this.editForm.value).subscribe(() => {
            this.ngOnInit();
            this.modalService.dismissAll();
        });
    }

    openDelete(targetModal: any, object: Object) {
        this.deleteId = object.id;
        this.modalService.open(targetModal, {
            backdrop: 'static',
            size: 'lg'
        });
    }

    onDelete() {
        const deleteURL = 'http://localhost:8080/objects/' + this.deleteId + '/delete';
        this.httpClient.delete(deleteURL)
            .subscribe((results) => {
                this.ngOnInit();
                this.modalService.dismissAll();
            });
    }


}
