import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { DeleteRepositoryComponent } from '../components/repository/delete-repository/delete-repository.component';
import { APPLICATION_DOMAIN } from '../config';
import { Repository, RepositoryServerData } from '../dto/repository';

@Injectable({
  providedIn: 'root'
})
export class RepositoryService {

  constructor(private http: HttpClient) { }

  findPublicRepositories(page: number, pageSize: number): Observable<Repository[]> {
    return this.http.get<RepositoryServerData[]>(APPLICATION_DOMAIN + '/repositories', {
      params: new HttpParams()
            .set('page', page.toString())
            .set('take', pageSize.toString())
    }).pipe(
      map(repos => repos.map(value => { return { id: value.id, name: `${value.user.nick}/${value.name}`, type: value.type } as Repository }))
    );
  }

  getCountOfPublicRepositories(): Observable<number> {
    return this.http.get<{count: number}>(APPLICATION_DOMAIN + '/repositories/count')
    .pipe(
      map(res => res.count)
    );
  }

  getCountOfUserRepositories(): Observable<number> {
    return this.http.get<{count: number}>(APPLICATION_DOMAIN + '/repositories/user-repositories/count', {
      headers: {
        'app-auth': `${localStorage.getItem('token')}`
      }
    })
    .pipe(
      map(res => res.count)
    );
  }

  findUserRepositories(page: number, pageSize: number): Observable<Repository[]> {
    return this.http.get<RepositoryServerData[]>(APPLICATION_DOMAIN + '/repositories/user-repositories', {
      params: new HttpParams()
            .set('page', page.toString())
            .set('take', pageSize.toString()),
      headers: {
        'app-auth': `${localStorage.getItem('token')}`
      }
    }).pipe(
      map(repos => repos.map(value => { return { id: value.id, name: `${value.user.nick}/${value.name}`, type: value.type } as Repository }))
    );
  }

  createRepository(repositoryData: { name: string, type: string }) {
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
}
