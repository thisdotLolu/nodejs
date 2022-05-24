const fs=require('fs')
const http=require('http')
const url=require('url')



////------------FILES
//Blocking,synchronous

/*


const textIn=fs.readFileSync('./txt/input.txt','utf-8')
console.log(textIn)
const textOut=`Write this ${textIn}`
fs.writeFileSync('./txt/output.txt',textOut)
console.log('file written')

//Non-blocking Asynchronous

fs.readFile('./txt/start.txt','utf-8',(err,data1)=>{
    fs.readFile(`./txt/${data1}.txt`,'utf-8',(err,data2)=>{
        console.log(data2)
        fs.readFile(`./txt/append.txt`,'utf-8',(err,data3)=>{
            console.log(data3)

            fs.writeFile('./txt/final.txt',`${data2}\n${data3}`,'utf-8',(err)=>{
                console.log('your file has been written')
            })
        }) 
    })    
})



*/

///////////////SERVER

//replaceTemplate is a customised function for uopdating the html with the data from the data.json
//temp argument will be the Html file to replace values in(the values are e.g {%PRODUCTNAME%})
//product is one instance of an object in the data.json
const replaceTemplate=(temp,product)=>{
    let output=temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output =output.replace(/{%IMAGE%}/g, product.image)
    output =output.replace(/{%PRICE%}/g, product.price)
    output =output.replace(/{%FROM%}/g, product.from)
    output =output.replace(/{%NUTRIENTS%}/g, product.nutrients)
    output =output.replace(/{%QUANTITY%}/g, product.quantity)
    output =output.replace(/{%DESCRIPTION%}/g, product.description)
    output =output.replace(/{%ID%}/g, product.id)
    // output =output.replace(/{%IMAGE%}/g, product.image)
    if(!product.organic)output=output.replace(/{%NOT_ORGANIC%}/g,'not-organic')

    return output
}


///reading files from html
const tempOverview=fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8')
const tempCard=fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8')
const tempProd=fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8')

const data=fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8')
const dataObj=JSON.parse(data);


const server=http.createServer((req,res)=>{
    console.log(req.url)
    const{query,pathName}=url.parse(req.url,true)
////ROUTING

//////overview page
    if(pathName==='/' || pathName==='/overview'){
        res.writeHead(200, {'Content-type':'text/html'})
        //map through the data from json, call the replace template function
        const cardsHtml=dataObj.map(el=>replaceTemplate(tempCard,el)).join('')
        //the ouput from template-overview
        const output=tempOverview.replace('{%PRODUCT_CARDS%}',cardsHtml)
        //output to overview page
        res.end(output);     
    }
    //Product page
    else if(pathName==='/product'){
        const product=dataObj[query.id]
        res.end('This is the product')

        //API SIMPLE

        //API Page
    }else if(pathName=='/api'){
        fs.readFile(`${__dirname}/dev-data/data.json`,'utf-8',(err,data)=>{
            const productData=JSON.parse(data)
            res.writeHead(200,{'Content-Type':'application/json'})
            res.end(data)
        })
        //dirname is the current directory
    }
    //Not found
    else{
        res.writeHead(404,{
            'Content-type':'text/html',
            'my-own-header':'hello-world'
        })
        res.end('<h2>page not found</h2>')
    }
//    res.end('hello from server')
})

server.listen(8080,'127.0.0.1',()=>{
    console.log('Listening to requests on port 8080')
})

///BUILDING A SIMPLE API





































































































