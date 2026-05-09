import dynamic from 'next/dynamic';

// Dynamically import the Leaflet map component to prevent SSR window/document undefined errors
const MapClient = dynamic(() => import('@/components/map/MapClient'), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-full items-center justify-center bg-brand-sand">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 border-4 border-brand-teal/20 border-t-brand-teal rounded-full animate-spin mb-4" />
        <h2 className="font-display text-brand-ink text-xl">Loading Explorer...</h2>
      </div>
    </div>
  )
});

export default function MapPage() {
  return (
    <main className="h-[100dvh] w-full overflow-hidden m-0 p-0">
      <MapClient />
    </main>
  );
}
