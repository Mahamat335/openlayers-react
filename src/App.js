import React, { useState, useEffect, useRef } from 'react';
import { Map, View } from 'ol';
import 'ol/ol.css';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import {Circle as CircleStyle, Fill, Stroke, Style, Text} from 'ol/style';
import {Draw, Modify, Snap} from 'ol/interaction';
import {GeometryCollection, LineString, Point, Polygon} from 'ol/geom';
import {circular} from 'ol/geom/Polygon';
import {getDistance} from 'ol/sphere';
import {transform} from 'ol/proj';
import {Control} from 'ol/control';
import {transformExtent} from 'ol/proj';
import { Feature } from "ol";
import Circle from 'ol/geom/Circle';
import {fromLonLat} from 'ol/proj';
import {detayLayer, denizLayer, illerLayer, gollerLayer, ilcelerLayer} from './Layers';
import "./App.css"

function App() {

    const geodesicStyle = new Style({
        geometry: function (feature) {
          return feature.get('modifyGeometry') || feature.getGeometry();
        },
        fill: new Fill({
          color: 'rgba(0, 255, 255, 0.2)',
        }),
        stroke: new Stroke({
          color: '#ff3333',
          width: 2,
        }),
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({
            color: 'rgba(255, 255, 0, 0)',
          }),
        }),
      });

      const style = new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.2)',
        }),
        stroke: new Stroke({
          color: '#33cc33',
          width: 2,
        }),
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({
            color: '#aacc33',
          }),
        }),
      });

      const source = new VectorSource({
        format: new GeoJSON(),
        style: function (feature) {
          const geometry = feature.getGeometry();
          return geometry.getType() === 'GeometryCollection' ? geodesicStyle : style;
        },
      });

      var drawLayer = new VectorLayer({
        source: source,
        updateWhileInteracting: true
      })


    var maxExtent = [24, 34, 47, 44];
    var centerpos = [29, 45.5];
    var newpos = transform(centerpos,'EPSG:4326','EPSG:900913');

      const tmpMap = new Map({
          layers: [
          ],
          view: new View({
              extent: transformExtent(maxExtent, 'EPSG:4326', 'EPSG:900913'),
              projection : 'EPSG:900913', // OSM projection
              center : newpos,
              minZoom:3,
              zoom: 3
          }),
      });
    
    var speedVectorLine;
    const [map, setMap] = useState(tmpMap);
    const mapElement = useRef();
    const mapRef = useRef();
    const speedVectorSlider = useRef();
    const speedVectorInfo = useRef();
    const historySlider = useRef();
    const historyInfo = useRef();

    const nokta = useRef();
    const cizgi = useRef();
    const poligon = useRef();
    const cember = useRef();
    const geoid = useRef();
    const fare = useRef();

    const denizButton = useRef();
    const gollerButton = useRef();
    const illerButton = useRef();
    const ilcelerButton = useRef();

    mapRef.current = map;

      useEffect(() => {
        map.setTarget(mapElement.current)
      map.addLayer(illerLayer)
      map.addLayer(detayLayer)
      map.addLayer(denizLayer)
      map.addLayer(gollerLayer)
      map.addLayer(ilcelerLayer)
      map.addLayer(drawLayer)
        setMap(map);

        denizLayer.setVisible(false);
  gollerLayer.setVisible(false);
  illerLayer.setVisible(false);
  ilcelerLayer.setVisible(false);
  drawLayer.setZIndex(1);

  

        map.addControl(new Control({
            element:denizButton.current
          }))
          map.addControl(new Control({
            element:gollerButton.current
          }))
          map.addControl(new Control({
            element:illerButton.current
          }))
          map.addControl(new Control({
            element:ilcelerButton.current
          }))

          map.addControl(new Control({
            element:nokta.current
          }))
          map.addControl(new Control({
            element:cizgi.current
          }))
          map.addControl(new Control({
            element:poligon.current
          }))
          map.addControl(new Control({
            element:cember.current
          }))
          map.addControl(new Control({
            element:geoid.current
          }))
          map.addControl(new Control({
            element:fare.current
          }))
          map.addControl(new Control({
            element:speedVectorSlider.current
          }))
          map.addControl(new Control({
            element:speedVectorInfo.current
          }))
          map.addControl(new Control({
            element:historySlider.current
          }))
          map.addControl(new Control({
            element:historyInfo.current
          }))
          speedVectorInfo.current.innerHTML =speedVectorSlider.current.value;
          historyInfo.current.innerHTML =historySlider.current.value;
          speedVectorLine = speedVectorSlider.current.value;
          //
          

          map.addInteraction(modify);
    }, []);

      function setDeniz(){
        denizLayer.setVisible(!denizLayer.getVisible())
      }
      
      function setGoller(){
        gollerLayer.setVisible(!gollerLayer.getVisible())
      }
      
      function setIlceler(){
        ilcelerLayer.setVisible(!ilcelerLayer.getVisible())
      }
    
      function setIller(){
        illerLayer.setVisible(!illerLayer.getVisible())
      }
      function PointButton(){
        value = "Point";
        map.removeInteraction(draw);
        map.removeInteraction(snap);
        addInteractions();
      }
      function LineStringButton(){
        value = "LineString";
        map.removeInteraction(draw);
        map.removeInteraction(snap);
        addInteractions();
      }
      function PolygonButton(){
        value = "Polygon";
        map.removeInteraction(draw);
        map.removeInteraction(snap);
        addInteractions();
      }
      function CircleButton(){
        value = "Circle";
        map.removeInteraction(draw);
        map.removeInteraction(snap);
        addInteractions();
      }
      function GeodesicButton(){
        value = "Geodesic";
        map.removeInteraction(draw);
        map.removeInteraction(snap);
        addInteractions();
      }
      function mouseButton(){
        value = null;
        map.removeInteraction(draw);
        map.removeInteraction(snap);
        addInteractions();
      }

      function slide(){
        speedVectorInfo.current.innerHTML = speedVectorSlider.current.value;
        speedVectorLine = speedVectorSlider.current.value;
        historyInfo.current.innerHTML = historySlider.current.value;
        //
      }

      const defaultStyle = new Modify({source: source})
      .getOverlay()
      .getStyleFunction();

      const modify = new Modify({
        source: source,
        style: function (feature) {
          feature.get('features').forEach(function (modifyFeature) {
            const modifyGeometry = modifyFeature.get('modifyGeometry');
            if (modifyGeometry) {
              const modifyPoint = feature.getGeometry().getCoordinates();
              const geometries = modifyFeature.getGeometry().getGeometries();
              const polygon = geometries[0].getCoordinates()[0];
              const center = geometries[1].getCoordinates();
              const projection = map.getView().getProjection();
              let first, last, radius;
              if (modifyPoint[0] === center[0] && modifyPoint[1] === center[1]) {
                first = transform(polygon[0], projection, 'EPSG:4326');
                last = transform(
                  polygon[(polygon.length - 1) / 2],
                  projection,
                  'EPSG:4326'
                );
                radius = getDistance(first, last) / 2;
              } else {
                first = transform(center, projection, 'EPSG:4326');
                last = transform(modifyPoint, projection, 'EPSG:4326');
                radius = getDistance(first, last);
              }
              const circle = circular(
                transform(center, projection, 'EPSG:4326'),
                radius,
                128
              );
              circle.transform('EPSG:4326', projection);
              geometries[0].setCoordinates(circle.getCoordinates());
              
              modifyGeometry.setGeometries(geometries);
            }
          });
          return defaultStyle(feature);
        },
      });
    
      modify.on('modifystart', function (event) {
        event.features.forEach(function (feature) {
          const geometry = feature.getGeometry();
          if (geometry.getType() === 'GeometryCollection') {
            feature.set('modifyGeometry', geometry.clone(), true);
          }
        });
      });
      
      modify.on('modifyend', function (event) {
        event.features.forEach(function (feature) {
          const modifyGeometry = feature.get('modifyGeometry');
          if (modifyGeometry) {
            feature.setGeometry(modifyGeometry);
            feature.unset('modifyGeometry', true);
          }
        });
      });
      
      
      var value;
      let draw, snap; 
    
      function addInteractions() {
        if(!value)
          return 0;
        let geometryFunction;
        if (value === 'Geodesic') {
          value = 'Circle';
          geometryFunction = function (coordinates, geometry, projection) {
            if (!geometry) {
              geometry = new GeometryCollection([
                new Polygon([]),
                new Point(coordinates[0]),
              ]);
            }
            const geometries = geometry.getGeometries();
            const center = transform(coordinates[0], projection, 'EPSG:4326');
            const last = transform(coordinates[1], projection, 'EPSG:4326');
            const radius = getDistance(center, last);
            const circle = circular(center, radius, 128);
            circle.transform('EPSG:4326', projection);
            geometries[0].setCoordinates(circle.getCoordinates());
            geometry.setGeometries(geometries);
            return geometry;
          };
        }
        draw = new Draw({
          source: source,
          type: value,
          geometryFunction: geometryFunction,
        });
        map.addInteraction(draw);
        snap = new Snap({source: source});
        map.addInteraction(snap);
      }

      var cemberSource =new VectorSource({
        projection: 'EPSG:4326'
        
      });
      var layer = new VectorLayer({
        source: cemberSource,
        style: [
          new Style({
            stroke: new Stroke({
              color: 'red',
              width: 3
            }),
            fill: new Fill({
              color: 'rgba(0, 0, 255, 0.1)'
            })
          })
        ],
        updateWhileInteracting: true
      });
      map.addLayer(layer);
      layer.setZIndex(1);
      const ucaklar = [];
      const yonler = [];
      const izlerUcak = [];
      const etiketler = [];
      const speedVectors = [];
      const cizgiler = [];
      for(let i = 0; i<15; i++){
        ucaklar.push(new Feature(new Circle(fromLonLat([34, 39]), 400)));
        speedVectors.push(new Feature(new LineString([fromLonLat([34, 39]), fromLonLat([36, 39])])));
        etiketler.push(new Feature(new Circle(fromLonLat([34, 39]), 0)));
        cizgiler.push(new Feature(new LineString([fromLonLat([34, 39]), fromLonLat([34, 39])])));
        speedVectors[i].setStyle(new Style({
          stroke: new Stroke({
            color: 'red',
            width: 1
          }),
          fill: new Fill({
            color: 'rgba(0, 255, 0, 0.1)'
          })
        }));
        cizgiler[i].setStyle(new Style({
          stroke: new Stroke({
            color: 'cyan',
            width: 1
          }),
          fill: new Fill({
            color: 'rgba(0, 255, 0, 0.1)'
          })
        }));
        etiketler[i].setStyle(new Style({
          
          text: new Text({
            text: i.toString(),
            //scale: 0.5,
            fill: new Fill({
              color: '#000000'
            }),
            stroke: new Stroke({
              color: '#FFFF99',
              width: 3.5
            })
          })
        }));
        yonler.push(Math.random());
        yonler.push((Math.random())*-1);
        izlerUcak.push([]);
      }
      const interval = setInterval(() => {
        
        for(let i = 0; i<ucaklar.length; i++){
      
          etiketler[i].getGeometry().setCenter(ucaklar[i].getGeometry().getCenter());
          let izUcak = new Feature(new Circle(ucaklar[i].getGeometry().getCenter(), 100));
          izlerUcak[i].push(izUcak);
          if(izlerUcak[i].length>4){
            izlerUcak[i].shift();
            
            izlerUcak[i][0].setStyle(new Style({
              stroke: new Stroke({
                color: 'red',
                width: 1
              }),
              fill: new Fill({
                color: 'rgba(0, 255, 0, 0.1)'
              })
            }));
            izlerUcak[i][1].setStyle(new Style({
              stroke: new Stroke({
                color: 'red',
                width: 2
              }),
              fill: new Fill({
                color: 'rgba(0, 255, 0, 0.1)'
              })
            }));
           }
      
          let coord = transform(ucaklar[i].getGeometry().getCenter(), "EPSG:3857","EPSG:4326"); 
          let coordLabel = [];
          coordLabel.push(coord[0]);
          coordLabel.push(coord[0]);
      
          let speedVectorPoint = [];
          if(coord[0]<26||coord[0]>45)
            yonler[i*2]*=-1;
            
          
          if(coord[1]<36||coord[1]>42)
            yonler[i*2+1]*=-1;
          
            if(i%2){
              coord[0]+=yonler[i*2]/4;
              coord[1]-=yonler[i*2+1]/4;
              speedVectorPoint[0] = coord[0]+yonler[i*2]*speedVectorLine/4;
              speedVectorPoint[1] = coord[1]-yonler[i*2+1]*speedVectorLine/4;
            }else{
              coord[0]-=yonler[i*2]/4;
              coord[1]+=yonler[i*2+1]/4;
      
              speedVectorPoint[0] = coord[0]-yonler[i*2]*speedVectorLine/4;
              speedVectorPoint[1] = coord[1]+yonler[i*2+1]*speedVectorLine/4;
            }
          coordLabel[0]= coord[0]+0.015;
          coordLabel[1]= coord[1]+0.015;
          ucaklar[i].getGeometry().setCenter(transform(coord, "EPSG:4326","EPSG:3857"));
          etiketler[i].getGeometry().setCenter(transform(coordLabel, "EPSG:4326","EPSG:3857"));
          cizgiler[i].getGeometry().setCoordinates([ucaklar[i].getGeometry().getCenter(), etiketler[i].getGeometry().getCenter()]);
          speedVectors[i].getGeometry().setCoordinates([ucaklar[i].getGeometry().getCenter(), transform(speedVectorPoint, "EPSG:4326","EPSG:3857")]);
        }
        cemberSource.clear();
        cemberSource.addFeatures(ucaklar);
        cemberSource.addFeatures(etiketler);
        cemberSource.addFeatures(speedVectors);
        cemberSource.addFeatures(cizgiler);
        for(let i = 0; i<ucaklar.length; i++){
          cemberSource.addFeatures(izlerUcak[i]);
        }
      }, 4000);

    

    return (
    <>
      <div style={{height:'100vh',width:'100vw'}} ref={mapElement} className="map-container" />
      <script type="module" src="main.js"></script>
      <div id="map-container" className="map-container"></div>
      <form className="form-inline" >
      <button ref={nokta} className="buttons" onClick={PointButton}>Point</button>
      <button ref={cizgi} className="buttons" onClick={LineStringButton}>LineString</button>
      <button ref={poligon} className="buttons" onClick={PolygonButton}>Polygon</button>
      <button ref={cember} className="buttons" onClick={CircleButton}>Circle Geometry</button>
      <button ref={geoid} className="buttons" onClick={GeodesicButton}>Geodesic Circle</button>
      <button ref={fare} className="buttons" onClick={mouseButton}>Mouse Cursor</button>
      </form>
      <button id= "first-button" ref={denizButton} className="buttons" onClick={setDeniz}>Toggle Seas</button>
      <button ref={gollerButton} className="buttons" onClick={setGoller}>Toggle Lakes</button>
      <button ref={illerButton} className="buttons" onClick={setIller}>Toggle Cities</button>
      <button ref={ilcelerButton}className="buttons" onClick={setIlceler}>Toggle Provinces</button>
      
      <div className="slidecontainer">
        <input type="range" min="4" max="12" defaultValue="8" className="slider" ref={speedVectorSlider} onInput={slide} ></input>
        <span className="sliderInfo" ref={speedVectorInfo}></span>  
      </div>
      <div className="slidecontainer">
        <input type="range" min="4" max="12" defaultValue="8" className="slider" ref={historySlider} onInput={slide} ></input>
        <span className="sliderInfo" ref={historyInfo}></span>
      </div>
    </>
    );
}

export default App;