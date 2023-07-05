import { Component } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { Observable, filter, map } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  hidden$: Observable<boolean>;
  constructor(public router: Router) {
    {
      this.hidden$ = this.router.events.pipe(
        filter((event) => event instanceof NavigationEnd),
        map((event: any) => {
          return event.url.includes("register");
        })
      );
    }
  }
}
