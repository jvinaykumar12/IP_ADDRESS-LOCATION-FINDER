import React, { useRef, useEffect, useState } from 'react';
import findip from './findip';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = "put your mapboxgl token here"

export default function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(81.42);
  const [lat, setLat] = useState(17);
  const [zoom, setZoom] = useState(9);
  const [findL,setfindL] = useState('');
  const [findN,setfindN] = useState('');

  const popupLayer = useRef(null) 

  const Layer = useRef(0)
  const layerPoint = {
    "type": "FeatureCollection",
    "features": []
  }
  const [divArray,setdivArray] = useState([])
 
  const flyToLocation = (e)=>{
    map.current.flyTo({
      center : [e.lon,e.lat],
      zoom : 10
    })
    showItem(e)
  }

  const showItem = (e) => {
    if(popupLayer.current) {
      popupLayer.current.remove()
    }
    popupLayer.current = new mapboxgl.Popup({closeOnClick : false})
    .setLngLat([e.lon,e.lat])
    .setHTML(`<div>${e.isp}</div>`)
    .addTo(map.current)
  }

  const pointOnmap = (arg,type)=> {
    findip(String(arg),type)
    .then( data => {
          const temp = []
          let count = 0;
          console.log(data)
         data.forEach(e=>{
          temp.push(<div key = {count++} onClick={()=>flyToLocation(e)}>
            <p>ip address - {e.query}</p>
            <p>city - {e.city}</p>
            <p>Internet Provider - {e.isp}</p>
            <p>Oragnistaion - {e.org}</p>
          </div>)
          layerPoint.features.push(
            {
              "type": "Feature",
              "properties":{
                  "isp":`${e.isp}`
              },
              "geometry": {
                "type": "Point",
                "coordinates": [
                  e.lon,
                  e.lat
                ]
              }, 
            },
          )})
          Layer.current++;
          if(Layer.current!==1) map.current.removeLayer(`${Layer.current-1}`)
          map.current.addLayer({
            id: `${Layer.current}`,
            type: 'circle',
            source: {
              type: 'geojson',
              data: layerPoint
            }
          })
          setdivArray(temp)
    })  
  }

  useEffect(() => {
    if (map.current) return; 
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });
       
    })

    useEffect(()=>{
      console.log(Layer.current)
      map.current.on('click',(e)=>{
        const features = map.current.queryRenderedFeatures(e.point, {
          layers: [`${Layer.current}`]})
          if (!features.length) return;
  
          const clickedPoint = features[0];
          const co = {
            lon:clickedPoint.geometry.coordinates[0],
            lat:clickedPoint.geometry.coordinates[1],
            isp:clickedPoint.properties.isp
          }
          flyToLocation(co)
          showItem(co)
          console.log("test")
          console.log(clickedPoint)  
        });   
    },[])

  return (
    <div className='mainDiv'>
      <div ref={mapContainer} className="map-container"/>
      <div className='locationList'>{divArray}</div>
      <div className='input1'>
        <div>
          <input  value={findL} type = "text" placeholder="For Torrent compatible" onChange={(e)=>setfindL(e.target.value)}/>
          <button onClick= {()=> {pointOnmap(findL,1)}} >submit</button>
        </div>
        <div>
          <input  value={findN} type = "text" placeholder="Normal ip" onChange={(e)=>setfindN(e.target.value)}/>
          <button onClick= {()=> {pointOnmap(findN,2)}} >submit</button>
        </div>
        
      </div>
       
      
    </div>
  );  

}