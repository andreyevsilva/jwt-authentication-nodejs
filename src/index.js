const express = require('express');
const app = express();

const routes = require('../src/app/routes');

require('dotenv/config');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(routes);

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port: ${process.env.PORT}`);
}); 