'use client';

import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';

interface Hospital {
  name: string;
  lat: number;
  lng: number;
}

interface CompareMapProps {
  hospitalA: Hospital | null;
  hospitalB: Hospital | null;
}

export default function CompareMap({ hospitalA, hospitalB }: CompareMapProps) {
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

  return (
    <APIProvider apiKey={API_KEY}>
      <div style={{ height: '500px', width: '100%' }}>
        <Map
          defaultCenter={{ lat: 37.5665, lng: 126.9780 }}
          defaultZoom={12}
          gestureHandling={'greedy'}
          disableDefaultUI={false}
        >
          {/* hospitalA가 있으면 A 마커 렌더링, 없으면 자동 소멸 */}
          {hospitalA && (
            <Marker 
              position={{ lat: hospitalA.lat, lng: hospitalA.lng }} 
              label="A"
            />
          )}

          {/* hospitalB가 있으면 B 마커 렌더링 */}
          {hospitalB && (
            <Marker 
              position={{ lat: hospitalB.lat, lng: hospitalB.lng }} 
              label="B"
            />
          )}
        </Map>
      </div>
    </APIProvider>
  );
}