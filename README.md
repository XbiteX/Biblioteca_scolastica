# *TO DO LIST*

- [X] fare la rotta /reserveBook sul backend.
- [X] sul frontend, fare una rotta verso app/reserveBook.
    - questa rotta dovrà permettere agli studenti di visualizzare i libri prenotati.
    - gli studenti potranno eliminare le prenotazioni a loro nome.
    - gli admin invece potranno eliminare le prenotazioni di tutti.
- [X] spostare la pagina app/reserveBook su un modale nella dashboard
- [X] aggiungere una pagina per la visualizzazione dei libri prenotati.
    - in qesta pagina gli tenti potranno anche eliminare le prenotazioni a loro nome.
    - l'admin viselizzerà le prenotazioni di tutti gli studenti e potrà eliminare le prenotazioni
- [X] aggiungere gli altri campi per la modifica dei libri.
    - quando l'admin vuole modificare un libro si apre un modale con all'interno un form.
    - il form chiede solamente 3 campi
- [X] aggiustare il reindirizzamento verso app/dashboard:
    -  il token dopo 1h scade, ma rimane comunque nel localstorage del browser e quindi il frontend pensa di avere un token valido, ma non lo è siccome è scaduto.
    -  quindi il frontend si deve accorgere di avere un token scaduto.
    - per farlo bisogna fare una richista qualsiasi verso il server.
    - se il server risopnde con messaggio 401, "token non valido" allora il token in localstorage non è valido
    - se ciò accade il frontend rimanda l'utente sulla pagina di login.
- [ ] abbellire la pagina di login
    - aggiungere stili con tailwind
- [X] convertire tutti i tag <button>, <input>, <label> con componenti flowbite.





# Libreria scolastica
questo è un progetto scolastico per gestire una biblioteca

il deployment del [database](#database) è stato fatto con [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database)  
il deployment del [backend](./backend/README.md) è stato fatto con Render al [link](https://bookstoreonline.onrender.com/)  
il deployment del [frontend](./Frontend/README.md) è stato fatto con Vercel al [link](https://biblioteca-scolastica.vercel.app)  

## Database

il database che abbiamo utilizzato è di tipo NoSQL ed è hostato su [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database)

### il database si compone di 3 collection (o tabelle) 

### users

|nomi colonne|isa|password|nome|cognome|ruolo|
|-----|---|--------|----|-------|-----|
|valori di esempio|12345678|password|marco|rossi|student|
|tipi di dato|Int32|String|String|String|String|


l'attributo ruolo può essere student o admin, l'utente con admin avrà particolari privilegi che sono descritti nel readme del [backend](https://github.com/XbiteX/Biblioteca_scolastica/blob/main/backend/README.md)  
Le credenziali dell'admin sono
- isa: 1
- password: passwordAdmin

### books

|nomi colonne| _id      | argomenti                                               | autore                          | casa_editrice              | cdd      | collocazione        | lingua    | note | prestabile | stato        | titolo                                      |img|
|------------|----------|---------------------------------------------------------|---------------------------------|----------------------------|----------|---------------------|----------|------|------------|--------------|---------------------------------------------|-----|
|valori di esempio| 4        | Psicologia, motivazione, produttività, performance, educazione, crescita personale | WELLINGTON, Jean e C.Burleigh  | La Nuova Italia Editrice   | 371.9 BUR | letteratura italiana | italiano |      | true       | Disponibile  | Cattivo Rendimento (Edizione Rivisitata)    |
|tipi di dato|Int32|String|String|String|String|String|String|String|Boolean|String|String|Binary|

l'attributo img rappresenta l'immagine della copertina di un dato libro, abbiamo utilizzato il tipo di dato [BSON](https://www.mongodb.com/docs/manual/reference/bson-types/) per memorizzarlo.  

### reserveBook

|nomi colonne| _id                        | data_inizio | data_fine   | user_isa | book_id |
|-----|----------------------------|-------------|-------------|----------|---------|
|valori di esempio| 682b0c0517e5a39aeeb0c502    | data inizio | data fine   | 3        | 29      |
|tipi di dato|ObjectId|date|date|Int32|Int32|

