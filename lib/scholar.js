var cheerio = require('cheerio')
var axios = require('axios')

var { headers, SITE } = require('./config');

const scholar = async (url) => {

    const articles = [];
  
    await axios.get(url, { headers })
        .then(response => {
            return response.data;
        })
  
        .then(data => {
            const $ = cheerio.load(data);
  
            $('.gs_r.gs_or.gs_scl').each((i, element) => {
                const title = $(element).find('.gs_rt a').text();
                const link = $(element).find('.gs_rt a').attr('href');
                const authorsAndPublication = $(element).find('.gs_a').text();
                const excerpt = $(element).find('.gs_rs').text();
                const access = $(element).find('.gs_fl a').attr('href');
  
                const citedByElement = $(element).find('a:contains("Cited by")');
                const citedBy = SITE + citedByElement.attr('href');
                const citedByAmount = citedByElement.text().replace('Cited by ', '');
                
                const relatedArticles = SITE + $(element).find('a:contains("Related articles")').attr('href');
                const versionHistory = SITE + $(element).find('a:contains("All")').attr('href');
  
                articles.push({
                    title,
                    link,
                    authorsAndPublication,
                    excerpt,
                    access,
                    citedBy,
                    citedByAmount,
                    relatedArticles,
                    versionHistory
                });
            });
        })
        .catch(error => {
            throw error;
        });
  
    return articles;
}



module.exports = scholar;