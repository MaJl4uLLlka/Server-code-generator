import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RepositoryService } from '../../../services/repository-service.service';
import { BehaviorSubject } from 'rxjs';

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
  data: EntityColumn[] = [{name: 'id', type: 'INTEGER', isPrimaryKey: true, isNull: false}];
  dataSource = new BehaviorSubject<AbstractControl[]>([]);
  displayColumns = ['name', 'type', 'isPrimaryKey', 'isNull'];
  rows: FormArray = this._formBuilder.array([]);
  form: FormGroup = this._formBuilder.group({ columns: this.rows });

  constructor(private _formBuilder: FormBuilder, private repositoryService: RepositoryService, private activatedRoute: ActivatedRoute, private router: Router ) {
    this.id = this.activatedRoute.snapshot.params['repositoryId'];
  }

  ngOnInit(): void {
    this.data.forEach((d) => this.addRow(d, false));
    this.updateView();
  }

  emptyTable() {
    while (this.rows.length !== 0) {
      this.rows.removeAt(0);
    }
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
  
    // this.repositoryService.getRepositoryById(this.id)
    //   .subscribe(
    //     data => {
    //       const {entityTemplate, serviceTemplate, controllerTemplate} = (data as any).template;
    //       this.entityFormGroup.controls.entityTemplate.setValue(
    //         entityTemplate.value && entityTemplate.value !== ''? entityTemplate.value: ''
    //       );
    //       this.serviceFormGroup.controls.serviceTemplate.setValue(
    //         serviceTemplate.value && serviceTemplate.value !== ''? serviceTemplate.value: ''
    //       );
    //       this.controllerFormGroup.controls.controllerTemplate.setValue(
    //         controllerTemplate.value && controllerTemplate.value !== ''? controllerTemplate.value: ''
    //       );
    //     }
    //   );
  //}

  OnSubmit() {
    // this.repositoryService.updateRepositoryTemplate(this.id, {
    //   entityTemplate: this.entityFormGroup.value.entityTemplate as string,
    //   serviceTemplate: this.serviceFormGroup.value.serviceTemplate as string,
    //   controllerTemplate: this.controllerFormGroup.value.controllerTemplate as string,
    // })
    // .subscribe(
    //   data => {
    //     this.router.navigate(['repositories', this.id]);
    //   }
    // );
  }
}
