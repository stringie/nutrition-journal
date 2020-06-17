import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private baseURL = environment.apiEndpoint;

  constructor(private http: HttpClient) {}

  public get(path: string, params?: any, baseUrl?: string): Observable<any> {
    return this.makeHttp('get', path, params, baseUrl);
  }

  public post(path: string, params?: any, baseUrl?: string): Observable<any> {
    return this.makeHttp('post', path, params, baseUrl);
  }

  public put(path: string, params?: any, baseUrl?: string): Observable<any> {
    return this.makeHttp('put', path, params, baseUrl);
  }

  public delete(path: string, params?: any, baseUrl?: string): Observable<any> {
    return this.makeHttp('delete', path, params, baseUrl);
  }

  private getHeaders() {
    let header = new HttpHeaders();

    header = header.set('Content-Type', 'application/json');
    header = header.set('Accept', 'application/json');

    return {
      headers: header
    };
  }

  private makeHttp(method: string, path: string, body: any, baseURL?: string): Observable<any> {
    let req: Observable<any>;
    const endpoint = (baseURL || this.baseURL) + path;

    switch (method) {
      case 'get':
        req = this.http.get(endpoint, this.getHeaders());
        break;
      case 'post':
        req = this.http.post(endpoint, body, this.getHeaders());
        break;
      case 'put':
        req = this.http.put(endpoint, body, this.getHeaders());
        break;
      case 'delete':
        req = this.http.delete(endpoint, this.getHeaders());
        break;
    }

    return req;
  }
}
