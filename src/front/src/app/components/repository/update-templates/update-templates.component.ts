import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RepositoryService } from '../../../services/repository-service.service';

@Component({
  selector: 'app-update-templates',
  templateUrl: './update-templates.component.html',
  styleUrls: ['./update-templates.component.css']
})
export class UpdateTemplatesComponent implements OnInit  {
  id: string;
  entityFormGroup = this._formBuilder.group({
    entityTemplate: [''],
  });
  serviceFormGroup = this._formBuilder.group({
    serviceTemplate: [''],
  });
  controllerFormGroup = this._formBuilder.group({
    controllerTemplate: [''],
  });

  constructor(private _formBuilder: FormBuilder, private repositoryService: RepositoryService, private activatedRoute: ActivatedRoute, private router: Router ) {
    this.id = this.activatedRoute.snapshot.params['repositoryId'];
  }

  ngOnInit(): void {
    this.repositoryService.getRepositoryById(this.id)
      .subscribe(
        data => {
          const {entityTemplate, serviceTemplate, controllerTemplate} = (data as any).template;
          this.entityFormGroup.controls.entityTemplate.setValue(
            entityTemplate.value && entityTemplate.value !== ''? entityTemplate.value: ''
          );
          this.serviceFormGroup.controls.serviceTemplate.setValue(
            serviceTemplate.value && serviceTemplate.value !== ''? serviceTemplate.value: ''
          );
          this.controllerFormGroup.controls.controllerTemplate.setValue(
            controllerTemplate.value && controllerTemplate.value !== ''? controllerTemplate.value: ''
          );
        }
      );
  }

  OnSubmit() {
    this.repositoryService.updateRepositoryTemplate(this.id, {
      entityTemplate: this.entityFormGroup.value.entityTemplate as string,
      serviceTemplate: this.serviceFormGroup.value.serviceTemplate as string,
      controllerTemplate: this.controllerFormGroup.value.controllerTemplate as string,
    })
    .subscribe(
      data => {
        this.router.navigate(['repositories', this.id]);
      }
    );
  }
}
