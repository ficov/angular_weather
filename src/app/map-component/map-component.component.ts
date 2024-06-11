import { Component} from '@angular/core';
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';
import {ZoomSlider} from 'ol/control.js';
import {fromLonLat, transformExtent} from 'ol/proj.js';
import 'ol/ol.css';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Icon, Style } from 'ol/style';
import {Vector as VectorSource } from 'ol/source';
import { defaults as defaultControls } from 'ol/control';
import VectorLayer from 'ol/layer/Vector';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import Overlay from 'ol/Overlay';


@Component({
  selector: 'app-map-component',
  standalone: true,
  imports: [],
  templateUrl: './map-component.component.html',
  styleUrl: './map-component.component.css'
})
export class MapComponentComponent {
  map: Map | undefined;
  data: any;
  stations: any[] = [];
  overlays: Overlay[] = [];

constructor(private http: HttpClient) {}

  ngOnInit() {

    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: fromLonLat([15.9722,45.8146]),
        zoom: 6.3,
        constrainOnlyCenter: true,
        extent: transformExtent([12.3832, 43.1746, 19.1267, 46.1547], 'EPSG:4326', 'EPSG:3857'), 
        minZoom: 6.3, 
        maxZoom: 15, 
      }),
      controls: defaultControls().extend([new ZoomSlider()]),
    });

    this.fetchData().subscribe((data: any) => {
      this.data = JSON.parse(JSON.stringify(data));
      this.stations = this.data.stations;
      console.log(this.stations.length);

      this.showStations();
    });
  }

  fetchData(): Observable<any> {
    return this.http.get('assets/config.json');
  }

  showStations() {
    for (let i = 0; i < this.stations.length; i++) {
      console.log(this.stations[i].metaDatas.Longitude, this.stations[i].metaDatas.Latitude);
      this.addMarker(this.stations[i].metaDatas.Longitude, this.stations[i].metaDatas.Latitude, this.stations[i].metaDatas.link);
    }
  }

  redirectToSite(url: string) {
    window.open(url, '_blank');
  }

  addMarker(lon: number, lat: number, url: string): void {
    console.log(lon, lat);
    const iconFeature = new Feature({
      geometry: new Point(fromLonLat([lon, lat]))
    });

    const iconStyle = new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: 'assets/map-marker.png',
        scale: 0.1
      })
    });

    iconFeature.setStyle(iconStyle);

    const vectorSource = new VectorSource({
      features: [iconFeature]
    });

    const markerLayer = new VectorLayer({
      source: vectorSource
    });

    this.map!.addLayer(markerLayer);

    const button = document.createElement('button');
    button.onclick = () => this.redirectToSite(url);
    button.style.height = '50px';
    button.style.width = '25px';
    button.style.opacity = '0';
    button.style.cursor = 'pointer';

    const overlay = new Overlay({
      element: button,
      position: fromLonLat([lon, lat]),
      positioning: 'bottom-center',
    });

    this.map!.addOverlay(overlay);
  }
}
