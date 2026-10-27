# OSIRIS Map Startup Fix

The OSIRIS map now loads its CARTO Dark Matter style from the local OSIRIS public asset:
`/osiris/dark-matter-style.json`.

CARTO vector tiles, sprites and glyphs referenced by that style are still fetched through the existing
same-origin `/api/proxy-tiles` bridge, so the external basemap remains the same. This removes the
initial cross-origin style fetch as a startup dependency and makes the map deterministic behind the
CIPHER same-origin proxy.

MapLibre `error` and `webglcontextlost` events are now logged with an `[OSIRIS][MAP]` prefix so a
failed renderer cannot silently present a black map.
