---
name: react-leaflet
description: react-leaflet v5 — Componentes React para Leaflet. Mapa interativo com GeoJSON, marcadores e clusters.
---

# react-leaflet v5 — Skill

## Instalação

```bash
bun add react-leaflet leaflet
bun add -D @types/leaflet
```

### CSS do Leaflet (obrigatório)

Importar no `index.css` ou `main.tsx`:

```css
@import "leaflet/dist/leaflet.css";
```

### Container com altura definida (obrigatório)

```css
.map-container {
  width: 100%;
  height: 100vh;
}
```

## Componentes Principais

### MapContainer (imutável após criação)

```tsx
import { MapContainer, TileLayer } from 'react-leaflet'

<MapContainer
  center={[-15.78, -47.93]}
  zoom={4}
  className="map-container"
  zoomControl={false}
  scrollWheelZoom={true}
>
  <TileLayer
    attribution='&copy; CartoDB'
    url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
  />
</MapContainer>
```

> [!IMPORTANT]
> Props do `MapContainer` são **imutáveis** após a primeira renderização. Para mudar o centro/zoom dinamicamente, use `useMap()` dentro de um componente filho.

### GeoJSON (choropleth)

```tsx
import { GeoJSON } from 'react-leaflet'

<GeoJSON
  key={JSON.stringify(data)}  // Forçar re-render quando dados mudam
  data={geojsonData}
  style={(feature) => ({
    fillColor: getColor(feature.properties.value),
    weight: 1,
    opacity: 1,
    color: '#666',
    fillOpacity: 0.7,
  })}
  onEachFeature={(feature, layer) => {
    layer.on({
      click: () => handleStateClick(feature.properties.uf),
      mouseover: (e) => e.target.setStyle({ weight: 2 }),
      mouseout: (e) => geojsonRef.current?.resetStyle(e.target),
    })
  }}
/>
```

> [!IMPORTANT]
> O GeoJSON do react-leaflet **não re-renderiza** quando `data` muda. Use `key` para forçar re-criação.

### Marker e Popup

```tsx
import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

const branchIcon = new L.Icon({
  iconUrl: '/branch-marker.svg',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
})

<Marker position={[-23.55, -46.63]} icon={branchIcon}>
  <Popup>
    <strong>Loja Centro SP</strong><br/>
    São Paulo - SP
  </Popup>
</Marker>
```

### CircleMarker (demanda)

```tsx
import { CircleMarker, Tooltip } from 'react-leaflet'

<CircleMarker
  center={[-23.55, -46.63]}
  radius={Math.sqrt(demandValue) / 100}
  pathOptions={{
    fillColor: '#7c3aed',
    fillOpacity: 0.18,
    color: 'transparent',
  }}
>
  <Tooltip>Demanda: R$ 15M</Tooltip>
</CircleMarker>
```

## Hooks

### useMap()

Acessa a instância do Leaflet Map dentro de qualquer filho do `MapContainer`:

```tsx
import { useMap } from 'react-leaflet'

function FlyToState({ uf, center }) {
  const map = useMap()
  useEffect(() => {
    if (center) map.flyTo(center, 6)
  }, [center])
  return null
}
```

### useMapEvents()

```tsx
import { useMapEvents } from 'react-leaflet'

function MapClickHandler({ onStateClick }) {
  useMapEvents({
    click: (e) => {
      // Quando clica no mapa (fora de qualquer feature)
    },
  })
  return null
}
```

## Clustering (react-leaflet-cluster)

```bash
bun add react-leaflet-cluster
```

```tsx
import MarkerClusterGroup from 'react-leaflet-cluster'

<MarkerClusterGroup chunkedLoading>
  {branches.map(b => (
    <Marker key={b.id} position={[b.lat, b.lng]}>
      <Popup>{b.name}</Popup>
    </Marker>
  ))}
</MarkerClusterGroup>
```

## Regras para este projeto

1. **CartoDB light_nolabels** como tile base (opacity 0.4 para não competir com choropleth)
2. **GeoJSON key** — sempre incluir `key` que muda quando os dados mudam
3. **Hierarquia de z-index**: tiles → GeoJSON choropleth → CircleMarker demanda → Marcadores concorrentes → Marcadores filiais → UI overlays
4. **CircleMarker** para demanda com `fillOpacity: 0.18` e `color: transparent` para não bloquear cliques
5. **MarkerClusterGroup** para filiais e concorrentes
6. **Sem Google Maps** — usar Leaflet com tiles CartoDB
7. **Container height** deve ser 100vh ou definida explicitamente
