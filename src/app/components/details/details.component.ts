import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import places from '../../../assets/places.json';
import clinics from '../../../assets/clinics.json';
import agencies from '../../../assets/agencies.json';

@Component({
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  getEntityById(id: string) {
    return (
      places.find((place) => place.id === id) ||
      clinics.find((clinic) => clinic.id === id) ||
      agencies.find((agency) => agency.id === id)
    );
  }

  entity: any = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.entity = this.getEntityById(id);
    }
  }
}
