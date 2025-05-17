<script>
  let bookId = '';
  let bookData = null;
  let loading = false;
  let error = '';
  let success = '';

  async function caricaLibro() {
    error = '';
    success = '';
    loading = true;

    try {
      const res = await fetch(`/api/getBook?id=${bookId}`);
      if (!res.ok) throw new Error('Libro non trovato');
      bookData = await res.json();
    } catch (e) {
      error = 'Errore nel recupero del libro.';
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
        body: JSON.stringify({ id: bookId, ...bookData })
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

<div>
  <label>ID libro:</label>
  <input bind:value={bookId} />
  <button on:click={caricaLibro}>Carica dati</button>
</div>

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
      <label>Titolo:</label>
      <input bind:value={bookData.titolo} />
    </div>

    <div>
      <label>Autore:</label>
      <input bind:value={bookData.autore} />
    </div>

    <div>
      <label>Casa Editrice:</label>
      <input bind:value={bookData.casaEditrice} />
    </div>

    <div>
      <label>Anno:</label>
      <input bind:value={bookData.anno} type="number" />
    </div>

    <button type="submit">Aggiorna</button>
  </form>
{/if}
