import { Injectable } from "@angular/core";
import { Observable, Subject, of } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SearchService {
  search$: Subject<string> = new Subject<string>();
  constructor() {}
}
