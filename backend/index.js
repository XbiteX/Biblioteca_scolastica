const auth = require('./middleware/auth.js'); // importo il file auth.js
const authAdmin = require('./middleware/authAdmin.js'); // importo il file authAdmin.js
const buildazioneToken = require('./utilities.js'); // importo il file utilities.js
const express = require('express');
const jwt = require('jsonwebtoken'); // importo il pacchetto jsonwebtoken
const cors = require('cors');
const bodyParser = require('body-parser');
const {MongoClient, ObjectId, Binary} = require('mongodb');

 
const app = express();
app.use(cors());
app.use(bodyParser.json());
 
require('dotenv').config();
 
let database;
 
const connectToData = async () => {
    try{
        const client = await MongoClient.connect(process.env.MONGO_URI);
        console.log('connect to database');
        return client.db('BookStoreOnline'); // nome del database
    } catch(error){
        console.error(error);
        process.exit(1);
    }
   
}
 
const startServer = async () => {
    database = await connectToData();
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
}
 
app.get('/', (req, res) => {
    res.send('Hello there!');
});

//LOGIN route
app.post("/login", async (req,res)=>{
    if(!database){
        return res.status(500).json({message: "database not connected"});
    }
    try{
        const codiceISA = parseInt(req.body.isa); // prende il codice isa dal body della richiesta
        const password = req.body.password; // prende la password dal body della richiesta

        if(!codiceISA){return res.status(400).json({message: "codice ISA non fornito"});}
        if(!password){return res.status(400).json({message: "password non fornita"});}

        const user = await database.collection("users").findOne(
            {
                isa: codiceISA,
                password: password
            })

        console.log(user)

        if(!user){
            return res.status(400).json({message:"utente non trovato"})
        }

        let token = buildazioneToken(user.isa, process.env.CHIAVE_JWT, user.ruolo) // creazione del token attraverso la funzione importata
        console.log(token) 

        const decoded = jwt.verify(token, process.env.CHIAVE_JWT); //verifica della correttezza del token

        if (!decoded) { //se il tokejn non è valido / non corrisponde mostra un messaggio di errore
            return res.status(401).json({ message: "Token non valido" });
        }else{
            console.log("token valido")
        }

        res.json({ //ritorna il token al client
            success:true,
            token:token,
            message: "token generato con successo",
            ruolo: user.ruolo,
            isa: user.isa,
        })
    }catch(error) {
        console.error(error);
    }


})

startServer();

app.get("/books", auth, async (req, res) => {
    if (!database) {
        return res.status(500).json({ message: 'Internal server error' });
    }
    try {
        const autore = req.query.autore;
        const titolo = req.query.titolo;
        const lingua = req.query.lingua;
        const stato = req.query.stato;
        const collocazione = req.query.collocazione;
        const prestabile = req.query.prestabile === 'true'; // Converti la stringa 'true' in booleano
        const ordinamento = req.query.ordinamento;

        const filter = {};

        if (autore) filter["autore"] = autore;
        if (titolo) filter["titolo"] = titolo;
        if (lingua) filter["lingua"] = lingua;
        if (stato) filter["stato"] = stato;
        if (collocazione) filter["collocazione"] = collocazione;
        if (prestabile) filter["prestabile"] = prestabile;

        let result = await database.collection('books').find(filter).toArray();

        // Converti campo img da BSON Binary a base64 per essere visualizzati sul frontend
        const libriConImgBase64 = result.map(libro => {
            if (libro.img && libro.img.buffer) {
                // Converti buffer in base64 con prefisso data URL (modifica MIME se serve)
                const base64img = libro.img.buffer.toString('base64');
                return {
                    ...libro,
                    img: `data:image/jpeg;base64,${base64img}`
                };
            }
            return libro;
        });

    
        if (ordinamento) {
            libriConImgBase64.sort((a, b) => {
                if (a[ordinamento] < b[ordinamento]) return -1;
                if (a[ordinamento] > b[ordinamento]) return 1;
                return 0;
            });
        }

        return res.json(libriConImgBase64);

    } catch (error) {
        console.error(`Internal getting books`, error);
        return res.status(500).json({ message: 'Internal error' });
    }
});



//rotta per aggiungere un libro, solo l'admin lo può fare
app.post("/addBook", authAdmin, async (req, res) => {
    if(!database) {
        return res.status(500).json({message: 'Internal server error'});
    }
    
    try{
        let book = req.body; // prendo il libro dal body della richiesta
        
        if(!book || typeof book !== 'object' || Object.keys(book).length === 0) {
            return res.status(400).json({message: 'Oggetto libro non valido o vuoto'});
        }

        // Validazione dei campi obbligatori
        if(!book._id){
            return res.status(400).json({message: "ID del libro non fornito"})
        }
        if(!book.collocazione){
            return res.status(400).json({message: "collocazione non fornita"})
        }
        if(!book.autore){
            return res.status(400).json({message: "autore del libro non fornito"})
        }
        if(!book.titolo){
            return res.status(400).json({message: "titolo del libro non fornito"})
        }
        if(!book.lingua){
            return res.status(400).json({message: "lingua del libro non fornito"})
        }

        // Gestione dei campi opzionali
        const fields = ["cdd", "note", "prestabile", "stato", "argomenti"];
        fields.forEach(element => {
            if(book[element] === undefined) {
                book[element] = ""; // se il campo non è definito lo setto a stringa vuota
            }
        });

        // **GESTIONE DELL'IMMAGINE**
        if(book.img) {
            try {
                // Verifica che sia un data URL valido (base64)
                if(!book.img.startsWith('data:image/')) {
                    return res.status(400).json({message: 'Formato immagine non valido. Deve essere base64.'});
                }

                // Estrai il tipo MIME e i dati base64
                const matches = book.img.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
                if(!matches || matches.length !== 3) {
                    return res.status(400).json({message: 'Formato base64 non valido.'});
                }

                const mimeType = matches[1]; // es. "image/jpeg"
                const base64Data = matches[2]; // dati base64 puri

                // Verifica che sia effettivamente un'immagine
                if(!mimeType.startsWith('image/')) {
                    return res.status(400).json({message: 'Il file deve essere un\'immagine.'});
                }

                // Converti base64 in Buffer
                const imageBuffer = Buffer.from(base64Data, 'base64');

                // Verifica dimensione dell'immagine (es. max 5MB)
                const maxSize = 5 * 1024 * 1024; // 5MB
                if(imageBuffer.length > maxSize) {
                    return res.status(400).json({message: 'Immagine troppo grande. Massimo 5MB.'});
                }

                // Converti in BSON Binary per MongoDB
                book.img = new Binary(imageBuffer); // Salva direttamente come Binary

                console.log(`Immagine processata: ${mimeType}, ${imageBuffer.length} bytes`);

            } catch(imageError) {
                console.error('Errore processing immagine:', imageError);
                return res.status(400).json({message: 'Errore nel processamento dell\'immagine.'});
            }
        }

        // Inserisci il libro nel database
        const result = await database.collection("books").insertOne(book);

        if(result.acknowledged === false) {
            return res.status(500).json({message: 'Errore durante l\'inserimento del libro'});
        }

        console.log(`Libro inserito con successo. ID: ${result.insertedId}`);
        return res.status(200).json({
            message: 'Libro aggiunto con successo',
            bookId: result.insertedId,
            hasImage: !!book.img
        });

    } catch(error){
        if (error.code === 11000) { // l'errore 11000 indica che l'id è già presente nel database
            return res.status(409).json({ message: 'ID già esistente nel database' });
        }
        console.error(`Errore durante l'aggiunta del libro:`, error);
        return res.status(500).json({message: 'Errore interno del server'});
    }
});

//rotta per eliminare un libro, solo l'admin lo può fare
app.delete("/deleteBook",authAdmin, async (req, res) => {
    if(!database) {
        return res.status(500).json({message: 'Internal server error'});
    }
    try{
        const bookID = req.body.id; // prendo l'id dal body della richiesta
        if (!bookID){
            return res.status(400).json({message: "ID del libro non fornito"})
        }
        if (isNaN(parseInt(bookID))){
            return res.status(400).json({message: "ID del libro deve esseree un numero o una stringa numerica"})
        }
        const result = await database.collection('books').deleteOne({ _id : parseInt(bookID) }); // elimino il libro in base all'id

        //   result è un'istanza di DeleteResult che contiene in seguenti campi
        //   acknowledged: true,      booleano: indica se il server ha ricevuto e riconosciuto la richiesta
        //   deletedCount: 1          numero: quanti documenti sono stati effettivamente eliminati

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Libro non trovato o già eliminato' });
        }
        return res.status(200).json({message: 'Libro eliminato con successo'}); // ritorna un messaggio di successo al client
    } catch(error){
        console.error(`Internal deleting book`, error);
        return res.status(500).json({message: 'Internal erroe'});
    }
});

//rotta per modificare un libro, solo l'admin lo può fare
app.patch("/updateBook",authAdmin, async (req, res) => {
    if(!database) {
        return res.status(500).json({message: 'Internal server error'});
    }
    try{
        const bookID = req.body.id; // prendo l'id del libro da modificare
        const update = req.body.update; // prendo l'oggetto update dal body della richiesta che specifica i campi da modificare
        if (!update || typeof update !== 'object' || Object.keys(update).length === 0) {
            return res.status(400).json({ message: 'Oggetto "update" non valido o vuoto' });
        }
        if (!bookID) {
            return res.status(400).json({message: 'ID del libro non fornito'});
        }

        const filter = { _id: parseInt(bookID) }; // filtro per trovare il libro da modificare
        const setUpdate = { $set: req.body.update }; // prendo l'oggetto update dal body della richiesta che specifica i campi da modificare
        const result = await database.collection('books').updateOne(filter, setUpdate); // aggiorno il libro
        
        //   result è un'istanza di UpdateResult che contiene in seguenti campi
        //   acknowledged: true,        true se MongoDB ha ricevuto e riconosciuto la richiesta
        //   matchedCount: 1,           quanti documenti corrispondevano al filtro
        //   modifiedCount: 1,          quanti documenti sono stati effettivamente modificati
        //   upsertedId: null,          ID inserito se è stato fatto un upsert (non in questo caso)
        //   upsertedCount: 0           come sopra

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Libro non trovato  (nessun libro corrisponde all id' });
        }

        if (result.modifiedCount === 0) {
            return res.status(200).json({ message: 'Nessuna modifica effettuata (dati già aggiornati)' });
        }

        res.status(200).json({message: 'Libro aggiornato con successo'}); // ritorna un messaggio di successo al client
    } catch(error){
               console.error("Errore durante l'aggiornamento:", error);

        // Gestione errori noti
        if (error.name === 'MongoNetworkError') {
            return res.status(503).json({ message: 'Errore di rete: MongoDB non raggiungibile' });
        }

        if (error.name === 'MongoServerError') {
            return res.status(400).json({ message: `Errore MongoDB: ${error.message}` });
        }

        if (error.name === 'BSONTypeError' || error instanceof TypeError) {
            return res.status(400).json({ message: 'Errore nel tipo dei dati inviati' });
        }

        // Errore generico
        return res.status(500).json({ message: 'Errore interno del server' });
    }
});
 
//rotta per prenotare un libro
app.post("/reserveBook", auth, async (req,res) => {
    if(!database) {
        return res.status(500).json({message: 'Internal server error'});
    }
    try{        
        let reservation = req.body; // prendo la prenotazione dal body della richiesta

        if(!reservation || typeof reservation !== 'object' || Object.keys(reservation).length === 0) {
            return res.status(400).json({message: 'Oggetto prenotazione non valido o vuoto'});
        }

        console.log(reservation); // logga la prenotazione per vedere cosa contiene

        const user_isa = parseInt(reservation.user_isa); // prendo il codice isa dal body della richiesta
        const book_id = reservation.book_id; // prendo l'id del libro dal body della richiesta
        const data_fine = reservation.data_fine; // prendo la data di fine dal body della richiesta

        if(!book_id){
            return res.status(400).json({message: "ID del libro non fornito"})
        }
        if(!user_isa){
            return res.status(400).json({message: "Codice isa non fornito"})
        }
        // if(!data_inizio){
        //     return res.status(400).json({message: "Data di inizio non fornta"})
        // }
        if(!data_fine){
            return res.status(400).json({message: "Data di fine non fornita"})
        }

        const dataInizio = new Date(); // prendo la data di inizio a oggi
        const dataFine = new Date(data_fine); // trasformo la data di fine (che sarebbe una strunga) in un oggetto Date

        reservation.data_fine  = new Date(dataFine)
        reservation.data_inizio = dataInizio;

        const userID = await database.collection("users").findOne({... user_isa}); // controllo che il codice isa fornito sia prensente nel database
        const bookID = await database.collection("books").findOne({... book_id}, {projection: { prestabile: 1, _id: 0 }}); // controllo che il codice de libro fornito sia prensente nel database, e vede se è prenotabile

        if(!userID) return res.status(400).json({message:"utente non trovato"})
        if(!bookID) return res.status(400).json({message:"libro non trovato"})

        if(bookID === false) return res.status(400).json({message:"libro non prenotabile / già prenotato"})
        
        const resultCreateReservation = await database.collection("reserveBook").insertOne(reservation); // inserisco la prenotazione nel database

        if(resultCreateReservation.acknowledged === false) return res.status(500).json({message: 'Errore durante l\'inserimento della prenotazione'});

        const resultChangeAvaiability = await database.collection("books").updateOne(
            { _id: book_id },     
            { $set: {prestabile: false} }        
        );

        if (resultChangeAvaiability.matchedCount === 0) {
            return res.status(404).json({ message: 'Libro non trovato  (nessun libro corrisponde all id' });
        }

        return res.status(200).json({message: 'tutto ok'}); // ritorna un messaggio di successo al client

    } catch(error){
        console.error(`Internal adding reservation`, error);
        return res.status(500).json({message: 'Internal error'});
        }
    });

// rotta solamente per verificare che il token sia valido (punto 3 della todo list)
app.get("/justVerifyToken", auth, async (req, res)=>{
    if(!database) {
        return res.status(500).json({message: "internal server error"})
    }
    return res.status(200).json({message: "token valido"})
})

app.get("/getReservations", auth, async (req,res)=>{
    if(!database) {
        return res.status(500).json({message: "internal server error"})
    }

 
    if(req.role=== "admin"){
        const result = await database.collection("reserveBook").find({}).toArray(); // prendo tutte le prenotazioni dal database
        return res.status(200).json(result); // ritorna un messaggio di successo al client
    }else{
        const isa = req.isa; // prendo il codice isa dal token
        const result = await database.collection("reserveBook").find({user_isa: isa}).toArray(); // prendo tutte le prenotazioni del codice isa dal database
        if(result.length === 0){
            return res.status(404).json({message: "nessuna prenotazione trovata"})
        }
        return res.status(200).json(result);
    }
})

//rotta per eliminare una prenotazione, solo l'admin lo può fare
app.delete("/deleteReservation",auth, async (req, res) => {
    if(!database) {
        return res.status(500).json({message: 'Internal server error'});
    }
    try{
        const reservationID = new ObjectId(req.body.id); // prendo l'id dal body della richiesta

        if (!reservationID){
            return res.status(400).json({message: "ID della prenotazione non fornito"})
        }

        const bookID = await database.collection('reserveBook').findOne({ _id : reservationID }, {projection: { book_id: 1, _id: 0 }});
        console.log(bookID)

        await database.collection("books").updateOne(
            { _id: bookID?.book_id },     
            { $set: {prestabile: true} }        
        );

        const resultDeletion = await database.collection('reserveBook').deleteOne({ _id : reservationID}); // elimino la prenotazione in base all'id

        //   result è un'istanza di DeleteResult che contiene in seguenti campi
        //   acknowledged: true,      booleano: indica se il server ha ricevuto e riconosciuto la richiesta
        //   deletedCount: 1          numero: quanti documenti sono stati effettivamente eliminati

        if (resultDeletion.deletedCount === 0) {
            return res.status(404).json({ message: 'prenotazione non trovata o già eliminata' });
        }



        return res.status(200).json({message: 'prenotazione eliminata con successo'}); // ritorna un messaggio di successo al client
    } catch(error){
        console.error(`Internal deleting prenotazione`, error);
        return res.status(500).json({message: 'Internal error'});
    }
});
