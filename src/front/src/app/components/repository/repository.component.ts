import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-repository',
  templateUrl: './repository.component.html',
  styleUrls: ['./repository.component.css']
})
export class RepositoryComponent {
  id: string;
  jsonSchema: string = '{}';
  controllerTemplate: string = '(empty)';
  serviceTemplate: string =  '(empty)';
  entityTemplate: string =  '(empty)';

  constructor(private activatedRoute: ActivatedRoute){
    this.id = activatedRoute.snapshot.params['repositoryId'];
  }
}
