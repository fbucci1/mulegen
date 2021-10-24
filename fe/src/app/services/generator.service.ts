import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Tutorial } from '../models/tutorial.model';

const baseUrl = 'http://localhost:11111/api/generator';

@Injectable({
  providedIn: 'root'
})
export class GeneratorService {

  constructor(private http: HttpClient) { }

  generate(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }

}