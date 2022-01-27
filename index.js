const port = process.env.PORT || 3000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const { response } = require('express')
const res = require('express/lib/response')

const app = express()
const movieSites = [
    {
    site: '02tv',
    link: 'https://o2tvseriesz.com/hollywood/'
    },
    {
    site: 'netnaija',
    link: 'https://www.thenetnaija.co/videos/movies'
    }
]
const movies = [] 
movieSites.forEach(movieSite => {
    axios.get(movieSite.link)
    .then(response=>{
        const html = response.data
        const $ = cheerio.load(html)
        if (movieSite.site == '02tv') {
            $('a:contains("Download")', html).each(function(){
                const title = $(this).text()
                const url = $(this).attr('href')
                movies.push({
                    title,
                    url,
                    site : movieSite.site
                })
            })
        } else{
            $('a:contains("20")', html).each(function(){
                const title = $(this).text()
                const url = $(this).attr('href')
                movies.push({
                    title,
                    url,
                    site : movieSite.site
                })
            })
        }
        
    }).catch(err => console.log(err))
})

app.get('/', (req,res)=>{
    res.json('welcome to my movies api')
})

app.get('/movies', (req,res)=>{
  res.json(movies)
})

app.listen(port, ()=>{
    console.log(`server running on port ${port}`);
})


