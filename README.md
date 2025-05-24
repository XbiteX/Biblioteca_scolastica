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
- [ ] aggiungere gli altri campi per la modifica dei libri.
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
### il database si compone di 3 collection (o tabelle) 

### users

|isa|password|nome|cognome|ruolo|
|---|--------|----|-------|-----|
|12345678|password|marco|rossi|student|

l'attributo ruolo può essere student o admin, l'utente con admin avrà particolari privilegi che sono descritti più avanti
Le credenziali dell'admin sono
- isa: 1
- password: passwordAdmin

### books

| _id      | argomenti                                               | autore                          | casa_editrice              | cdd      | collocazione        | lingua    | note | prestabile | stato        | titolo                                      |
|----------|---------------------------------------------------------|---------------------------------|----------------------------|----------|---------------------|----------|------|------------|--------------|---------------------------------------------|
| 4        | Psicologia, motivazione, produttività, performance, educazione, crescita personale | WELLINGTON, Jean e C.Burleigh  | La Nuova Italia Editrice   | 371.9 BUR | letteratura italiana | italiano |      | TRUE       | Disponibile  | Cattivo Rendimento (Edizione Rivisitata)    |


### reserveBook

| _id                        | data_inizio | data_fine   | user_isa | book_id |
|----------------------------|-------------|-------------|----------|---------|
| 682b0c0517e5a39aeeb0c502    | data inizio | data fine   | 3        | 29      |



## frontend:
