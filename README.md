# Libreria scolastica
questo è un progetto scolastico per gestire una biblioteca


il deployment del backend è stato fatto con render





## rotte:
### /login 
serve agli utenti per autenticarsi, prima di accedere alla "biblioteca online" devono autenticarsi
per atenticarsi bisogna fare un POST verso https://bookstoreonline.onrender.com/login 
e il body sarà così formato:
```json 
{
    "isa": "codice isa fornito dall'utente tramite un form",
    "password": "password fornita dall'utente tramite un form"
}
```
se l'utente viene trovato nel database allora il backend invierà un codcice JWT al frontend, da quel momento il poi il frontend
ogni volta che farà una richiesta al server dovrà includere nel campo header questo codice jwt, il server una volta ricevuta la richesta 
controllerà nel header il codice jwt e un middleware verificherà che questo codice jwt sia corretto.



### /books
ritorna i libri in base a nessuno, uno o più filtri.

- /books?collocazione=Letteratura italiana --> filtra i dati in base alla collocazione (es. Scienze pure, Tecnologie, Letteratura...)
<!-- - /books?argomenti=Letteratura filtra i dati in base alla disciplina (es. Metallurgia, Informatica, Fiscia, Guerra) -->
- /books?autore=Giovanni Pascoli --> filtra i dati in base all'autore (es. Giovanni Pascoli, Giovanni Tonzig, Pippo Caio)
- /books?titolo=Il visconte dimezzato --> filtra i dati in base al titolo (es. Il visconte dimezzato, Fondamenti di meccanica classica...)
- /books?lingua=italiano --> filtra i dati in base alla lingua (es. italiano, inglese, spagnolo)
- /books?stato=disponibile --> filtra i dati in base alla status (es. disponibile, non disponibile, solo consultazione...)
- /books?prestabile=TRUE --> filtra i dati in base a se sono prestabili (e quindi possono essere presi in prestito) o non lo sono (e quindi sono già presi in prestito)

poi c'è anche un ordinamento:
- /books?ordinamento=Titolo --> per ora l'ordinamento è solo alfabetico, a destra dell'uguale (nella query) ci va il campo su cui vogliamo fare l'ordinamento (in questo caso titolo)

### /addBook
metodo: post
permette all'admin di aggiungere un libro specifico, i parametri obbligatori sono l'id la collocazione, l'autore, la lingua e il titolo.
I parametri facoltativi possono non essere messi, quelli obbligatori no.
 il body della richiesta sarà così formato:
```json 
{
  "_id": 5, // obbligatorio, rappresenta il codice di inventario, sarà l'admin a passarlo direttamente al server (l'id non verrò generato da mongodb)
  "CDD": "371.9 BUR", // facoltativo
  "Collocazione": "letteratura italiana", // obbligatorio
  "Autore": "WELLINGTON; Jean e C.Burleigh", // obbligatorio
  "Titolo": "Cattivo Rendimento", // obbligatorio
  "Note": "", // facoltativo
  "Stato": "prestabile", // facoltativo
  "CasaEditrice": "La Nuova Italia Editrice", // facoltativo
  "Prestabile": "TRUE", //facoltativo
  "Lingua": "it", //obbligatorio
  "Argomenti": "Psicologia; motivazione; produttività; educazione" //facoltativo
}
```


### /deleteBook
metodo: delete
permette all'admin di eliminare un libro specifio, i parametri necessari sono l'id, il corpo della richiesta sarà così formato:
```json 
{
    "id":4
}
```
l'id può essere sia una stringa che un numero

### /updateBook
metodo:patch
permette all'admin di aggiornare un libro specifio, i parametri necessari sono l'id del libro ed un'oggetto dove si specificano i campi da modificare e i loro corrispettivi valori.
il body della richiesta sarà quindi così formato:
```json 
{
  "id": 4,
  "update": {
    "Stato": "non disponibile",
    "Titolo": "Cattivo Rendimento (Edizione Rivisitata)",
    "Lingua": "italiano"
  }
}
```
solo i parametri che vengono specificati nell'oggetto "update" andranno aggiornati
l'id può essere sia una stringa che un numero

# tabelle
### la tabella degli users sarà così formata

|isa|password|nome|cognome|ruolo|
|---|--------|----|-------|-----|
|12345678|password|marco|rossi|studente|

### la tabella per i books sarà così formata

| _id | CDD        | Collocazione | Autore                               | Titolo                                 | Note | Stato      | Casa editrice           | Prestabile | lingua     | argomenti   |
|--------------|------------|--------------|---------------------------------------|----------------------------------------|------|------------|--------------------------|------------|---------------|--------------|
| 22           | 671.36 CON | Scienze pure | ASSOCIAZIONE ITALIANA DI METALLURGIA | Convegno nazionale trattamenti termici |      | Prestabile | ASS.ITALIANA METALLURGIA | VERO       |  italiana| Metallurgia  |


"argomenti" indica di cosa tratta quel libro (es. guerra, fisica, metallurgia, poetica...)
_id rappresenta il codice di inventario di quel libro
