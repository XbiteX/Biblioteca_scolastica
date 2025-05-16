<!-- qua verranno visualizzati i libri -->
<script>
    import { onMount } from "svelte";
    import BookCard from "$lib/components/bookCard.svelte";
    import { Toggle } from "flowbite-svelte";

    // questi sono i parametri che verranno utilizzati per fare la query al server
    let ordinamento = $state(); // se è == "Titolo" ordina per titolo
    let autore = $state();
    let titolo = $state();
    let lingua = $state();
    let stato = $state();
    let collocazione = $state();
    let prestabile = $state();

    let books = $state(); //array contenente i libri

    let ruolo = localStorage.getItem("ruolo");

    async function fetchBooks() {
        let params = new URLSearchParams();

        if (ordinamento) params.append("ordinamento", ordinamento);
        if (autore) params.append("autore", autore);
        if (titolo) params.append("titolo", titolo);
        if (lingua) params.append("lingua", lingua);
        if (stato) params.append("stato", stato);
        if (collocazione) params.append("collocazione", collocazione);
        if (prestabile) params.append("prestabile", prestabile);

        console.log(
            `https://bookstoreonline.onrender.com/books?${params.toString()}`,
        );

        const url = `https://bookstoreonline.onrender.com/books?${params.toString()}`;
        console.log(params.toString());
        const risposta = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        if (!risposta.ok) {
            const errorData = await risposta.json();
            console.error(
                "Errore durante il recupero dei libri:",
                errorData.message,
            );
            return;
        }
        books = await risposta.json();
    }

    // questa funzione viene chiamata quando la pagina viene caricata e carica tutti i libri (senza alcun filtro essendo che all'inizio i parametri sono undefined)
    onMount(async () => {
        if (!localStorage.getItem("token")) {
            window.location.href = "/app/login";
        }
        console.log(localStorage.getItem("token"));

        const response = await fetchBooks();
    });

    async function sortBooks() {
        ordinamento = "Titolo";
        const response = await fetchBooks();
    }

    async function toogleAvailable() {
        prestabile = prestabile === undefined ? "TRUE" : "FALSE";
        const response = await fetchBooks();
    }

    async function toogleTopic(event) {
        collocazione = event.target.value;
        console.log(collocazione);
        const response = await fetchBooks();
    }

    async function resetQuery() {
        ordinamento = undefined;
        autore = undefined;
        titolo = undefined;
        lingua = undefined;
        stato = undefined;
        collocazione = undefined;
        prestabile = undefined;

        const response = await fetchBooks();
    }

    async function handleDeleteBook(bookID) {
  if (!bookID) {
    alert('ID libro non valido');
    return;
  }

  if (!confirm('Sei sicuro di voler eliminare questo libro?')) {
    return;
  }

  try {
    const response = await fetch('https://bookstoreonline.onrender.com/deleteBook', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ id: bookID })
    });

    const data = await response.json();

    if (response.ok) {
      alert('Libro eliminato con successo');
      await fetchBooks(); // aggiorna la lista dei libri
    } else {
      alert(data.message || 'Errore durante l\'eliminazione.');
    }
  } catch (err) {
    alert('Errore di rete o del server.');
    console.error(err);
  }
}

</script>

<div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div
        class="flex flex-col sm:flex-row items-center gap-4 p-4 bg-white shadow rounded-lg"
    >
        <input
            type="text"
            placeholder="Cerca titolo..."
            class="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
            onchange={toogleTopic}
            class="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            <option value="">Tutte le categorie</option>
            <option value="arti e linguaggi">arti e linguaggi</option>
            <option value="tecnologia">tecnologie</option>
            <option value="letteratura italiana">letteratura italiana</option>
            <option value="scienze pure">scienze pure</option>
            <option value="tecnologia">tecnologie</option>
            <option value="geografia e storia">geografia e storia</option>
        </select>

        <button
            onclick={sortBooks}
            class="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >Ordina alfabeticamente</button
        >

        <Toggle on:change={toogleAvailable}>disponibile</Toggle>

        <button
            onclick={resetQuery}
            class="w-full sm:w-auto px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition"
            >Reset</button
        >
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4">
        {#each books as book}
            <BookCard
                titolo={book.Titolo}
                casa_editrice={book["Casa editrice"]}
                autore={book.Autore}
                lingua={book.Lingua}
                stato={book.Stato}
                argomenti={book.Argomenti}
                collocazione={book.Collocazione}
                prestabile={book.Prestabile}
                isAdmin={ruolo === "admin"}
                on:delete={() => handleDeleteBook(book._id)}
            />
        {/each}
    </div>
</div>
