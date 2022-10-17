const port = process.env.PORT || 3001
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const { response } = require('express')
const res = require('express/lib/response')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))



const fetchProducts = async (searchParam) => {
    
    try {
        const response = await axios.get(`https://www.jumia.com.ng/catalog/?q=${searchParam}`);
 
        const html = response.data;
      
        const $ = cheerio.load(html);
        console.log(html)

        const products = [];
 
  $('article.prd._fb.col.c-prd').each((_idx, el) => {
            const product = $(el)
            const url = product.find('a.core').attr('href')
            const image = product.find('img.img').attr('src')
            const title = product.find('h3.name').text()
            const price = product.find('div.prc').text()
 
            products.push({
                url:"https://jumia.com.ng" +url,
                image,
                title,
                price
            })
        });

 
        return products;

    } catch (error) {
        throw error;
    }
 };



app.get('/', (req,res)=>{
    res.json({ping:'pong'})
})

app.post('/search', async(req,res)=>{
    const searchParam = req.body.searchParam
    const prod = await fetchProducts(searchParam)
  res.json({message:"success", prod})
})

app.listen(port, ()=>{
    console.log(`server running on port ${port}`);
})


