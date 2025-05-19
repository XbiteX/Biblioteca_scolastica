# Backend

## /login 
-> permessi admin: non richesti  
-> metodo: **POST**  
-> rotta: **https://bookstoreonline.onrender.com/login** 
-> body: **SI** 
-> autenticazione: non richiesta

serve agli utenti per autenticarsi prima di accedere alla "biblioteca online".

body:
```json 
{
    "isa": "codice isa fornito dall'utente tramite un form",
    "password": "password fornita dall'utente tramite un form"
}
```
se l'utente viene trovato nel database allora il backend invierà un codcice JWT al frontend che lo memorizzerà in localstorage, da quel momento il poi il frontend
ogni volta che farà una richiesta al server dovrà includere nel campo header questo codice jwt, il server una volta ricevuta la richesta 
controllerà nel header il codice jwt e un middleware verificherà che questo codice jwt sia corretto.

il server invierà al frontend anche il ruolo dell'utente che si è loggato, in questo modo il frontend abiliterà certe funzionalità (come quella di rimozione) nel caso in cui l'utente sia l'admin.

body della risposta:
```json 
{
    "token": "token",
    "ruolo": "student",
    "isa": 45,
}
```


## /books
-> permssi admin: non richiesti 
-> metodo: **GET**  
-> rotta: **https://bookstoreonline.onrender.com/books**
-> body: **NO**
-> autenticazione: **richiesta**


ritorna i libri in base a nessuno, uno o più filtri.

- /books?collocazione=Letteratura italiana --> filtra i dati in base alla collocazione (es. Scienze pure, Tecnologie, Letteratura...)
<!-- - /books?argomenti=Letteratura filtra i dati in base alla disciplina (es. Metallurgia, Informatica, Fiscia, Guerra) -->
- /books?autore=Giovanni Pascoli --> filtra i dati in base all'autore (es. Giovanni Pascoli, Giovanni Tonzig, Pippo Caio)
- /books?titolo=Il visconte dimezzato --> filtra i dati in base al titolo (es. Il visconte dimezzato, Fondamenti di meccanica classica...)
- /books?lingua=italiano --> filtra i dati in base alla lingua (es. italiano, inglese, spagnolo)
- /books?stato=disponibile --> filtra i dati in base alla status (es. disponibile, non disponibile, solo consultazione...)
- /books?prestabile=true --> filtra i dati in base a se sono prestabili (e quindi possono essere presi in prestito) o non lo sono (e quindi sono già presi in prestito)

poi c'è anche un ordinamento:
- /books?ordinamento=Titolo --> per ora l'ordinamento è solo alfabetico, a destra dell'uguale (nella query) ci va il campo su cui vogliamo fare l'ordinamento (in questo caso titolo)


## /addBook
-> permessi admin: **richiesti**
-> metodo: **POST**
-> rotta: **https://bookstoreonline.onrender.com/addBook**
-> body: **SI**
-> autenticazione: **richiesta**

 
permette di aggiungere un libro specifico, i parametri obbligatori sono l'id la collocazione, l'autore, la lingua e il titolo.
I parametri facoltativi possono non essere messi, quelli obbligatori no.

 il body della richiesta sarà così formato:
```json 
{
  "_id": 5, // obbligatorio, rappresenta il codice di inventario, sarà l'admin a passarlo direttamente al server (l'id non verrò generato da mongodb)
  "cdd": "371.9 BUR", // facoltativo
  "collocazione": "letteratura italiana", // obbligatorio
  "cutore": "WELLINGTON, Jean e C.Burleigh", // obbligatorio
  "titolo": "Cattivo Rendimento", // obbligatorio
  "note": "", // facoltativo
  "stato": "prestabile", // facoltativo
  "casa_editrice": "La Nuova Italia Editrice", // facoltativo
  "prestabile": "TRUE", //facoltativo
  "lingua": "it", //obbligatorio
  "argomenti": "Psicologia, motivazione, produttività, educazione" //facoltativo
}
```


## /deleteBook
-> permessi admin: **richiesti**
-> metodo: **DELETE**
-> rotta: **https://bookstoreonline.onrender.com/addBook**
-> body: **SI**
-> autenticazione: **richiesta**


permette all'admin di eliminare un libro specifio, i parametri necessari sono l'id, il corpo della richiesta sarà così formato:

```json 
{
    "id":4
}
```
l'id può essere sia una stringa che un numero

## /updateBook
-> permessi admin: **richiesti**
-> metodo: **PATCH**
-> rotta: **https://bookstoreonline.onrender.com/updateBook**
-> body: **SI**
-> autenticazione: **richiesta**


permette di aggiornare un libro specifio, i parametri necessari sono l'id del libro ed un'oggetto dove si specificano i campi da modificare e i loro corrispettivi valori.
il body della richiesta sarà quindi così formato:
```json 
{
  "id": 4,
  "update": {
    "stato": "non disponibile",
    "titolo": "Cattivo Rendimento (Edizione Rivisitata)",
    "lingua": "italiano"
  }
}
```

da notare che i nomi dei campi dell'oggetto update devono corrispondere coi nomi dei campi dei libri nella collection "books".

solo i parametri che vengono specificati nell'oggetto "update" andranno aggiornati

## /reserveBook
-> permessi admin: non richiesti
-> metodo: **POST**
-> rotta: **https://bookstoreonline.onrender.com/reserveBook**
-> body: **SI**
-> autenticazione: **richiesta**


permette di prendere in prestito un libro specifio, i parametri necessari sono l'id del libro, il codice isa dell'utente e le date di inizio e fine prestito.
il body della richiesta sarà quindi così formato:
```json 
{
  "user_id": 4,
  "book_id": 4,
  "data_inizio": 2025-05-06,
  "data_fine": 2025-05-13,
}
```

da notare che i nomi dei campi dell'oggetto update devono corrispondere coi nomi dei campi dei libri nella collection "reserveBook".

## /justVerifyToken
-> permessi admin: non richiesti
-> metodo: **GET**
-> rotta: **https://bookstoreonline.onrender.com/justVerifyToken**
-> body: NO
-> autenticazione: **richiesta**

permette al client di verificare che il suo token sia valido.  
questa rotta serve perchè capitava che nel loclastorage del client c'era un token scaduto (perchè magari ha fatto l'accesso in passato), però il token effettivamente c'era e quindi l'utente
veniva rindirizzato alla dashboard dove cercava di fare delle richieste con un token scaduto, che ovviamente non andavano a buon fine e quindi l'utente doveva manualmente ritornare a /login




