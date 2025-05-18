<script>
  import { Label, Input } from "flowbite-svelte";

  let bookId;
  let bookData = {};
  let loading = false;
  let error;
  let success;

  async function caricaLibro() {
    error = '';
    success = '';
    loading = true;

    try {
      const res = await fetch(`/api/getBook?id=${bookId}`);
      if (!res.ok) throw new Error(res.json().message); // ritorna il messaggio di errore dal server
      bookData = await res.json();
    } catch (e) {
      error = e.message || 'Errore durante il caricamento del libro.';
      bookData = null;
    }

    loading = false;
  }

  async function aggiornaLibro() {
    error = '';
    success = '';
    loading = true;

    try {
      const res = await fetch('/api/updateBook', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: bookId, update: bookData })
      });

      if (!res.ok) throw new Error('Errore aggiornamento');
      success = 'Libro aggiornato con successo!';
    } catch (e) {
      error = 'Errore durante aggiornamento.';
    }

    loading = false;
  }
</script>

<h1>Aggiorna libro</h1>

{#if loading}
  <p>Caricamento in corso...</p>
{/if}

{#if error}
  <p style="color: red;">{error}</p>
{/if}

{#if success}
  <p style="color: green;">{success}</p>
{/if}

{#if bookData}
  <form on:submit|preventDefault={aggiornaLibro}>
    <div>
      <Label for="titolo">Titolo:</Label>
      <Input id="titolo" bind:value={bookData.titolo} />
    </div>

    <div>
      <Label for="autore">Autore:</Label>
      <Input id="autore" bind:value={bookData.autore} />
    </div>

    <div>
      <Label for="casaEditrice">Casa Editrice:</Label>
      <Input id="casaEditrice" bind:value={bookData.casaEditrice} />
    </div>

    <div>
      <Label for="anno">Anno:</Label>
      <Input id="anno" bind:value={bookData.anno} type="number" />
    </div>

    <button type="submit">Aggiorna</button>
  </form>
{/if}
