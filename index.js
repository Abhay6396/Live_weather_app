const http = require('http');
const fs = require('fs');
const requests = require('requests');
const homefile = fs.readFileSync('index.html', 'utf-8');

const replaceval = (tempval, orig) => {
    let temperature = tempval.replace("{%tempval%}", orig.main.temp);
    temperature = temperature.replace("{%tempmin%}", orig.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", orig.main.temp_max);
    temperature = temperature.replace("{%country%}", orig.sys.country);
    temperature = temperature.replace("{%city%}", orig.name);
    return temperature;
}

const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests('https://api.openweathermap.org/data/2.5/weather?q=aligarh&appid=2a3afc7364083d27cae7d66fc5285982')
            .on('data', (chunk) => {
                const obj = JSON.parse(chunk);
                const Data = [obj];
                let realtimedata = replaceval(homefile,Data[0]);
                // const realtimedata = Data.map((val) => replaceval(homefile, val)).join("");
                res.write(realtimedata);
                res.end()
            })
            .on('end', (err) => {
                if (err) {
                    console.log('Error:', err);
                    res.statusCode = 500; // Internal Server Error
                    res.end('Internal Server Error');
                }
            });
    }
});

const PORT = 3000;
const HOST = '127.0.0.1';

server.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}/`);
});
