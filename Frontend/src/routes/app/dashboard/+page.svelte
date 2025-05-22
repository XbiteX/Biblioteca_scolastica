<script>
  import { onMount } from "svelte";
  import BookCard from "$lib/components/bookCard.svelte";
  import { Toggle, Modal, Button, Input, Label, Select } from "flowbite-svelte";

  // Filtri e dati libri
  let ordinamento;
  let autore;
  let titolo;
  let lingua;
  let stato;
  let collocazione;
  let prestabile;
  let books = [];

  // Modifica libro
  let newToUpdateBook = { titolo: "", autore: "", casa_editrice: "" };
  let toUpdateBook = null;
  let modalModifica = false;

  // Visualizza dettagli libro
  let modalVisualizza = false;
  let selectedBook = null;

  // Ruolo utente
  let ruolo = null;

  // Prenotazione
  let modalPrenota = false;
  let selectedBookID = null;
  let reservation = {};
  let error = "";
  let successMessage = "";
  let loading = false;
  const campi = [
    { key: 'data_inizio', label: 'Data Inizio', type: 'date', required: true },
    { key: 'data_fine',   label: 'Data Fine',   type: 'date', required: true },
  ];

  // Fetch libri con filtri
  async function fetchBooks() {
    let params = new URLSearchParams();
    if (ordinamento)  params.append("ordinamento", ordinamento);
    if (autore)       params.append("autore", autore);
    if (titolo)       params.append("titolo", titolo);
    if (lingua)       params.append("lingua", lingua);
    if (stato)        params.append("stato", stato);
    if (collocazione) params.append("collocazione", collocazione);
    if (prestabile)   params.append("prestabile", prestabile);

    const url = `https://bookstoreonline.onrender.com/books?${params.toString()}`;
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
    if (res.ok) {
      books = await res.json();
    } else {
      console.error("Errore fetch libri:", await res.text());
    }
  }

  onMount(async () => {
    if (!localStorage.getItem("token")) {
      window.location.href = "/app/login";
      return;
    }
    ruolo = localStorage.getItem("ruolo");
    await fetchBooks();
  });

  // Funzioni filtro/reset
  async function toogleSortBooks() {
    ordinamento = ordinamento ? undefined : "titolo";
    await fetchBooks();
  }
  async function selectAvailable(e) {
    prestabile = e.target.value;
    await fetchBooks();
  }
  async function toogleTopic(e) {
    collocazione = e.target.value;
    await fetchBooks();
  }
  async function resetQuery() {
    ordinamento = autore = titolo = lingua = stato = collocazione = prestabile = undefined;
    await fetchBooks();
  }

  // Elimina libro
  async function handleDeleteBook(bookID) {
    if (!bookID || !confirm("Sei sicuro di voler eliminare questo libro?")) return;
    const res = await fetch("https://bookstoreonline.onrender.com/deleteBook", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ id: bookID })
    });
    if (res.ok) {
      alert("Libro eliminato");
      await fetchBooks();
    } else {
      alert((await res.json()).message || "Errore eliminazione");
    }
  }

  // Modifica libro
  function handleUpdateBook(book) {
    toUpdateBook = book;
    newToUpdateBook = { titolo: "", autore: "", casa_editrice: "" };
    modalModifica = true;
  }
  async function aggiornaLibro() {
    const update = {
      titolo: newToUpdateBook.titolo || toUpdateBook.titolo,
      autore: newToUpdateBook.autore || toUpdateBook.autore,
      casa_editrice: newToUpdateBook.casa_editrice || toUpdateBook.casa_editrice
    };
    const res = await fetch("https://bookstoreonline.onrender.com/updateBook", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ id: toUpdateBook._id, update })
    });
    if (res.ok) {
      alert("Libro aggiornato");
      modalModifica = false;
      await fetchBooks();
    } else {
      alert((await res.json()).message || "Errore aggiornamento");
    }
  }

  // Visualizza dettaglio libro
  function handleOpenBook(book) {
    selectedBook = book;
    modalVisualizza = true;
  }

  // Apri modale prenotazione
  function handleReserveBook(bookID) {
    if (!bookID) return alert("ID non valido");
    selectedBookID = bookID;
    reservation = {};
    error = successMessage = "";
    modalPrenota = true;
  }
  function validateForm() {
    for (const campo of campi) {
      if (campo.required && !reservation[campo.key]) {
        error = `Il campo "${campo.label}" è obbligatorio.`;
        return false;
      }
    }
    error = "";
    return true;
  }
  async function handleSubmit() {
    if (!validateForm()) return;
    const token = localStorage.getItem("token");
    if (!token) return error = "Devi effettuare il login.";
    loading = true;
    const body = {
      ...reservation,
      user_isa: localStorage.getItem("codice_isa"),
      book_id: selectedBookID
    };
    const res = await fetch("https://bookstoreonline.onrender.com/reserveBook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (res.ok) {
      successMessage = "Prenotazione effettuata!";
      setTimeout(() => {
        modalPrenota = false;
        fetchBooks();
      }, 1200);
    } else {
      error = data.message || "Errore prenotazione";
    }
    loading = false;
  }
</script>

<div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800">
  <!-- Barra filtri -->
  <div class="flex flex-col sm:flex-row items-center gap-4 p-4 bg-white rounded-lg max-w-7xl w-full">
    <input
      type="text" placeholder="Cerca titolo..."
      class="w-full sm:w-64 px-4 py-2 border rounded"
      bind:value={titolo} on:input={fetchBooks}
    />
    <Select onchange={toogleTopic} class="w-full sm:w-48">
      <option value="">Tutte le categorie</option>
      <option value="arti e linguaggi">arti e linguaggi</option>
      <option value="tecnologia">tecnologia</option>
      <option value="letteratura italiana">letteratura italiana</option>
      <option value="scienze pure">scienze pure</option>
      <option value="geografia e storia">geografia e storia</option>
    </Select>
    <Toggle on:change={toogleSortBooks}>Ordina</Toggle>
    <Select onchange={selectAvailable}>
      <option value="">Tutti</option>
      <option value={true}>Disponibili</option>
      <option value={false}>Non disponibili</option>
    </Select>
    <Button color="light" on:click={resetQuery}>Reset</Button>
    {#if ruolo === "admin"}
      <Button color="success" on:click={() => window.location.href = "/app/addBook"}>
        Aggiungi Libro
      </Button>
    {/if}
    <Button color="blue" on:click={() => window.location.href = "/app/reserveBook"}>
      Visualizza Prenotazioni
    </Button>
  </div>

  <!-- Griglia libri -->
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-4 w-full max-w-7xl">
    {#each books as book}
      <div class="bg-white rounded shadow flex flex-col">
        <BookCard
          {...book}
          isAdmin={ruolo === "admin"}
          on:delete={() => handleDeleteBook(book._id)}
          on:update={() => handleUpdateBook(book)}
          on:reserve={() => handleReserveBook(book._id)}
          on:open={() => handleOpenBook(book)}
        />
      </div>
    {/each}
  </div>
</div>

<!-- Modale Modifica -->
<Modal title="Modifica Libro" bind:open={modalModifica} autoclose>
  <form class="space-y-4">
    <Label>Titolo</Label>
    <Input bind:value={newToUpdateBook.titolo} placeholder={toUpdateBook?.titolo} />
    <Label>Autore</Label>
    <Input bind:value={newToUpdateBook.autore} placeholder={toUpdateBook?.autore} />
    <Label>Casa Editrice</Label>
    <Input bind:value={newToUpdateBook.casa_editrice} placeholder={toUpdateBook?.casa_editrice} />
    <div class="flex justify-end gap-2">
      <Button on:click={aggiornaLibro}>Conferma</Button>
      <Button color="alternative" on:click={() => (modalModifica = false)}>Annulla</Button>
    </div>
  </form>
</Modal>

<!-- Modale Visualizza -->
<Modal title="Dettagli Libro" bind:open={modalVisualizza} autoclose>
  {#if selectedBook}
    <h3 class="text-xl font-bold">{selectedBook.titolo}</h3>
    <p>{selectedBook.autore} — {selectedBook.lingua}</p>
    <p class="mt-2">{selectedBook.argomenti}</p>
    <p>{selectedBook.collocazione}</p>
    <p>CDD: {selectedBook.cdd}</p>
  {/if}
</Modal>

<!-- Modale Prenotazione -->
<Modal title="Prenota il Libro" bind:open={modalPrenota} autoclose>
  {#if ruolo === "student"}
    {#if error}
      <p class="text-red-500">{error}</p>
    {/if}
    {#if successMessage}
      <p class="text-green-500">{successMessage}</p>
    {/if}
    <form on:submit|preventDefault={handleSubmit} class="space-y-4">
      {#each campi as campo}
        <div>
          <Label for={campo.key}>{campo.label}{campo.required ? ' *' : ''}</Label>
          <Input
            id={campo.key}
            type={campo.type}
            bind:value={reservation[campo.key]}
            required={campo.required}
          />
        </div>
      {/each}
      <div class="flex justify-end gap-2">
        <Button type="submit" disabled={loading}>
          {#if loading}Caricamento...{:else}Prenota{/if}
        </Button>
        <Button color="alternative" on:click={() => (modalPrenota = false)}>
          Annulla
        </Button>
      </div>
    </form>
  {:else}
    <p>Solo gli studenti possono prenotare libri.</p>
  {/if}
</Modal>