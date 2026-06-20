import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import { AnimatePresence, motion } from 'framer-motion';
import { Crosshair, MapPin, Phone, Search, Stethoscope } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { PageTransition } from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useLanguage, interpolate } from '@/hooks/useLanguage';
import { cn } from '@/utils/cn';

// --- Leaflet default-marker fix (broken bundler asset paths in Vite) ----------
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// --- Types --------------------------------------------------------------------
type Specialty = 'oncologist' | 'radiologist' | 'gynecologist' | 'general';
type Filter = 'all' | 'oncologist' | 'radiologist' | 'gynecologist';

interface Doctor {
  id: string;
  name: string;
  specialty: Specialty;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  distanceKm: number;
}

interface LatLng {
  lat: number;
  lng: number;
}

// --- Constants ----------------------------------------------------------------
const DEFAULT_LOCATION: LatLng = { lat: 32.8811, lng: -6.9063 }; // Khouribga
const RADIUS_STEPS = [5000, 10000, 20000];
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const CACHE_PREFIX = 'sahtek:doctors';

const SPECIALTY_COLOR: Record<Specialty, string> = {
  oncologist: '#DC2626',
  radiologist: '#3B82F6',
  gynecologist: '#D63384',
  general: '#14B8A6',
};

const SPECIALTY_BADGE: Record<Specialty, 'high' | 'info' | 'primary' | 'neutral'> = {
  oncologist: 'high',
  radiologist: 'info',
  gynecologist: 'primary',
  general: 'neutral',
};

// Major Moroccan cancer / care centers — used to supplement sparse OSM data.
const MOROCCAN_CENTERS: Omit<Doctor, 'distanceKm'>[] = [
  { id: 'mc-ino', name: "Institut National d'Oncologie", lat: 33.9716, lng: -6.8498, specialty: 'oncologist', address: 'Rabat', phone: '0537712747' },
  { id: 'mc-lalla-salma', name: "Centre d'Oncologie Lalla Salma", lat: 33.5731, lng: -7.5898, specialty: 'oncologist', address: 'Casablanca', phone: '0522202020' },
  { id: 'mc-chu-marrakech', name: 'CHU Mohammed VI - Oncologie', lat: 31.6295, lng: -7.9811, specialty: 'oncologist', address: 'Marrakech', phone: '0524434813' },
  { id: 'mc-hassan2-fes', name: "Centre Regional d'Oncologie Hassan II", lat: 34.0331, lng: -5.0003, specialty: 'oncologist', address: 'Fes', phone: '0535619153' },
  { id: 'mc-khouribga', name: 'Hopital Provincial de Khouribga', lat: 32.8811, lng: -6.9063, specialty: 'gynecologist', address: 'Khouribga', phone: '0523492110' },
  { id: 'mc-beni-mellal', name: 'Centre Hospitalier Regional Beni Mellal', lat: 32.3373, lng: -6.3498, specialty: 'oncologist', address: 'Beni Mellal', phone: '0523483821' },
];

// --- Helpers ------------------------------------------------------------------
function haversineKm(a: LatLng, b: LatLng): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(h));
}

function classifySpecialty(tags: Record<string, string> | undefined): Specialty {
  const raw = `${tags?.['healthcare:speciality'] ?? ''} ${tags?.healthcare ?? ''} ${tags?.name ?? ''}`.toLowerCase();
  if (/oncolog|cancer|tumour|tumor/.test(raw)) return 'oncologist';
  if (/radiolog|imaging|imagerie|scanner|mammograph/.test(raw)) return 'radiologist';
  if (/gyn|gynaecolog|gynecolog|obstetric|maternit/.test(raw)) return 'gynecologist';
  return 'general';
}

interface OverpassElement {
  id: number;
  lat?: number;
  lon?: number;
  tags?: Record<string, string>;
}

function readCache(key: string): Omit<Doctor, 'distanceKm'>[] | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { ts: number; data: Omit<Doctor, 'distanceKm'>[] };
    if (Date.now() - parsed.ts > CACHE_TTL_MS) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

function writeCache(key: string, data: Omit<Doctor, 'distanceKm'>[]) {
  try {
    localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data }));
  } catch {
    /* storage full or unavailable — ignore */
  }
}

async function fetchOverpass(loc: LatLng, radius: number, fallbackName: string): Promise<Omit<Doctor, 'distanceKm'>[]> {
  const cacheKey = `${CACHE_PREFIX}:${loc.lat.toFixed(2)}:${loc.lng.toFixed(2)}:${radius}`;
  const cached = readCache(cacheKey);
  if (cached) return cached;

  const query = `[out:json][timeout:15];(
    node["amenity"="doctors"](around:${radius},${loc.lat},${loc.lng});
    node["amenity"="hospital"](around:${radius},${loc.lat},${loc.lng});
    node["amenity"="clinic"](around:${radius},${loc.lat},${loc.lng});
    node["healthcare"="doctor"](around:${radius},${loc.lat},${loc.lng});
    node["healthcare"="centre"](around:${radius},${loc.lat},${loc.lng});
  );out body 60;`;

  const res = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: `data=${encodeURIComponent(query)}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  if (!res.ok) throw new Error(`Overpass ${res.status}`);
  const data = (await res.json()) as { elements: OverpassElement[] };

  const doctors = data.elements
    .filter((el) => typeof el.lat === 'number' && typeof el.lon === 'number')
    .map((el) => ({
      id: `osm-${el.id}`,
      name: el.tags?.name || fallbackName,
      specialty: classifySpecialty(el.tags),
      address: el.tags?.['addr:street'] || el.tags?.['addr:city'] || '',
      phone: el.tags?.phone || el.tags?.['contact:phone'] || '',
      lat: el.lat as number,
      lng: el.lon as number,
    }));

  writeCache(cacheKey, doctors);
  return doctors;
}

// --- Map controller: flies to a target when `view` changes --------------------
function MapController({ view }: { view: { lat: number; lng: number; zoom: number; nonce: number } }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([view.lat, view.lng], view.zoom, { duration: 0.8 });
  }, [view.nonce, map, view.lat, view.lng, view.zoom]);
  return null;
}

// --- Marker icons -------------------------------------------------------------
const doctorIcon = (color: string) =>
  L.divIcon({
    className: '',
    html: `<span style="display:block;width:22px;height:22px;border-radius:9999px;background:${color};border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.35)"></span>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -12],
  });

const userIcon = L.divIcon({
  className: '',
  html: `<span class="sahtek-user-pin"><span class="sahtek-user-core"></span></span>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

// --- Skeleton card ------------------------------------------------------------
function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-3xl border border-line bg-card p-4 shadow-petal">
      <div className="h-4 w-2/3 rounded-full bg-line" />
      <div className="mt-3 h-3 w-1/3 rounded-full bg-line" />
      <div className="mt-4 h-9 w-24 rounded-full bg-line" />
    </div>
  );
}

// --- Page ---------------------------------------------------------------------
export function DoctorsPage() {
  const { t } = useLanguage();

  const [location, setLocation] = useState<LatLng>(DEFAULT_LOCATION);
  const [locationLabel, setLocationLabel] = useState<string>('');
  const [radiusIndex, setRadiusIndex] = useState(0);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [usedFallback, setUsedFallback] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(true);
  const [detecting, setDetecting] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [notice, setNotice] = useState('');
  const [view, setView] = useState({ ...DEFAULT_LOCATION, zoom: 12, nonce: 0 });

  const markerRefs = useRef<Map<string, L.Marker>>(new Map());
  const requestToken = useRef(0);

  const radius = RADIUS_STEPS[radiusIndex];

  // Load doctors around a location for the current radius.
  const loadDoctors = useCallback(
    async (loc: LatLng, radiusMeters: number) => {
      const token = ++requestToken.current;
      setLoading(true);
      setNotice('');

      let osm: Omit<Doctor, 'distanceKm'>[] = [];
      try {
        osm = await fetchOverpass(loc, radiusMeters, t.doctors.specialties.general);
      } catch {
        osm = [];
      }
      if (token !== requestToken.current) return; // a newer request superseded this one

      const radiusKm = radiusMeters / 1000;
      const withinStatic = MOROCCAN_CENTERS.filter((c) => haversineKm(loc, c) <= radiusKm);

      // Merge + dedupe by rounded coordinate.
      const seen = new Set<string>();
      const merged: Omit<Doctor, 'distanceKm'>[] = [];
      for (const item of [...osm, ...withinStatic]) {
        const key = `${item.lat.toFixed(4)},${item.lng.toFixed(4)}`;
        if (seen.has(key)) continue;
        seen.add(key);
        merged.push(item);
      }

      let fallback = false;
      if (merged.length < 3) {
        // Sparse area — supplement with the national centers (nearest first).
        fallback = true;
        for (const c of MOROCCAN_CENTERS) {
          const key = `${c.lat.toFixed(4)},${c.lng.toFixed(4)}`;
          if (seen.has(key)) continue;
          seen.add(key);
          merged.push(c);
        }
      }

      const ranked = merged
        .map((d) => ({ ...d, distanceKm: haversineKm(loc, d) }))
        .sort((a, b) => a.distanceKm - b.distanceKm);

      setDoctors(ranked);
      setUsedFallback(fallback);
      setLoading(false);
    },
    [t.doctors.specialties.general],
  );

  // Initial load.
  useEffect(() => {
    void loadDoctors(DEFAULT_LOCATION, RADIUS_STEPS[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const recenter = (loc: LatLng, zoom = 13) => {
    setLocation(loc);
    setView({ ...loc, zoom, nonce: Date.now() });
  };

  // Reverse-geocode for a friendly city label (best-effort).
  const reverseLabel = useCallback(async (loc: LatLng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${loc.lat}&lon=${loc.lng}&format=json&accept-language=ar`,
      );
      const data = (await res.json()) as { address?: Record<string, string> };
      const a = data.address ?? {};
      setLocationLabel(a.city || a.town || a.village || a.county || a.state || '');
    } catch {
      setLocationLabel('');
    }
  }, []);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setNotice(t.doctors.locationError);
      return;
    }
    setDetecting(true);
    setNotice('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setDetecting(false);
        setRadiusIndex(0);
        recenter(loc);
        void reverseLabel(loc);
        void loadDoctors(loc, RADIUS_STEPS[0]);
      },
      () => {
        setDetecting(false);
        setNotice(t.doctors.locationDenied);
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  const searchCity = async (event: React.FormEvent) => {
    event.preventDefault();
    const q = city.trim();
    if (!q) return;
    setGeocoding(true);
    setNotice('');
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&countrycodes=ma&limit=1`,
      );
      const data = (await res.json()) as { lat: string; lon: string; display_name: string }[];
      if (!data.length) {
        setNotice(t.doctors.geocodeError);
        return;
      }
      const loc = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      setLocationLabel(data[0].display_name.split(',')[0]);
      setRadiusIndex(0);
      recenter(loc);
      void loadDoctors(loc, RADIUS_STEPS[0]);
    } catch {
      setNotice(t.doctors.geocodeError);
    } finally {
      setGeocoding(false);
    }
  };

  const expandRadius = () => {
    const next = Math.min(radiusIndex + 1, RADIUS_STEPS.length - 1);
    setRadiusIndex(next);
    void loadDoctors(location, RADIUS_STEPS[next]);
  };

  const focusDoctor = (doc: Doctor) => {
    setView({ lat: doc.lat, lng: doc.lng, zoom: 15, nonce: Date.now() });
    const marker = markerRefs.current.get(doc.id);
    if (marker) window.setTimeout(() => marker.openPopup(), 350);
  };

  const filtered = useMemo(
    () => (filter === 'all' ? doctors : doctors.filter((d) => d.specialty === filter)),
    [doctors, filter],
  );

  const filterOptions: { key: Filter; label: string; emoji: string }[] = [
    { key: 'all', label: t.doctors.filters.all, emoji: '🩺' },
    { key: 'oncologist', label: t.doctors.filters.oncologist, emoji: '🔬' },
    { key: 'radiologist', label: t.doctors.filters.radiologist, emoji: '📡' },
    { key: 'gynecologist', label: t.doctors.filters.gynecologist, emoji: '👩‍⚕️' },
  ];

  const canExpand = radiusIndex < RADIUS_STEPS.length - 1;

  return (
    <PageTransition>
      <header className="mx-auto max-w-3xl text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-rose-gradient text-white shadow-petal-lg">
          <Stethoscope size={26} />
        </div>
        <h1 className="mt-4 text-4xl font-black text-ink">{t.doctors.title}</h1>
        <p className="mt-2 text-lg font-medium leading-8 text-muted">{t.doctors.subtitle}</p>
      </header>

      {/* Location bar */}
      <section className="mx-auto mt-6 max-w-3xl rounded-[2rem] border border-white/70 bg-card/85 p-4 shadow-petal-xl sm:p-5">
        <div className="grid gap-3 sm:grid-cols-[auto_1fr]">
          <Button
            variant="secondary"
            onClick={detectLocation}
            loading={detecting}
            leftIcon={!detecting ? <Crosshair size={18} className="text-primary-500" /> : undefined}
          >
            {detecting ? t.doctors.detecting : t.doctors.detectBtn}
          </Button>
          <form onSubmit={searchCity} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder={t.doctors.searchPlaceholder}
                aria-label={t.doctors.searchPlaceholder}
                className="h-12 w-full rounded-full border border-line bg-card ps-9 pe-4 text-[15px] font-bold text-ink shadow-petal outline-none transition focus:border-primary-300"
              />
            </div>
            <Button type="submit" loading={geocoding} className="shrink-0">
              {t.doctors.searchBtn}
            </Button>
          </form>
        </div>

        {(locationLabel || notice) && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {locationLabel && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1.5 text-sm font-black text-primary-700">
                <MapPin size={14} /> {locationLabel}
              </span>
            )}
            {notice && <span className="text-sm font-bold text-risk-moderate">{notice}</span>}
          </div>
        )}

        {/* Filters */}
        <div className="mt-4 flex flex-wrap gap-2">
          {filterOptions.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setFilter(opt.key)}
              aria-pressed={filter === opt.key}
              className={cn(
                'focus-ring inline-flex h-10 items-center gap-1.5 rounded-full border px-4 text-sm font-black transition',
                filter === opt.key
                  ? 'border-primary-400 bg-rose-gradient text-white shadow-petal'
                  : 'border-line bg-white/60 text-ink hover:border-primary-200',
              )}
            >
              <span aria-hidden>{opt.emoji}</span>
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      {/* Map */}
      <section className="mx-auto mt-6 max-w-5xl">
        <div className="overflow-hidden rounded-3xl border border-white/70 shadow-petal-xl">
          <MapContainer
            center={[DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng]}
            zoom={12}
            scrollWheelZoom={false}
            style={{ height: '60vh', width: '100%' }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution={t.doctors.attribution} />
            <MapController view={view} />
            <Marker position={[location.lat, location.lng]} icon={userIcon} zIndexOffset={1000}>
              <Popup>{t.doctors.you}</Popup>
            </Marker>
            {filtered.map((doc) => (
              <Marker
                key={doc.id}
                position={[doc.lat, doc.lng]}
                icon={doctorIcon(SPECIALTY_COLOR[doc.specialty])}
                ref={(ref) => {
                  if (ref) markerRefs.current.set(doc.id, ref);
                  else markerRefs.current.delete(doc.id);
                }}
              >
                <Popup>
                  <strong>{doc.name}</strong>
                  <br />
                  {t.doctors.specialties[doc.specialty]}
                  {doc.address && (
                    <>
                      <br />
                      {doc.address}
                    </>
                  )}
                  {doc.phone && (
                    <>
                      <br />
                      <a href={`tel:${doc.phone}`}>📞 {doc.phone}</a>
                    </>
                  )}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
        <p className="mt-2 text-center text-xs font-semibold text-faint">{interpolate(t.doctors.radiusLabel, { km: radius / 1000 })}</p>
      </section>

      {/* Results */}
      <section className="mx-auto mt-6 max-w-3xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-black text-ink">
            {loading ? t.doctors.loading : interpolate(t.doctors.resultsCount, { n: filtered.length })}
          </h2>
        </div>

        {usedFallback && !loading && (
          <p className="mb-3 rounded-2xl bg-primary-50 p-3 text-sm font-bold text-primary-800">{t.doctors.fallbackNote}</p>
        )}

        {loading ? (
          <div className="grid gap-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-3xl border border-line bg-card p-6 text-center shadow-petal">
            <p className="text-4xl" aria-hidden>🔍</p>
            <p className="mt-3 font-bold leading-7 text-muted">{t.doctors.noResults}</p>
            {canExpand && (
              <Button className="mt-4" variant="secondary" onClick={expandRadius}>
                {interpolate(t.doctors.expandRadius, { km: RADIUS_STEPS[radiusIndex + 1] / 1000 })}
              </Button>
            )}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="grid gap-3">
              {filtered.map((doc, i) => (
                <motion.article
                  key={doc.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: Math.min(i * 0.03, 0.3) }}
                  onClick={() => focusDoctor(doc)}
                  style={{ borderInlineStartWidth: 4, borderInlineStartColor: SPECIALTY_COLOR[doc.specialty] }}
                  className="group cursor-pointer rounded-3xl border border-line bg-card p-4 shadow-petal transition hover:-translate-y-0.5 hover:shadow-petal-lg"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate font-black text-ink">{doc.name}</h3>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2">
                        <Badge tone={SPECIALTY_BADGE[doc.specialty]}>{t.doctors.specialties[doc.specialty]}</Badge>
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-muted">
                          <MapPin size={12} />
                          {interpolate(t.doctors.distanceAway, { km: doc.distanceKm.toFixed(1) })}
                        </span>
                      </div>
                      {doc.address && <p className="mt-1.5 truncate text-sm font-medium text-muted">{doc.address}</p>}
                    </div>
                    {doc.phone && (
                      <a
                        href={`tel:${doc.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="focus-ring inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-rose-gradient px-4 text-sm font-black text-white shadow-petal active:scale-95"
                      >
                        <Phone size={15} />
                        {t.doctors.callBtn}
                      </a>
                    )}
                  </div>
                </motion.article>
              ))}
            </div>
          </AnimatePresence>
        )}

        {!loading && filtered.length > 0 && canExpand && (
          <div className="mt-4 text-center">
            <Button variant="outline" onClick={expandRadius}>
              {interpolate(t.doctors.expandRadius, { km: RADIUS_STEPS[radiusIndex + 1] / 1000 })}
            </Button>
          </div>
        )}
      </section>
    </PageTransition>
  );
}

export default DoctorsPage;
