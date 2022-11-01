import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import mapconfig from "./data/config.json";
import GeoJSON from 'ol/format/GeoJSON';
import mapconfig2 from "./data/config2.json";
import {Fill, Style} from 'ol/style';

var detayLayer = new VectorLayer({
    source : new VectorSource({
     features: (new GeoJSON()).readFeatures(mapconfig.turkey_detay, {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'})
   }),
   updateWhileInteracting: true
  })

  var gollerLayer = new VectorLayer({
    source : new VectorSource({
     features: (new GeoJSON()).readFeatures(mapconfig2.goller_region, {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'})
   }),
   style: new Style({fill: new Fill({color:"#4BB6EF"})}),
   updateWhileInteracting: true
  })

  var ilcelerLayer = new VectorLayer({
    source : new VectorSource({
     features: (new GeoJSON()).readFeatures(mapconfig2.ilceler_region, {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'})
   }),
   updateWhileInteracting: true
  })

  var denizLayer = new VectorLayer({
   source : new VectorSource({
    features: new GeoJSON().readFeatures(mapconfig.deniz_region)
  }),
  style: new Style({fill: new Fill({color:"#006994"})}),
  updateWhileInteracting: true
 })

 var illerLayer = new VectorLayer({
   source : new VectorSource({
    features: new GeoJSON().readFeatures(mapconfig.iller_region)
  }),
  updateWhileInteracting: true
 })

  

 export {detayLayer, denizLayer, illerLayer, ilcelerLayer, gollerLayer};

