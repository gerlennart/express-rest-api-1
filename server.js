import express from 'express';
import { Datenbank } from './datenbank.js';

//-------------------
// Datenbank
//-------------------
const datenbank = new Datenbank();
const message = await datenbank.verbinden('tiere.sqlite3');
console.log(message);

await datenbank.reset();


//-------------------
// Webserver
//-------------------
const app = express();

// Für POST: request.body
app.use(express.json());

//---------------------------------------
// Webserver für statische Dateien GET /
//---------------------------------------
app.use(express.static('public'));

// C R E A T E
//-------------------
// POST /tiere/
//-------------------
app.post('/tiere/', async (request, response) => {
    const neuesTier = request.body;
    await datenbank.createTier(neuesTier);
    response.sendStatus(204);
});

// R E A D
//-------------------
// GET /tiere/
//-------------------
app.get('/tiere/', async (request, response) => {
    // Sortierreihenfolge
    const order = request.query.order;
    let tiereVonDB;    

    // alle Tiere von Datenbank holen
    switch (order) {
        case 'spezies':            
            tiereVonDB = await datenbank.readAllTiereOrderdBySpezies();
            break;
        case 'farbe':
            tiereVonDB = await datenbank.readAllTiereOrderdByFarbe();
            break;
        default:
            tiereVonDB = await datenbank.readAllTiere();            
    }
    
    response.send(tiereVonDB);    
});

//-------------------
// GET /tiere/{id}
//-------------------
app.get('/tiere/:id', async (request, response) => {
    const id = request.params.id;

    const tierVonDB = await datenbank.readTier(id);
    if (tierVonDB) {
        // passendes Tier gefunden
        response.send(tierVonDB);
    } else {
        // kein passendes Tier gefunden
        response.sendStatus(404);
    }
});

// U P D A T E
//-------------------
// PUT /tiere/{id}
//-------------------
app.put('/tiere/:id', async (request, response) => {
    const neuesTier = request.body;
    neuesTier.id = request.params.id;
    const anzahlGeaenderteDatensaetze = await datenbank.updateTier(neuesTier);
    if (anzahlGeaenderteDatensaetze > 0) {
        response.sendStatus(204);
    } else {
        response.sendStatus(404);
    }
});

// D E L E T E
//-------------------
// DELETE /tiere/{id}
//-------------------
app.delete('/tiere/:id', async (request, response) => {
    const id = request.params.id;

    const anzahlGeloeschteTiere = await datenbank.deleteTier(id);
    if (anzahlGeloeschteTiere > 0) {
        response.sendStatus(204);
    } else {
        response.sendStatus(404);
    }
});

//-------------------
// Server starten
//-------------------
app.listen(27500, () => {
    console.log('Server läuft auf Port 27500.');
});