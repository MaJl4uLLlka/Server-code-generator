import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { RepositoryService } from 'src/app/services/repository-service.service';

interface EntityColumn {
  name: string;
  type: string;
  isPrimaryKey: boolean;
  isNull: boolean;
}

@Component({
  selector: 'app-update-entity',
  templateUrl: './update-entity.component.html',
  styleUrls: ['./update-entity.component.css']
})
export class UpdateEntityComponent implements OnInit {
  id: string;
  entityId: string;
  data: EntityColumn[] = [];
  dataSource = new BehaviorSubject<AbstractControl[]>([]);
  displayColumns = ['name', 'type', 'isPrimaryKey', 'isNull', 'delete'];
  rows: FormArray = this._formBuilder.array([]);
  form: FormGroup = this._formBuilder.group({ columns: this.rows });

  constructor(
    private _formBuilder: FormBuilder, 
    private repositoryService: RepositoryService, 
    private activatedRoute: ActivatedRoute, 
    private router: Router, 
    private snackBar: MatSnackBar 
  ) {
    this.id = this.activatedRoute.snapshot.params['repositoryId'];
    this.entityId = this.activatedRoute.snapshot.params['entityId'];
  }

  ngOnInit(): void {
    this.form.addControl('entityName', new FormControl('example', [Validators.required]));
    this.loadEntityData();
  }

  emptyTable() {
    while (this.rows.length !== 0) {
      this.rows.removeAt(0);
    }
  }

  removeRow(index: number) {
    this.rows.removeAt(index);
    this.updateView();
  }

  addRow(d?: EntityColumn, noUpdate?: boolean) {
    const row = this._formBuilder.group({
      'name'   : [d && d.name ? d.name : 'example', []],
      'type'   : [d && d.type ? d.type: 'STRING', []],
      'isPrimaryKey'   : [d ? d.isPrimaryKey : false, []],
      'isNull'   : [d ? d.isNull : false, []],
    });
    this.rows.push(row);
    if (!noUpdate) { this.updateView(); }
  }

  updateView() {
    this.dataSource.next(this.rows.controls);
  }

  loadEntityData() {
    this.repositoryService.getEntityById(this.id, this.entityId)
    .subscribe(
      (data: any) => {
        this.form.controls['entityName'].setValue(data.name);
        this.data = JSON.parse(data.schema);

        this.data.forEach((d) => this.addRow(d, false));
        this.updateView();
      }
    )
  }
  
  OnSubmit() {
    this.repositoryService.updateEntity(this.id, this.entityId, {
      name: this.form.value.entityName,
      schema: JSON.stringify(this.form.value.columns)
    })
    .subscribe(
      data => {
        this.emptyTable();
        this.data.forEach((d) => this.addRow(d, false));
        this.updateView();
      },
      err => {
        console.log(err.error.message);
        this.snackBar.open(err.error.message, undefined, { duration: 2000 } );
      }
    );
  }
}
