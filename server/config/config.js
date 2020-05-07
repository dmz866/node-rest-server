process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://admin:Q1KASRMbkoSwyrKV@cluster0-awerm.mongodb.net/cafe';
}

process.env.URL_DB = urlDB;

// TOKEN
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// GOOGLE CLIENT
process.env.CLIENT_ID = process.env.CLIENT_ID || 'asdasd';