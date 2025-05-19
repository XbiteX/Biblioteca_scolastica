<script>
    import { onMount } from "svelte";
    import BookCard from "$lib/components/bookCard.svelte";
    import { Toggle, Modal, Button, Input, Label } from "flowbite-svelte";
  
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
    let modal = false;
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
  
    async function sortBooks() {
      ordinamento = "Titolo";
      await fetchBooks();
    }
  
    async function toogleAvailable() {
      prestabile = prestabile === undefined || prestabile === "FALSE" ? "TRUE" : "FALSE";
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
  
    async function handelUpdateBook(book) {
      modal = true;
      toUpdateBook = book;
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
          modal = false;
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
  
      <select
        onchange={toogleTopic}
        class="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Tutte le categorie</option>
        <option value="arti e linguaggi">arti e linguaggi</option>
        <option value="tecnologia">tecnologia</option>
        <option value="letteratura italiana">letteratura italiana</option>
        <option value="scienze pure">scienze pure</option>
        <option value="geografia e storia">geografia e storia</option>
      </select>
  
      <button
        onclick={sortBooks}
        class="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        Ordina alfabeticamente
      </button>
  
      <Toggle on:change={toogleAvailable}>disponibile</Toggle>
  
      <button
        onclick={resetQuery}
        class="w-full sm:w-auto px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition"
      >
        Reset
      </button>
  
      {#if ruolo === "admin"}
        <button
          onclick={() => (window.location.href = "/app/addBook")}
          class="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          Aggiungi Libro
        </button>
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
            ondelete={() => handleDeleteBook(book._id)}
            onupdate={() => handelUpdateBook(book)}
            class="flex-grow flex flex-col"
          />
        </div>
      {/each}
    </div>
  
    <Modal title="Modifica il libro" bind:open={modal} autoclose>
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
        <Button color="alternative" onclick={() => (modal = false)}>Annulla</Button>
      {/snippet}
    </Modal>
  </div>
  