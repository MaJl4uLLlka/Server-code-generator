import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RepositoryService } from '../../services/repository-service.service';

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

  constructor(private activatedRoute: ActivatedRoute, private repositoryService: RepositoryService){
    this.id = activatedRoute.snapshot.params['repositoryId'];
  }
}
