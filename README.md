# Scholar API

The Scholar API provides functionality to retrieve search results, citations, and profiles from Google Scholar.

## Routes

Explore available routes in the `/routes` directory or visit the [Rapid API deployment](https://rapidapi.com/JamieThomasAnderson/api/scholar-api2) for detailed documentation.

## Installation

```
git clone https://github.com/JamieThomasAnderson/scholar-api
cd ./scholar-api
npm install
```

To use the API, you need to set up a ScraperAPI key for proxying requests. Add your ScraperAPI key to a `.env.local` file:

```
# in .env.local
API_KEY=YOUR_SCRAPER_API_KEY
```

If you're interested, you can also check out [polytree](https://github.com/JamieThomasAnderson/polytree), which utilizes the Scholar API to populate search results.
