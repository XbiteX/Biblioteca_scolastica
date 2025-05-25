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
  let newToUpdateBook = { titolo: "", autore: "", casa_editrice: "", lingua: "", collocazione: "" };
  let toUpdateBook = null;
  let modalModifica = false;

  // Visualizzazione dettagli libro
  let modalVisualizza = false;
  let selectedBook = null;

  // Ruolo, isa e token utente
  let ruolo = null;
  let isa = null;
  let token = null;

  // Prenotazione
  let modalPrenota = false;
  let selectedBookID = null;
  let reservation = {};
  let error = "";
  let loading = false;

  const campiPrenotazione = [
    { key: 'data_fine', label: 'Data Fine Prenotazione', type: 'date', required: true, min: getTodayDate() }
  ];

  function getTodayDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  // Funzione per fetchare i libri applicando i filtri
  async function fetchBooks() {
    let params = new URLSearchParams();
    if (ordinamento) params.append("ordinamento", ordinamento);
    if (autore) params.append("autore", autore);
    if (titolo) params.append("titolo", titolo);
    if (lingua) params.append("lingua", lingua);
    if (stato) params.append("stato", stato);
    if (collocazione) params.append("collocazione", collocazione);
    if (prestabile !== undefined && prestabile !== "") params.append("prestabile", prestabile);

    const url = `https://bookstoreonline.onrender.com/books?${params.toString()}`;
    console.log("Fetching books from:", url);
    try {
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        books = await res.json();
      } else {
        console.error("Errore fetch libri:", await res.text());
        // Gestisci errore se necessario
      }
    } catch (err) {
      console.error("Errore di rete:", err);
    }
  }

  onMount(async () => {
    if (!localStorage.getItem("token")) {
      window.location.href = "/app/login";
      return;
    }
    ruolo = localStorage.getItem("ruolo");
    isa = parseInt(localStorage.getItem("isa")); // Converti in numero
    token = localStorage.getItem("token");
    await fetchBooks();
  });

  // Funzioni per gestire i filtri e il reset
  async function toogleSortBooks() {
    ordinamento = ordinamento ? undefined : "titolo";
    await fetchBooks();
  }
  
  async function selectAvailable(e) {
    prestabile = e.target.value === "" ? undefined : e.target.value === "true" ? true : false;
    console.log("Prestabile:", prestabile);
    await fetchBooks();
  }
  
  async function toogleTopic(e) {
    collocazione = e.target.value === "" ? undefined : e.target.value;
    await fetchBooks();
  }
  
  async function resetQuery() {
    ordinamento = autore = titolo = lingua = stato = collocazione = prestabile = undefined;
    await fetchBooks();
  }

  // Funzione per eliminare un libro
  async function handleDeleteBook(bookID) {
    if (!bookID || !confirm("Sei sicuro di voler eliminare questo libro?")) return;
    
    try {
      const res = await fetch("https://bookstoreonline.onrender.com/deleteBook", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ id: bookID })
      });
      
      if (res.ok) {
        alert("Libro eliminato");
        await fetchBooks();
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Errore eliminazione");
      }
    } catch (err) {
      console.error("Errore eliminazione:", err);
      alert("Errore di connessione");
    }
  }

  // Funzioni per la modifica del libro
  function handleUpdateBook(book) {
    toUpdateBook = book;
    newToUpdateBook = { titolo: "", autore: "", casa_editrice: "", lingua: "", collocazione: ""  };
    modalModifica = true;
  }

  async function aggiornaLibro() {
    const update = {
      titolo: newToUpdateBook.titolo || toUpdateBook.titolo,
      autore: newToUpdateBook.autore || toUpdateBook.autore,
      casa_editrice: newToUpdateBook.casa_editrice || toUpdateBook.casa_editrice,
      lingua: newToUpdateBook.lingua || toUpdateBook.lingua,
      collocazione: newToUpdateBook.collocazione || toUpdateBook.collocazione 
    };
    
    try {
      const res = await fetch("https://bookstoreonline.onrender.com/updateBook", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ id: toUpdateBook._id, update })
      });
      
      if (res.ok) {
        alert("Libro aggiornato");
        modalModifica = false;
        await fetchBooks();
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Errore aggiornamento");
      }
    } catch (err) {
      console.error("Errore aggiornamento:", err);
      alert("Errore di connessione");
    }
  }

  // Apertura del dettaglio libro
  function handleOpenBook(book) {
    selectedBook = book;
    modalVisualizza = true;
  }

  // Gestione prenotazione libro
  function handleReserveBook(bookID) {
    selectedBookID = bookID;
    reservation = {}; // Reset reservation object
    error = "";
    modalPrenota = true;
  }

  // Funzione di validazione
  function validateForm() {
    for (const campo of campiPrenotazione) {
      if (campo.required && !reservation[campo.key]) {
        error = `Il campo "${campo.label}" è obbligatorio.`;
        return false;
      }
    }
    
    // Validazione aggiuntiva per la data
    if (reservation.data_fine) {
      const selectedDate = new Date(reservation.data_fine);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset ore per confronto solo date
      
      if (selectedDate <= today) {
        error = "La data di fine prenotazione deve essere futura.";
        return false;
      }
    }
    
    error = "";
    return true;
  }

  // Funzione di prenotazione
  async function handleSubmitReservation() {
    // Valida PRIMA di procedere
    if (!validateForm()) {
      return; // Non continuare se la validazione fallisce
    }
    
    loading = true;
    error = ""; // Reset errore
    
    const body = {
      user_isa: isa,
      book_id: selectedBookID,
      data_fine: reservation.data_fine
    };

    console.log("Dati inviati:", body);

    try {
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
        alert("Prenotazione effettuata con successo!");
        modalPrenota = false; // Chiudi il modal
        reservation = {}; // Reset form
        await fetchBooks(); // Aggiorna la lista libri
      } else {
        error = data.message || `Errore prenotazione: ${res.status} ${res.statusText}`;
        console.error("Errore prenotazione:", data);
      }
    } catch (err) {
      error = "Errore di connessione durante la prenotazione";
      console.error("Errore fetch:", err);
    } finally {
      loading = false;
    }
  }

  // Funzione per chiudere il modal e resettare i dati
  function closeReservationModal() {
    modalPrenota = false;
    reservation = {};
    error = "";
    loading = false;
  }
</script>

<div class="flex flex-col items-center flex-start min-h-screen bg-gray-100 dark:bg-gray-800">
  <!-- Tool bar -->
  <div class="flex flex-col sm:flex-row items-center gap-4 p-4 bg-white dark:bg-gray-700 rounded-lg max-w-7xl w-full">
    <input
      type="text"
      placeholder="Cerca titolo..."
      bind:value={titolo}
      on:input={fetchBooks}
      class="w-full sm:w-64 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 basis-1/3"
    />  

    <p class="text-gray-900 dark:text-white">Categoria:</p>
    <Select class="w-full sm:w-48" on:change={toogleTopic}>
      <option value="" selected>Tutte le categorie</option>
      <option value="arti e linguaggi">Arti e linguaggi</option>
      <option value="tecnologia">Tecnologia</option>
      <option value="letteratura italiana">Letteratura italiana</option>
      <option value="scienze pure">Scienze pure</option>
      <option value="geografia e storia">Geografia e storia</option>
    </Select>

    <div class="flex items-center gap-2">
      <span class="text-gray-900 dark:text-white">Ordinamento Alfabetico:</span>
      <Toggle on:change={toogleSortBooks} class="transition-all"></Toggle>
    </div>


    <Select class="w-full sm:w-48" on:change={selectAvailable}>
      <option value="">Tutti</option>
      <option value="true">Disponibili</option>
      <option value="false">Non disponibili</option>
    </Select>
    
    <Button color="light" on:click={resetQuery}>Reset</Button>
    
    {#if ruolo === "admin"}
      <Button color="success" on:click={() => window.location.href = "/app/addBook"}>
        Aggiungi Libro
      </Button>
    {/if}
  </div>

  <!-- Griglia dei Libri -->
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-4 w-full max-w-7xl">
    {#each books as book}
      <div>
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

<!-- Modal: Modifica Libro -->
<Modal title="Modifica Libro" bind:open={modalModifica} autoclose>
  <form class="space-y-4 p-4 bg-white dark:bg-gray-800 rounded-md">
    <Label class="block">Titolo</Label>
    <Input
      bind:value={newToUpdateBook.titolo}
      placeholder={toUpdateBook?.titolo}
      class="w-full px-3 py-2 border rounded transition-all focus:ring-2 focus:ring-blue-500"
    />
    <Label class="block">Autore</Label>
    <Input
      bind:value={newToUpdateBook.autore}
      placeholder={toUpdateBook?.autore}
      class="w-full px-3 py-2 border rounded transition-all focus:ring-2 focus:ring-blue-500"
    />
    <Label class="block">Casa Editrice</Label>
    <Input
      bind:value={newToUpdateBook.casa_editrice}
      placeholder={toUpdateBook?.casa_editrice}
      class="w-full px-3 py-2 border rounded transition-all focus:ring-2 focus:ring-blue-500"
    />
    <Label class="block">Lingua</Label>
    <Input
      bind:value={newToUpdateBook.lingua}
      placeholder={toUpdateBook?.lingua}
      class="w-full px-3 py-2 border rounded transition-all focus:ring-2 focus:ring-blue-500"
    />
        <Label class="block">Collocazione</Label>
    <Input
      bind:value={newToUpdateBook.collocazione}
      placeholder={toUpdateBook?.collocazione}
      class="w-full px-3 py-2 border rounded transition-all focus:ring-2 focus:ring-blue-500"
    />
    <div class="flex justify-end gap-2 pt-2">
      <Button on:click={aggiornaLibro}>Conferma</Button>
      <Button color="alternative" on:click={() => (modalModifica = false)}>
        Annulla
      </Button>
    </div>
  </form>
</Modal>

<!-- Modal: Visualizza Dettagli Libro -->
<Modal title="Dettagli Libro" bind:open={modalVisualizza} autoclose>
  {#if selectedBook}
    <div class="p-4 bg-white dark:bg-gray-800 rounded-md">
      <h3 class="text-xl font-bold">{selectedBook.titolo}</h3>
      <p>{selectedBook.autore} — {selectedBook.lingua}</p>
      <p class="mt-2">{selectedBook.argomenti}</p>
      <p>{selectedBook.collocazione}</p>
      <p>CDD: {selectedBook.cdd}</p>
    </div>
  {/if}
</Modal>

<!-- Modal: Prenotazione Libro -->
<Modal title="Prenota il Libro" bind:open={modalPrenota} on:close={closeReservationModal}>
  {#if error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 dark:bg-red-900 dark:border-red-700 dark:text-red-200">
      {error}
    </div>
  {/if}
  
  <form class="space-y-4 p-4 bg-white dark:bg-gray-800 rounded-md" on:submit|preventDefault={handleSubmitReservation}>
    {#each campiPrenotazione as campo}
      <div>
        <Label for={campo.key}>{campo.label}{campo.required ? ' *' : ''}</Label>
        <Input
          id={campo.key}
          type={campo.type}
          bind:value={reservation[campo.key]}
          required={campo.required}
          min={campo.min}
          class="w-full px-3 py-2 border rounded transition-all focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700"
        />
      </div>
    {/each}
    
    <div class="flex justify-end gap-2">
      <Button type="button" disabled={loading} on:click={handleSubmitReservation}>
        {#if loading}Caricamento...{:else}Prenota{/if}
      </Button>
      <Button color="alternative" type="button" on:click={closeReservationModal}>
        Annulla
      </Button>
    </div>
  </form>
</Modal>