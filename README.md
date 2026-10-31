# UAV Mapping

Turn a UAV or oblique neighborhood photograph into an annotated image and an editable approximate 2D map. Houses share the same IDs in both views. Streets, ponds, landmarks and unresolved roof clusters have separate feature types.

## Run

Requires Node.js 22 or newer. No package installation is needed.

```sh
git clone https://github.com/AmeyMishra2024/UAV-mapping.git
cd UAV-mapping
npm start
```

Open http://localhost:3000. Load the synthetic example to try editing without an API key, or upload a PNG, JPEG or WebP.

## Automatic mapping

Copy `.env.example` to `.env` and set `OPENAI_API_KEY` to your own OpenAI API key. `OPENAI_MODEL` defaults to `gpt-6-astra`; change it to a compatible image-input Responses model available to your account. Restart the server, upload a photograph, and click **Analyze photograph**. This sends that image to OpenAI and incurs API charges. The key stays on the local server, never in browser code or project exports. The app does not save uploaded photographs on the server. Responses use `store: false`.

The model returns normalized vector geometry and qualitative evidence ratings, rather than a newly generated picture. Original image pixels remain intact. Output is validated for feature types, coordinate bounds, geometry size, and unique IDs. Every detection must be reviewed. Model coordinates, building counts, and schematic relationships may be wrong. Live provider access is not part of the automated test suite.

## Manual correction and export

- Choose a house, street, pond, landmark, or cluster tool. Click vertices on the photo, then press Enter or Finish feature. Escape cancels the draft.
- Use Select to inspect features. Drag vertex handles in either panel. Photo and map geometry are independent; manual features initially reuse photo coordinates until you refine the map.
- Change the selected feature's confidence or evidence note. Undo restores the previous project state. Delete selected removes the feature from both panels.
- Save project downloads JSON with the image and annotations. Import project restores it. Keep this file private if the photograph is private.
- Export paired SVG downloads both views in a single vector graphic with the source image embedded. Feature geometry, line patterns and IDs remain visible. The export respects the low-confidence visibility toggle.

Solid lines mean high confidence from visible evidence. Dashed means medium confidence or inference. Dotted means low confidence or speculation. These are ordinal judgments, not calibrated probabilities. A feature's note explains its basis. Unresolved distant roofs should be clusters rather than invented individual buildings.

## Limits

The 2D panel is an image-conditioned schematic, not a surveyed orthomosaic. One oblique photograph cannot establish true ground footprints, hidden road connectivity, scale, north, heights, or geographic coordinates. Roof geometry is not ground geometry. The app does not perform photogrammetry, SLAM, georeferencing, flight planning or multi-image reconstruction. Use calibrated overlapping imagery and surveyed ground control for metric mapping. Photographs are resized and letterboxed without changing their aspect ratio into a fixed editing viewport; exports use the same normalization.

## Tests

```sh
npm test
```

Tests cover unique IDs, geometry bounds, project round trips, provider-response parsing using a mock, missing credentials, static serving, and cross-origin request rejection. The server binds to loopback only. Do not expose it publicly without adding authentication, quotas, and deployment controls.

API reference: https://developers.openai.com/api/docs/guides/images-vision
