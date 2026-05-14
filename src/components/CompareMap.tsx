'use client'

import { useEffect } from 'react'
import { APIProvider, Map, Marker, useMap } from '@vis.gl/react-google-maps'

type Hospital = { name: string; lat: number; lng: number } | null

function MapController({ a, b }: { a: Hospital; b: Hospital }) {
  const map = useMap()

  useEffect(() => {
    if (!map) return
    const points = [a, b].filter((p): p is NonNullable<Hospital> => !!p?.lat && !!p?.lng)
    if (points.length === 0) return

    if (points.length === 1) {
      map.panTo({ lat: points[0].lat, lng: points[0].lng })
      map.setZoom(15)
      return
    }

    const bounds = new google.maps.LatLngBounds()
    points.forEach(p => bounds.extend({ lat: p.lat, lng: p.lng }))
    map.fitBounds(bounds, 100)
  }, [map, a, b])

  return null
}

export default function CompareMap({
  hospitalA,
  hospitalB,
  className = 'w-full h-[600px] relative',
}: {
  hospitalA: Hospital
  hospitalB: Hospital
  className?: string
}) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''

  return (
    <div className={className}>
      <APIProvider apiKey={apiKey} language="en" region="KR">
        <Map
          defaultCenter={{ lat: 37.5218, lng: 127.0226 }}
          defaultZoom={13}
          gestureHandling="greedy"
          disableDefaultUI={false}
          mapTypeControl={false}
          streetViewControl={false}
          fullscreenControl={false}
        >
          <MapController a={hospitalA} b={hospitalB} />

          {hospitalA?.lat && hospitalA.lng && (
            <Marker
              position={{ lat: hospitalA.lat, lng: hospitalA.lng }}
              label={{ text: 'A', color: '#fff', fontWeight: 'bold', fontSize: '12px' }}
              title={hospitalA.name}
            />
          )}

          {hospitalB?.lat && hospitalB.lng && (
            <Marker
              position={{ lat: hospitalB.lat, lng: hospitalB.lng }}
              label={{ text: 'B', color: '#fff', fontWeight: 'bold', fontSize: '12px' }}
              title={hospitalB.name}
            />
          )}
        </Map>
      </APIProvider>

      {/* 선택 전 안내 */}
      {!hospitalA && !hospitalB && (
        <div className="absolute inset-0 flex items-end justify-center pb-4 pointer-events-none">
          <p className="text-xs text-gray-500 bg-white px-3 py-1.5 border border-gray-200 shadow-sm">
            Select a clinic to pin it on the map
          </p>
        </div>
      )}

      {/* 선택된 병원 범례 */}
      {(hospitalA || hospitalB) && (
        <div className="absolute bottom-3 left-3 flex flex-col gap-1 pointer-events-none">
          {hospitalA && (
            <div className="flex items-center gap-1.5 bg-white border border-gray-200 px-2 py-1 shadow-sm text-xs">
              <span className="font-bold text-gray-900">A</span>
              <span className="text-gray-600 truncate max-w-[160px]">{hospitalA.name}</span>
            </div>
          )}
          {hospitalB && (
            <div className="flex items-center gap-1.5 bg-white border border-gray-200 px-2 py-1 shadow-sm text-xs">
              <span className="font-bold text-gray-500">B</span>
              <span className="text-gray-600 truncate max-w-[160px]">{hospitalB.name}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
