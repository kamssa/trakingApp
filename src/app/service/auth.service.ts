import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Resultat} from '../modele/resultat';
import {Abonnes} from '../modele/abonnes';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Confines} from '../modele/confines';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private urlAbonnes = 'http://localhost:8080/signupAbonne';
  private urlAbonnesByUUid = 'http://localhost:8080/abonnes';
  private urlgetConfinesByParam = 'http://localhost:8080/getConfinesByParam';

  // observables sources
  private abonnesCreerSource = new Subject<Resultat<Abonnes>>();
  private abonnesModifSource = new Subject<Resultat<Abonnes>>();
  private abonnesFiltreSource = new Subject<string>();
  private abonnesSupprimeSource = new Subject<Resultat<boolean>>();


// observables streams
  enseignantCreer$ = this.abonnesCreerSource.asObservable();
  enseignantModif$ = this.abonnesModifSource.asObservable();
  enseignnantFiltre$ = this.abonnesFiltreSource.asObservable();
  enseignnantSupprime$ = this.abonnesSupprimeSource.asObservable();

  constructor(private  http: HttpClient) {
  }

  getAllAbonness(): Observable<Resultat<Abonnes[]>> {
    return this.http.get<Resultat<Abonnes[]>>(this.urlAbonnes);
  }

  ajoutAbonnes(ens: Abonnes): Observable<Resultat<Abonnes>> {
    console.log('methode du service qui ajoute un abonne', ens);
    return this.http.post<Resultat<Abonnes>>(this.urlAbonnes, ens);
  }

  modifierEAbonnes(ensModif: Abonnes): Observable<Resultat<Abonnes>> {
    return this.http.put<Resultat<Abonnes>>(this.urlAbonnes, ensModif);
  }

  // supprimer un enseignant
  supprimerAbonnes(id: number): Observable<Resultat<boolean>> {
    return this.http.delete<Resultat<boolean>> (`${this.urlAbonnes}/${id}`);
  }
  getAbonnesByUUid(uuid: string): Observable<Resultat<Abonnes>> {
    return this.http.get<Resultat<Abonnes>>(`${this.urlAbonnesByUUid}/${uuid}`);
  }

  getConfineByParam(latitude: any, longitude: any): Observable<Resultat<Confines[]>> {
    let params = new HttpParams();
    params = params.append('latitude', latitude);
    params = params.append('longitude', longitude);

    return this.http.get<Resultat<Confines[]>>(this.urlgetConfinesByParam, { params: params}) ;
  }

  abonnesCreer(res: Resultat<Abonnes>) {
    console.log('enseignant a ete  creer correctement essaie source');
    this.abonnesCreerSource.next(res);
  }

  abonnesModif(res: Resultat<Abonnes>) {
    this.abonnesModifSource.next(res);
  }

  filtreAbonnes(text: string) {
    this.abonnesFiltreSource.next(text);
  }
  abonnessupprime(res: Resultat<boolean>){
    this.abonnesSupprimeSource.next(res);
  }

  ///////////////////////////////////////////
  // recuper les errurs
  /*_errorHandler(err) {
      let erreMessage: string;
      if (err instanceof Response) {
          const body = err.json() || '';
          const erreur = body.error || JSON.stringify(body);
          erreMessage = `${err.status} - ${err.statusText} ||  ${erreur}`;

      } else {
          erreMessage = err.message ? err.message : err.toString();
          console.log(erreMessage);
      }

      return Observable.throw(erreMessage);

  }
*/
}
