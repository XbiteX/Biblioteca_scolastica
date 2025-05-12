const auth = require('./middleware/auth.js'); // importo il file auth.js
const authAdmin = require('./middleware/authAdmin.js'); // importo il file authAdmin.js
const buildazioneToken = require('./utilities.js'); // importo il file utilities.js
const express = require('express');
const jwt = require('jsonwebtoken'); // importo il pacchetto jsonwebtoken
const cors = require('cors');
const bodyParser = require('body-parser');
const {MongoClient} = require('mongodb');
 
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

        let token = buildazioneToken(user.nome, process.env.CHIAVE_JWT, user.ruolo) // creazione del token attraverso la funzione importata
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
            message: "token generato con successo"
        })
    }catch(error) {
        console.error(error);
    }


})

startServer();

app.get("/books" ,auth, async (req, res) => {
    if(!database) {
        return res.status(500).json({message: 'Internal server error'});
    }
    try{
        // Prendi i parametri di query dalla richiesta
        // argomenti momentaneamente non utilizzati
        // const argomenti = req.query.argomenti; // disciplina del libro
        const autore = req.query.autore; // autore del libro
        const titolo = req.query.titolo; // titolo del libro
        const lingua = req.query.lingua; // lingua del libro
        const stato = req.query.stato; // stato del libro
        const collocazione = req.query.collocazione; // locazione del libro

        const ordinamento = req.query.ordinamento; // ordinamento dei risultati

        const filter = {}; // inizializza un oggetto vuoto per il filtro

            // if (argomenti) {
            //     filter["Argomenti"] = argomenti; // aggiungi il filtro per argomenti se gli argomenti sono forniti
            // }

            if (autore) {
                filter["Autore"] = autore; // aggiungi il filtro per autore se autore è fornita
            }
            if (titolo) {
                filter["Titolo"] = titolo; // aggiungi il filtro per Titolo se Titolo è fornita
            }
            if (lingua) {
                filter["Lingua"] = lingua; // aggiungi il filtro per Lingua se Lingua è fornita
            }
            if (stato) {
                filter["Stato"] = stato; // aggiungi il filtro per Stato se Stato è fornita
            }

            if (collocazione) {
                filter["Collocazione"] = collocazione; // aggiungi il filtro per Collocazione se Collocazione è fornita
            }

        console.log(filter); // logga il filtro per vedere cosa contiene
        const result = await database.collection('books').find(filter).toArray();
        console.log(result); // logga il risultato per vedere cosa contiene
        return res.json(result);
    } catch(error){
        console.error(`Internal getting books`, error);
        return res.status(500).json({message: 'Internal erroe'});
    }
});


//rotta per aggiungere un libro, solo l'admin lo può fare
app.post("/addBook",authAdmin, async (req, res) => {
    if(!database) {
        return res.status(500).json({message: 'Internal server error'});
    }
    try{
        let book = req.body; // prendo il libro dal body della richiesta
        if(!book || typeof book !== 'object' || Object.keys(book).length === 0) {
            return res.status(400).json({message: 'Oggetto libro non valido o vuoto'});
        }

        const fields = ["CDD", "Note", "Prestabile", "Stato", "argomenti"]; // array con i campi del libro non obbligatori

        fields.forEach(element => {
            if(book[element] === undefined) {
                book[element] = ""; // se il campo non è definito lo setto a null
            }
        });

        console.log(book); // logga il libro per vedere cosa contiene

        if(!book._id){
            return res.status(400).json({message: "ID del libro non fornito"})
        }
         if(!book.collocazione){
            return res.status(400).json({message: "collocazione non fornita"})
        }
         if(!book.Autore){
            return res.status(400).json({message: "autore del libro non fornto"})
        }
         if(!book.Titolo){
            return res.status(400).json({message: "titolo del libro non fornito"})
        }
         if(!book.Lingua){
            return res.status(400).json({message: "lingua del libro non fornito"})
        }

        const result = await database.collection("books").insertOne(book); // inserisco il libro nel database

        if(result.acknowledged === false) {
            return res.status(500).json({message: 'Errore durante l\'inserimento del libro'});
        }
        return res.status(200).json({message: 'tt ok'}); // ritorna un messaggio di successo al client
    } catch(error){
        if (error.code === 11000) {
            return res.status(409).json({ message: 'ID già esistente nel database' });
        }
        console.error(`Internal adding book`, error);
        return res.status(500).json({message: 'Internal error'});
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
            return res.status(404).json({ message: 'Libro non trovato' });
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
 


[{
    nome: "_id",
    type: "number",
    require: true,
    value:undefined
},{},{}]