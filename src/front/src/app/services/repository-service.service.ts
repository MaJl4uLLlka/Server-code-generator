import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatGridTileHeaderCssMatStyler } from '@angular/material/grid-list';
import { map, Observable } from 'rxjs';
import { DeleteRepositoryComponent } from '../components/repository/delete-repository/delete-repository.component';
import { APPLICATION_DOMAIN } from '../config';
import { Repository, RepositoryServerData } from '../dto/repository';

@Injectable({
  providedIn: 'root'
})
export class RepositoryService {

  constructor(private http: HttpClient) { }

  findUserRepositories(filter: string, page: number, pageSize: number) {
    return this.http.get<RepositoryServerData>(APPLICATION_DOMAIN + '/repositories/user-repositories', {
      params: new HttpParams()
            .set('filter', filter)
            .set('page', page.toString())
            .set('take', pageSize.toString()),
      headers: {
        'app-auth': `${localStorage.getItem('token')}`
      }
    })
  }

  createRepository(repositoryData: { name: string, config: any }) {
    return this.http.post(APPLICATION_DOMAIN + '/repositories', repositoryData, {
      headers: {
        'app-auth': `${localStorage.getItem('token')}`
      }
    });
  }

  deleteRepository(repositoryId: string) {
    return this.http.delete(APPLICATION_DOMAIN + '/repositories/' + repositoryId, {
      headers: {
        'app-auth': `${localStorage.getItem('token')}`
      }
    })
  }

  updateRepositoryName(repositoryId: string, repositoryData: {name: string}) {
    return this.http.put(APPLICATION_DOMAIN +  '/repositories/' + repositoryId, repositoryData, {
      headers: {
        'app-auth': `${localStorage.getItem('token')}`
      }
    });
  }

  getRepositoryById(repositoryId: string) {
    return this.http.get(APPLICATION_DOMAIN +  '/repositories/' + repositoryId,{
      headers: {
        'app-auth': `${localStorage.getItem('token')}`
      }
    });
  }

  shareRepository(repositoryId: string, user: {nick: string}) {
    return this.http.post(APPLICATION_DOMAIN + '/repositories/' + repositoryId + '/share', user, {
      headers: {
        'app-auth': `${localStorage.getItem('token')}`
      }
    });
  }

  isRepositoryPrivate(repositoryId: string) {
    return this.http.get<{isPrivate: boolean}>(APPLICATION_DOMAIN + '/repositories/is-private/' + repositoryId, {
      headers: {
        'app-auth': `${localStorage.getItem('token')}`
      }
    });
  }

  isUserRepositoryOwner(repositoryId: string) {
    return this.http.get<{isUserOwner: boolean}>(APPLICATION_DOMAIN + '/repositories/is-user-owner/' + repositoryId, {
      headers: {
        'app-auth': `${localStorage.getItem('token')}`
      }
    });
  }

  updateRepositoryTemplate(
    repositoryId: string, 
    entityData: { name: string, schema: string }
  ) {
    return this.http.post(APPLICATION_DOMAIN + '/entity-managment/'+ repositoryId, entityData,
      {
        headers: {
          'app-auth': `${localStorage.getItem('token')}`,
        }
      }
    );
  }

  getCompletedPublicTemplate(repositoryId: string) {
    return this.http.get(APPLICATION_DOMAIN + '/repositories/'+ repositoryId + '/fill-public');
  }

  getCompletedPrivateTemplate(repositoryId: string) {
    return this.http.get(APPLICATION_DOMAIN + '/repositories/'+ repositoryId + '/fill-private', {
      headers: {
        'app-auth': `${localStorage.getItem('token')}`
      }
    });
  }
}
