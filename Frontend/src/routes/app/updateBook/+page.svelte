<script>
  let updateData = { id: null, update: {} };
  let successMessage = '';
  let errorMessage = '';
  let loading = false;

  const updateFields = [
    "Titolo", "Collocazione", "Autore", "Lingua", "CDD", "Note", "CasaEditrice", "Prestabile", "Stato", "Argomenti"
  ];

  function handleFieldChange(field, value) {
    updateData.update[field] = value;
  }

  async function handleSubmit() {
    if (!updateData.id || Object.keys(updateData.update).length === 0) {
      alert("Inserisci l'ID del libro e almeno un campo da aggiornare.");
      return;
    }

    try {
      loading = true;
      const response = await fetch('https://bookstoreonline.onrender.com/updateBook', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();
      if (response.ok) {
        successMessage = 'Libro aggiornato con successo!';
        updateData = { id: null, update: {} };
      } else {
        errorMessage = data.message || 'Errore durante l\'aggiornamento del libro.';
      }
    } catch (err) {
      errorMessage = 'Errore di rete o del server.';
      console.error(err);
    } finally {
      loading = false;
    }
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="max-w-lg mx-auto bg-white p-6 rounded shadow">
  <h2 class="text-xl font-bold mb-4">Aggiorna Libro</h2>

  <div class="mb-4">
    <label>ID Libro (obbligatorio)</label>
    <input type="number" bind:value={updateData.id} required class="w-full p-2 border rounded" />
  </div>

  {#each updateFields as field}
    <div class="mb-4">
      <label>{field}</label>
      <input type="text" on:input={(e) => handleFieldChange(field, e.target.value)} class="w-full p-2 border rounded" />
    </div>
  {/each}

  <button type="submit" class="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600" disabled={loading}>
    {loading ? 'Caricamento...' : 'Aggiorna Libro'}
  </button>

  {#if successMessage}
    <p class="mt-4 text-green-600">{successMessage}</p>
  {/if}
  {#if errorMessage}
    <p class="mt-4 text-red-600">{errorMessage}</p>
  {/if}
</form>
