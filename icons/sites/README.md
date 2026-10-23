These are placeholder icons (colored circle + first letter), not official
brand logos. Before publishing, replace each file below with the real
brand SVG from https://simple-icons.github.io/simple-icons-website/
(free, CC0) - just keep the same filename so nothing else needs to change.

- imdb.svg
- tvmaze.svg
- rottentomatoes.svg
- tmdb.svg
- netflix.svg
- plex.svg
- letterboxd.svg
- metacritic.svg
- boxofficemojo.svg
- disneyplus.svg
- max.svg (formerly HBO Max)
- primevideo.svg
- myanimelist.svg
- anilist.svg
- awards.svg (a generic trophy/star icon is fine - this isn't a brand logo)
- wikipedia.svg
- twitter.svg
- instagram.svg
- website.svg (a generic globe/link icon is fine - this isn't a brand logo)
- whoscored.svg (Football Team card footer link - placeholder circle+"W")
- soccerway.svg (Football Team card footer link - placeholder circle+"S". Note:
  Soccerway rebranded to "Scorebar" - the link itself now points at
  scorebar.com, so consider a logo that matches the new brand instead)
- appstore.svg (Games "Search Stores" row - placeholder circle+"A". Used to
  reuse mobile.svg, same as googleplay.svg below, which made the two
  impossible to tell apart in the store-circle row - split out.)
- googleplay.svg (Games "Search Stores" row - placeholder circle+"G")
- cheapshark.svg (Games "Price Comparison" row - placeholder circle+"C")
- openlibrary.svg (Books footer link - placeholder circle+"O")
- goodreads.svg (Books footer link - placeholder circle+"G")
- googlebooks.svg (Books footer link - placeholder circle+"B")

## Missing files - create these next

Labels the packs send that are registered in core.js SITE_ICONS (or about
to be) but whose SVG file doesn't exist yet, so they currently render as
plain-text buttons or broken images:

- musicbrainz.svg - Music footer. A file named "musicbrainz - Copy.svg"
  already exists here; rename/copy it to this exact name.
- lastfm.svg - Music footer. Same situation: rename "lastfm - Copy.svg".
- espn.svg - Sports footer. The Sports pack sends labels like "ESPN NBA"
  (dynamic suffix per league); see sports-data.js getSportsSiteLinks -
  either fix the label to a constant "ESPN" or add per-league files.
- olympics.svg - Sports footer (label: "Olympics.com").
