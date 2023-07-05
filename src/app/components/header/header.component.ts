import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormControl } from "@angular/forms";
import { SearchService } from "../search.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  filteredOptions = ["Rhinoplasty", "Facelift", "Liposuction"];
  myControl = new FormControl("");
  constructor(private service: SearchService) {}

  ngOnInit(): void {
    this.myControl.valueChanges.subscribe((search) => {
      if (search) {
        this.service.search$.next(search);
      }
    });
  }
}
