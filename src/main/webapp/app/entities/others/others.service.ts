import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IOthers } from 'app/shared/model/others.model';

type EntityResponseType = HttpResponse<IOthers>;
type EntityArrayResponseType = HttpResponse<IOthers[]>;

@Injectable({ providedIn: 'root' })
export class OthersService {
  public resourceUrl = SERVER_API_URL + 'api/others';

  constructor(protected http: HttpClient) {}

  create(others: IOthers): Observable<EntityResponseType> {
    return this.http.post<IOthers>(this.resourceUrl, others, { observe: 'response' });
  }

  update(others: IOthers): Observable<EntityResponseType> {
    return this.http.put<IOthers>(this.resourceUrl, others, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IOthers>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IOthers[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
