var cheerio = require('cheerio');
var axios = require('axios');

var { SITE, API_KEY } = require('./config');

const proxy = async (urls) => {
    const response = await axios({
        method: 'GET',
        url: urls,
        // Remove or comment out the proxy section
        // proxy: {
        //     host: 'proxy-server.scraperapi.com',
        //     port: 8001,
        //     auth: {
        //         username: 'scraperapi.autoparse=true.device_type=desktop',
        //         password: process.env.API_KEY,
        //     },
        //     protocol: 'http'
        // }
    });

    return response.data;
};


const extraction = async (URL) => {
    const articles = [];
    const page = await proxy(URL);
    const $ = cheerio.load(page);

    $('.gs_r.gs_or.gs_scl').each((i, element) => {
        const title = $(element).find('.gs_rt a').text() || '';
        const article = $(element).find('.gs_rt a').attr('href') || '';

        const authorsText = $(element).find('.gs_a').text().split('-')[0] || '';
        const authors = authorsText
            .split(',')
            .map((author) => author.trim().replace('…', ''));

        const authorProfileID = $(element).find('.gs_a a').attr('href') || '';

        const publicationText =
            $(element).find('.gs_a').text().split('-').slice(1) || [];
        const publication = publicationText.map((detail) => detail.trim());
        const excerpt = $(element).find('.gs_rs').text() || '';
        const access = $(element).find('.gs_fl a').attr('href') || '';

        const citedByElement = $(element).find('a:contains("Cited by")');
        const citedByID = citedByElement.attr('href') || '';
        const citationCount =
            parseInt(citedByElement.text().replace('Cited by ', '')) || '';

        const relatedArticlesID =
            $(element).find('a:contains("Related articles")').attr('href') ||
            '';
        const versionHistoryID =
            $(element).find('a:contains("All")').attr('href') || '';

        const authorProfile = authorProfileID
            ? `${SITE}${authorProfileID}`.split('&')[0]
            : '';
        const relatedArticles = relatedArticlesID
            ? `${SITE}${relatedArticlesID}`.split('&')[0]
            : '';
        const versionHistory = versionHistoryID
            ? `${SITE}${versionHistoryID}`.split('&')[0]
            : '';
        const citedBy = citedByID ? `${SITE}${citedByID}`.split('&')[0] : '';

        articles.push({
            title,
            article,
            authors,
            authorProfile,
            publication,
            excerpt,
            access,
            citedBy,
            citationCount,
            relatedArticles,
            versionHistory,
        });
    });

    return articles;
};

const profileExtraction = async (URL) => {
    const profile = [];
    const articles = [];

    const page = await proxy(URL);
    const $ = cheerio.load(page);

    const name = $('title').text().split('-')[0].trim() || '';
    const photo = $('meta[property="og:image"]').attr('content') || '';
    const description =
        $('meta[name="description"]')
            .attr('content')
            .split('-')
            .map((detail) => detail.trim()) || '';

    profile.push({
        name,
        photo,
        description,
    });

    $('tr.gsc_a_tr').each((i, element) => {
        const title = $(element).find('.gsc_a_t a').text() || '';
        const article =
            $(element).find('.gsc_a_c a').attr('href').split('&').slice(-1) ||
            '';
        const authors =
            $(element)
                .find('.gsc_a_t .gs_gray')
                .first()
                .text()
                .split(',')
                .map((author) => author.trim()) || '';
        const publication =
            $(element).find('.gsc_a_t .gs_gray').last().text().split(',')[0] ||
            '';
        const citationCount =
            parseInt($(element).find('.gsc_a_c a').text()) || '';
        const year = parseInt($(element).find('.gsc_a_y span').text()) || '';

        articles.push({
            title,
            article,
            authors,
            publication,
            citationCount,
            year,
        });
    });

    return { profile, articles };
};

const academicExtraction = async (URL) => {
    const profiles = [];

    const page = await proxy(URL);
    const $ = cheerio.load(page);

    $('.gsc_1usr').each((i, element) => {
        const name = $(element).find('.gs_ai_name a').text() || '';
        const profileID = $(element).find('.gs_ai_name a').attr('href') || '';
        const affiliation = $(element).find('.gs_ai_aff').text() || '';
        const citationCount =
            parseInt($(element).find('.gs_ai_cby').text().split(' ')[2]) || '';

        const profile = profileID
            ? `${SITE}/citations?${profileID.split('&')[1]}`
            : '';

        profiles.push({
            name,
            profile,
            affiliation,
            citationCount,
        });
    });

    return profiles;
};

module.exports = { extraction, profileExtraction, academicExtraction };
