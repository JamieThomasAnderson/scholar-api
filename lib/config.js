const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Referer': 'https://www.google.com/',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Cache-Control': 'max-age=0'
  };
  
const SITE = 'https://scholar.google.com'

const URL_PATTERN = /^https:\/\/scholar\.google\.com\.au\/scholar\?q=.+$/;

module.exports = {
    HEADERS,
    SITE,
    URL_PATTERN
}