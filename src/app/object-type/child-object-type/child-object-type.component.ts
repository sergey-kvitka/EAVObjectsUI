import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ObjectType} from "../object-type.component";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup, NgForm} from "@angular/forms";
import {Attribute} from "../attribute/attribute.component";

@Component({
    selector: 'app-child-object-type',
    templateUrl: './child-object-type.component.html',
    styleUrls: ['./child-object-type.component.css']
})

export class ChildObjectTypeComponent implements OnInit, OnChanges {

    @Input() parentId: any;
    @Input() actualChildren: any;
    @Input() varToUpdate: any;

    @Output() currentObjectTypeId = new EventEmitter();

    closeResult: string | undefined;
    private deleteId?: number;
    editForm!: FormGroup;

    constructor(
        private httpClient: HttpClient,
        private modalService: NgbModal,
        private fb: FormBuilder
    ) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.ngOnInit();
    }

    ngOnInit(): void {
        this.getObjectTypesByParentId(this.parentId).subscribe(children => {
            this.actualChildren = children
        });
        this.editForm = this.fb.group({
            id: [''],
            name: [''],
            parentObjectTypeId: ['']
        });
    }

    emitObjectTypeId(id: any) {
        this.currentObjectTypeId.emit(id);
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

    open(content: any) {
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${ChildObjectTypeComponent.getDismissReason(reason)}`;
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

    onSubmit(f: NgForm, id: any) {
        let objectType: ObjectType = f.value;
        objectType.name = objectType.name.trim();
        if (objectType.name == '') {
            alert("Object type name can't be empty");
            return;
        }
        objectType.parentObjectTypeId = id;

        this.httpClient.get<ObjectType[]>('http://localhost:8080/object_types').subscribe(objectTypes => {
            let length = objectTypes.length;
            let flag = true;
            for (let i = 0; i < length; i++) {
                if (objectTypes[i].name == objectType.name) {
                    flag = false;
                    alert('Object type with such name already exists');
                    break;
                }
            }
            if (flag) {
                this.httpClient.post('http://localhost:8080/object_types/add_new', objectType)
                    .subscribe(() => {
                        this.ngOnInit();
                        this.modalService.dismissAll();
                    });
            }
        })
    }

    openDelete(targetModal: any, objectType: ObjectType) {
        this.deleteId = objectType.id;
        this.modalService.open(targetModal, {
            backdrop: 'static',
            size: 'lg'
        });
    }

    onDelete() {
        this.httpClient.delete('http://localhost:8080/object_types/deleteAllWithRootId/' + this.deleteId)
            .subscribe(() => {
                this.emitObjectTypeId('null');
                this.ngOnInit();
                this.modalService.dismissAll();
            });
    }

    openEdit(targetModal: any, objectType: ObjectType) {
        this.modalService.open(targetModal, {centered: true, backdrop: true, size: "sm"});

        this.editForm.patchValue({
            id: objectType.id,
            name: objectType.name,
            parentObjectTypeId: objectType.parentObjectTypeId
        });
    }

    onSave() {
        if (this.editForm.value.name.trim() == '') {
            alert("Object type name can't be empty");
            return;
        }
        this.httpClient.get('http://localhost:8080/object_types/validate_object_type/' + this.editForm.value.name)
            .subscribe(result => {
                if (!result) {
                    alert("Object type with such name already exists");
                }
                else {
                    this.httpClient.put('http://localhost:8080/object_types/' + this.editForm.value.id + '/edit',
                        this.editForm.value).subscribe(() => {
                        this.ngOnInit();
                        this.modalService.dismissAll();
                    });
                }
            }
        );
    }

}
