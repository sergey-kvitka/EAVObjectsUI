import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Timestamp} from "rxjs/internal-compatibility";
import {HttpClient} from "@angular/common/http";
import {ObjectType} from "../object-type.component";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup, NgForm} from "@angular/forms";
import {Object} from "../../objects/objects.component";

export class Attribute {
    constructor(
        public id: number,
        public name: string,
        public attributeTypeId: number,
        public objectTypeId: number
    ) {
    }
}

export class AttributeType {
    constructor(
        public id: number,
        public name: string
    ) {
    }
}

@Component({
    selector: 'app-attribute',
    templateUrl: './attribute.component.html',
    styleUrls: ['./attribute.component.css']
})
export class AttributeComponent implements OnInit, OnChanges
{

    @Input() objectTypeId: any;
    objectTypeName: string = '';
    closeResult: string | undefined;
    currentAttributeName?: string;

    attributes: Attribute[] = [];
    editForm!: FormGroup;
    deleteId?: number;

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
        if (this.objectTypeId != 'null') {
            this.getObjectTypeById(this.objectTypeId).subscribe(
                objectType => {
                    this.objectTypeName = objectType.name;
                }
            );
        }

        this.getAttributesByObjectTypeId(this.objectTypeId).subscribe(
            attributes => {
                this.attributes = attributes;
            }
        );
        this.editForm = this.fb.group({
            id: [''],
            name: [''],
            attributeTypeId: [''],
            objectTypeId: ['']
        });
    }

    getAttributesByObjectTypeId(id: string) {
        return this.httpClient.get<Attribute[]>
        ("http://localhost:8080/attributes/getAttributesByObjectTypeId/" + id);
    }

    getObjectTypeById(id: string) {
        return this.httpClient.get<ObjectType>
        ("http://localhost:8080/object_types/" + id);
    }

    attributeTypeById(id: number) {
        if (id == 1) {
            return 'Text'
        }
        else {
            return 'Object (link)'
        }
    }

    attributeTypeIdByName(name: string): number {
        if (name.toLowerCase() == 'text') return 1;
        if (name.toLowerCase() == 'link') return 2;
        return -1;
    }

    onSave() {
        if (this.editForm.value.name.trim() == this.currentAttributeName) {
            this.ngOnInit();
            this.modalService.dismissAll();
            return;
        }
        if (this.editForm.value.name.trim() == '') {
            alert("Attribute name can't be empty");
            return;
        }
        this.isAvailableAttribute(this.editForm.value.name, this.editForm.value.objectTypeId).subscribe(
            result => {
                if (!result) {
                    alert('Attribute with such name already exists');
                }
                else {
                    this.httpClient.put('http://localhost:8080/attributes/' + this.editForm.value.id + '/edit',
                    this.editForm.value).subscribe(() => {
                        this.ngOnInit();
                        this.modalService.dismissAll();
                    });
                }
            }
        );
    }

    isAvailableAttribute(name: string, objectTypeId: number) {
        return this.httpClient.get(`http://localhost:8080/attributes/`+
            `isAvailableAttribute/${name}/${objectTypeId}`);
    }

    open(content: any) {
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${AttributeComponent.getDismissReason(reason)}`;
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


    openEdit(targetModal: any, attribute: Attribute) {
        this.modalService.open(targetModal, {centered: true, backdrop: true, size: "sm"});

        this.currentAttributeName = attribute.name;

        this.editForm.patchValue({
            id: attribute.id,
            name: attribute.name,
            attributeTypeId: attribute.attributeTypeId,
            objectTypeId: attribute.objectTypeId
        });
    }


    onSubmit(f: NgForm) {
        f.value.attributeTypeId = this.attributeTypeIdByName(f.value.attributeTypeId);
        let attribute: Attribute = f.value;
        attribute.name = attribute.name.trim();
        attribute.objectTypeId = this.objectTypeId;

        if (attribute.name == '') {
            alert("Attribute name can't be empty");
            return;
        }
        if (attribute.attributeTypeId < 0) {
            alert("Wrong attribute type");
            return;
        }

        this.isAvailableAttribute(attribute.name, attribute.objectTypeId).subscribe(
            result => {
                if (!result) {
                    alert('Attribute with such name already exists');
                }
                else {
                    this.httpClient.post('http://localhost:8080/attributes/add_new', f.value)
                        .subscribe(() => {
                            this.ngOnInit();
                            this.modalService.dismissAll();
                        });
                }
            }
        );
    }

    openDelete(targetModal: any, attribute: Attribute) {
        this.deleteId = attribute.id;
        this.modalService.open(targetModal, {
            backdrop: 'static',
            size: 'lg'
        });
    }

    onDelete() {
        const deleteURL = 'http://localhost:8080/attributes/' + this.deleteId + '/delete';
        this.httpClient.delete(deleteURL)
        .subscribe((results) => {
            this.ngOnInit();
            this.modalService.dismissAll();
        });
    }
}
