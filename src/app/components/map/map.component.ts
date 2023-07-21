import { HttpClient } from "@angular/common/http";
import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { MapInfoWindow, MapMarker } from "@angular/google-maps";
import { Observable, catchError, delay, first, map, of, tap } from "rxjs";
import { environment } from "src/environments/environment";
import places from "../../../assets/places.json";
import clinics from "../../../assets/clinics.json";
import { SearchService } from "../search.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"],
})
export class MapComponent implements OnInit, AfterViewInit {
  isMedicalShown: boolean = true;
  isResidentialShown: boolean = true;

  mapFilterChanged() {
    if (this.isMedicalShown && this.isResidentialShown) {
      this.markers = this.getPlaces().concat(
        this.getClinics(this.selectedCategory)
      );
    } else if (this.isMedicalShown) {
      this.markers = this.getClinics(this.selectedCategory);
    } else if (this.isResidentialShown) {
      this.markers = this.getPlaces();
    } else {
      this.markers = [];
    }
  }

  trackByFn(index: number, item: any) {
    return item.id;
  }

  @ViewChildren(MapMarker) mapMarkers!: MapMarker[];

  @ViewChild(MapInfoWindow, { static: false }) infoWindow!: MapInfoWindow;
  infoContent = "";
  openInfo(marker: any, element?: MapMarker) {
    this.infoWindow.close();
    if (element === undefined) {
      element = this.mapMarkers.find((m) => m.getTitle() === marker.title);
    }

    this.infoContent = marker.html;
    this.selectedMarker = marker;
    this.infoWindow.open(element);
    if (marker.type === "medical") {
      this.selectedMedicalMarker = marker;
    } else {
      this.selectedResidentialMarker = marker;
    }
  }
  selectedMarker: any = null;
  selectedResidentialMarker: any = null;
  selectedMedicalMarker: any = null;

  zoom = 14;
  center: google.maps.LatLngLiteral = {
    lat: 42.45766498694126,
    lng: 18.53109191152655,
  };
  options: google.maps.MapOptions = {
    mapTypeId: "satellite",
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    zoomControl: true,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    maxZoom: 15,
    minZoom: 8,
  };

  apiLoaded: Observable<boolean>;

  categories = [
    { name: "all", count: 5 },
    { name: "dentistry", count: 2 },
    { name: "surgery", count: 2 },
    { name: "reproduction", count: 1 },
    { name: "oncology", count: 0 },
  ];

  selectedCategory = "all";

  constructor(
    httpClient: HttpClient,
    private service: SearchService,
    private router: Router
  ) {
    this.apiLoaded = httpClient
      .jsonp(
        `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&libraries=visualization`,
        "callback"
      )
      .pipe(
        tap(() => {}),
        map(() => true),
        catchError(() => of(false))
      );
    this.apiLoaded.pipe(first(), delay(1000)).subscribe(() => {
      this.infoWindow.closeclick.subscribe(() => {
        console.log("info window closed");
      });
    });
  }

  getPlaces() {
    return places.map((place) => {
      return {
        id: place.id,
        position: place.position,
        title: place.name + " " + place.rating,
        info: place.name + " " + place.rating,
        type: place.type,
        category: place.category,
        html: `<h1>${place.name}</h1><p>${place.rating}</p><a routerLink="/details" routerLinkActive="active">Details</a>`,
        options: {
          icon: {
            url: "assets/home.png",
            scaledSize: { width: 50, height: 50 },
          },
        },
        description: place.description,
        phone: place.phone,
        address: place.address,
        email: place.email,
        rating: place.rating,
      };
    });
  }

  getClinics(category: string = "all") {
    return clinics
      .filter((clinic) => category === "all" || clinic.category === category)
      .map((clinic) => {
        return {
          id: clinic.id,
          position: clinic.position,
          title: clinic.name,
          info: `${clinic.name}(${clinic.category})`,
          html: `<h1>${clinic.name}</h1><p>${clinic.category}</p>`,
          type: clinic.type,
          category: clinic.category,
          options: {
            icon: {
              url: "assets/heart.png",
              scaledSize: { width: 50, height: 50 },
            },
          },
          description: clinic.description,
          phone: clinic.phone,
          address: clinic.address,
          email: clinic.email,
          rating: clinic.rating,
        };
      });
  }

  openMarkerInfoWindow(marker: any) {
    this.selectedMarker = marker;
    this.infoWindow.open(marker);
  }

  getButton() {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.addEventListener("click", () => this.showPlaces());
    btn.textContent = "test";
    return btn.innerHTML;
  }

  showPlaces() {
    console.log(places);
  }

  filterMarkers(category: string) {
    this.mapFilterChanged();
  }

  ngOnInit(): void {
    this.mapFilterChanged();
    this.service.search$.subscribe((search) => {
      if (search) {
        console.log(search);
        this.openInfo(this.markers.find((marker) => marker.id === "clinic-3"));
      }
    });
  }

  ngAfterViewInit(): void {}

  filterMarkersByType(type: "medical" | "residential") {
    if (type === "medical") {
      return this.getClinics();
    } else if (type === "residential") {
      return this.getPlaces();
    }
    return [];
  }

  setCenterToCurrentPosition() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    });
  }

  click(event: google.maps.MapMouseEvent) {
    console.log(event);
  }

  markers: any[] = [];

  starsArray: number[] = [1, 2, 3, 4, 5]; // Array representing the number of stars

  getStarClass(star: number): string {
    const rating = this.selectedMarker?.rating;
    if (!rating) {
      return "";
    }
    const roundedRating = Math.floor(rating);
    if (star <= roundedRating) {
      return "fa-solid fa-star";
    } else if (star === Math.ceil(rating) && rating % 1 !== 0) {
      return "fa-solid fa-star-half-stroke";
    }
    return "";
  }
}
