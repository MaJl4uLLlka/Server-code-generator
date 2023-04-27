import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RepositoryService } from '../../../services/repository-service.service';
import { BehaviorSubject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

interface EntityColumn {
  name: string;
  type: string;
  isPrimaryKey: boolean;
  isNull: boolean;
}

@Component({
  selector: 'app-update-templates',
  templateUrl: './update-templates.component.html',
  styleUrls: ['./update-templates.component.css']
})
export class UpdateTemplatesComponent implements OnInit  {
  id: string;
  data: EntityColumn[] = [{name: 'id', type: 'STRING', isPrimaryKey: true, isNull: false}];
  dataSource = new BehaviorSubject<AbstractControl[]>([]);
  displayColumns = ['name', 'type', 'isPrimaryKey', 'isNull', 'delete'];
  rows: FormArray = this._formBuilder.array([]);
  form: FormGroup = this._formBuilder.group({ columns: this.rows });
  fromEntities: {name: string, id: string}[] = [];
  toEntities: {name: string, id: string}[] = [];
  linksForm: FormGroup = this._formBuilder.group({
    from: new FormControl('', [Validators.required]),
    to: new FormControl('', [Validators.required]),
    linkType: new FormControl('', [Validators.required])
  });

  constructor(
    private _formBuilder: FormBuilder, 
    private repositoryService: RepositoryService, 
    private activatedRoute: ActivatedRoute, 
    private router: Router, 
    private snackBar: MatSnackBar 
  ) {
    this.id = this.activatedRoute.snapshot.params['repositoryId'];
  }

  ngOnInit(): void {
    this.form.addControl('entityName', new FormControl('example', [Validators.required]));
    this.data.forEach((d) => this.addRow(d, false));
    this.updateView();
    this.loadEntities();
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
  
  OnSubmit() {
    this.repositoryService.updateRepositoryTemplate(this.id, {
      name: this.form.value.entityName,
      schema: JSON.stringify(this.form.value.columns)
    })
    .subscribe(
      data => {
        this.emptyTable();
        this.data.forEach((d) => this.addRow(d, false));
        this.updateView();
        this.loadEntities();
      },
      err => {
        console.log(err.error.message);
        this.snackBar.open(err.error.message, undefined, { duration: 2000 } );
      }
    );
  }

  loadEntities() {
    this.repositoryService.getEntities(this.id)
      .subscribe(
        data => {
          this.fromEntities = data;
          this.toEntities = data;
        }
      )
  }

  saveLink() {
    if (!this.linksForm.valid) {
      return;
    }

    this.repositoryService.createLink(this.id, this.linksForm.value)
      .subscribe(
        data => {
          this.form.setValue({from: '', to: '', linkType: ''})
        },
        err => {
          console.log(err.error.message);
          this.snackBar.open(err.error.message, undefined, { duration: 2000 } );
        }
      )
  }
}
