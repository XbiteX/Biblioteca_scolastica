<script>
  let idToDelete = '';
  let loading = false;
  let successMessage = '';
  let errorMessage = '';

  async function handleDelete() {
    if (!idToDelete) {
      alert("Inserisci un ID valido.");
      return;
    }

    try {
      loading = true;
      const response = await fetch('https://bookstoreonline.onrender.com/deleteBook', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ id: idToDelete })
      });

      const data = await response.json();
      if (response.ok) {
        successMessage = 'Libro eliminato con successo.';
        idToDelete = '';
      } else {
        errorMessage = data.message || 'Errore durante l\'eliminazione.';
      }
    } catch (err) {
      errorMessage = 'Errore di rete o del server.';
      console.error(err);
    } finally {
      loading = false;
    }
  }
</script>

<form on:submit|preventDefault={handleDelete} class="max-w-md mx-auto bg-white p-6 rounded shadow">
  <h2 class="text-xl font-bold mb-4">Elimina Libro</h2>

  <div class="mb-4">
    <label>ID Libro da eliminare</label>
    <input type="text" bind:value={idToDelete} required class="w-full p-2 border rounded" />
  </div>

  <button type="submit" class="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700" disabled={loading}>
    {loading ? 'Eliminazione in corso...' : 'Elimina Libro'}
  </button>

  {#if successMessage}
    <p class="mt-4 text-green-600">{successMessage}</p>
  {/if}
  {#if errorMessage}
    <p class="mt-4 text-red-600">{errorMessage}</p>
  {/if}
</form>
