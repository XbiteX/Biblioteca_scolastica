<script>
    import { onMount } from "svelte";
    import BookCard from "$lib/components/bookCard.svelte";
    import { Toggle, Modal, Button, Input, Label, Select, Card } from "flowbite-svelte";
  
    let ordinamento;
    let autore;
    let titolo;
    let lingua;
    let stato;
    let collocazione;
    let prestabile;
  
    let books = [];
  
    let newToUpdateBook = {
      titolo: "",
      autore: "",
      casa_editrice: "",
    };

    let toUpdateBook = null;
    let modalModifica = false;
    let modalVisualizza = false;
    let selectedBook = null; // libro selezionato da passare al modalVisualizza per la visualizzazione completa di quel libro
    let ruolo = null;
  
    async function fetchBooks() {
      let params = new URLSearchParams();
  
      if (ordinamento) params.append("ordinamento", ordinamento);
      if (autore) params.append("autore", autore);
      if (titolo) params.append("titolo", titolo);
      if (lingua) params.append("lingua", lingua);
      if (stato) params.append("stato", stato);
      if (collocazione) params.append("collocazione", collocazione);
      if (prestabile) params.append("prestabile", prestabile);
  
      const url = `https://bookstoreonline.onrender.com/books?${params.toString()}`;
      console.log(url)
      const risposta = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      if (!risposta.ok) {
        const errorData = await risposta.json();
        console.error("Errore durante il recupero dei libri:", errorData.message);
        return;
      }
  
      books = await risposta.json();
    }
  
    onMount(async () => {
      if (!localStorage.getItem("token")) {
        window.location.href = "/app/login";
      }
  
      ruolo = localStorage.getItem("ruolo");
      await fetchBooks();
    });
  
    async function toogleSortBooks() {
      ordinamento = ordinamento === undefined ?  "titolo" : undefined;
      console.log(ordinamento);
      await fetchBooks();
    }
  
    async function selectAvailable(event) {
      prestabile = event.target.value;
      console.log(prestabile)
      await fetchBooks();
    }
  
    async function toogleTopic(event) {
      collocazione = event.target.value;
      await fetchBooks();
    }
  
    async function resetQuery() {
      ordinamento = undefined;
      autore = undefined;
      titolo = undefined;
      lingua = undefined;
      stato = undefined;
      collocazione = undefined;
      prestabile = undefined;
  
      await fetchBooks();
    }
  
    async function handleDeleteBook(bookID) {
      if (!bookID) {
        alert("ID libro non valido");
        return;
      }
  
      if (!confirm("Sei sicuro di voler eliminare questo libro?")) {
        return;
      }
  
      try {
        const response = await fetch("https://bookstoreonline.onrender.com/deleteBook", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ id: bookID }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          alert("Libro eliminato con successo");
          await fetchBooks();
        } else {
          alert(data.message || "Errore durante l'eliminazione.");
        }
      } catch (err) {
        alert("Errore di rete o del server.");
        console.error(err);
      }
    }  
    function handleUpdateBook(book) {
      modalModifica = true;
      toUpdateBook = book;
    }
    function handleReserveBook(bookID){
      console.log("Chiamato handleDeleteBook con ID:", bookID);
      if (!bookID) {
        alert("ID libro non valido");
        return;
      }
      localStorage.setItem('bookID', bookID);
      window.location.href = "/app/reserveBook";
    }

    function handleOpenBook(book){
      console.log(book)
      modalVisualizza = true;
      selectedBook = book;
    } 
  
    async function aggiornaLibro() {
      const finalUpdate = {
        titolo: newToUpdateBook.titolo || toUpdateBook.titolo,
        autore: newToUpdateBook.autore || toUpdateBook.autore,
        casa_editrice: newToUpdateBook.casa_editrice || toUpdateBook.casa_editrice,
      };
  
      try {
        const response = await fetch("https://bookstoreonline.onrender.com/updateBook", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ id: toUpdateBook._id, update: finalUpdate }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          alert("Libro aggiornato con successo");
          modalModifica = false;
          newToUpdateBook = { titolo: "", autore: "", casa_editrice: "" };
          await fetchBooks();
        } else {
          alert(data.message || "Errore durante l'aggiornamento.");
        }
      } catch (err) {
        alert("Errore di rete o del server.");
        console.error(err);
      }
    }
  </script>
  
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800">
    <div class="flex flex-col sm:flex-row items-center gap-4 p-4 bg-white shadow-none rounded-lg max-w-7xl w-full">
      <input
        type="text"
        placeholder="Cerca titolo..."
        class="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        bind:value={titolo}
        oninput={fetchBooks}
      />
  
      <Select
        onchange={toogleTopic}
        class="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">

        <option value="">Tutte le categorie</option>
        <option value="arti e linguaggi">arti e linguaggi</option>
        <option value="tecnologia">tecnologia</option>
        <option value="letteratura italiana">letteratura italiana</option>
        <option value="scienze pure">scienze pure</option>
        <option value="geografia e storia">geografia e storia</option>
      </Select>
  
      <Toggle checked={false} on:change={toogleSortBooks}>ordina</Toggle>
  

      <Select onchange={selectAvailable}>
        <option value="">tutti</option>
        <option value={true}>disponibili</option>
        <option value={false}>non disponibili</option>
      </Select>
  
      <Button
        onclick={resetQuery}
        class="w-full sm:w-auto px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition">
        Reset
      </Button>
  
      {#if ruolo === "admin"}
        <Button
          onclick={() => (window.location.href = "/app/addBook")}
          class="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          Aggiungi Libro
        </Button>
      {/if}
    </div>
  
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-4 max-w-7xl w-full"
    >
      {#each books as book}
        <div
          class="min-h-[400px] flex flex-col border rounded-lg shadow-lg bg-white overflow-visible"
        >
          <BookCard
            {...book}
            isAdmin={ruolo === "admin"}
            on:delete={() => handleDeleteBook(book._id)}
            on:update={() => handleUpdateBook(book)}
            on:reserve={() => handleReserveBook(book._id)}
            on:open={() => handleOpenBook(book)}
            class="flex-grow flex flex-col"
          />
        </div>
      {/each}
    </div>
  
    <Modal title="Modifica il libro" bind:open={modalModifica} autoclose>
      <form>
        <div>
          <Label for="titolo">Titolo:</Label>
          <Input
            id="titolo"
            bind:value={newToUpdateBook.titolo}
            placeholder={toUpdateBook?.titolo}
          />
        </div>
  
        <div>
          <Label for="autore">Autore:</Label>
          <Input
            id="autore"
            bind:value={newToUpdateBook.autore}
            placeholder={toUpdateBook?.autore}
          />
        </div>
  
        <div>
          <Label for="casa_editrice">Casa Editrice:</Label>
          <Input
            id="casa_editrice"
            bind:value={newToUpdateBook.casa_editrice}
            placeholder={toUpdateBook?.casa_editrice}
          />
        </div>
      </form>
  
      {#snippet footer()}
        <Button onclick={aggiornaLibro}>Conferma</Button>
        <Button color="alternative" onclick={() => (modalModifica = false)}>Annulla</Button>
      {/snippet}
    </Modal>

    <Modal title="dettagli del libro" bind:open={modalVisualizza} autoclose>
      <div class="flex-grow">
        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{selectedBook.titolo}</h5>
        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{selectedBook.lingua}, {selectedBook.autore}</p>
        <p class="mb-3 leading-tight font-normal text-gray-700 dark:text-gray-400">{selectedBook.argomenti}</p>
        <p class="mb-3 leading-tight font-normal text-gray-700 dark:text-gray-400">{selectedBook.collocazione}</p>

        <h3>{selectedBook.cdd}</h3>
      </div>
    </Modal>
  </div>
  