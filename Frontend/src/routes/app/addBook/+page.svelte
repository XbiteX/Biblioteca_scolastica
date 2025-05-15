<script>
  let error = '';
  let successMessage = '';
  let loading = false;

  // Definizione dei campi da inviare al backend
  const campi = [
    { key: '_id', label: 'ID', type: 'number', required: true },
    { key: 'collocazione', label: 'Collocazione', type: 'text', required: true },
    { key: 'Autore', label: 'Autore', type: 'text', required: true },
    { key: 'Titolo', label: 'Titolo', type: 'text', required: true },
    { key: 'Lingua', label: 'Lingua', type: 'text', required: true },
    { key: 'CDD', label: 'CDD', type: 'text', required: false },
    { key: 'Note', label: 'Note', type: 'text', required: false },
    { key: 'Casa editrice', label: 'Casa Editrice', type: 'text', required: false },
    { key: 'Prestabile', label: 'Prestabile', type: 'text', required: false },
    { key: 'Argomenti', label: 'Argomenti', type: 'text', required: false }
  ];

  let book = {};

  function validateForm() {
    for (const campo of campi) {
      if (campo.required && !book[campo.key]) {
        error = `Il campo "${campo.label}" è obbligatorio.`;
        return false;
      }
    }
    error = '';
    return true;
  }

  async function handleSubmit() {
    if (!validateForm()) return;

    const token = localStorage.getItem('token');
    if (!token) {
      error = 'Devi effettuare il login come admin prima di aggiungere un libro.';
      return;
    }

    loading = true;
    console.log('Invio token:', token);
    console.log('Body:', book);

    try {
      const res = await fetch('https://bookstoreonline.onrender.com/addBook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(book)
      });

      const data = await res.json();
      console.log('Risposta server:', res.status, data);

      if (res.ok) {
        successMessage = 'Libro aggiunto con successo!';
        // Redirect alla dashboard
        if (typeof window !== 'undefined') {
          window.location.href = '/app/dashboard';
        }
      } else {
        error = data.message || 'Errore durante l\'aggiunta del libro';
      }
    } catch (err) {
      console.error(err);
      error = 'Errore di rete o server';
    } finally {
      loading = false;
    }
  }
</script>

<style>
  .error { color: #e53e3e; }
  .success { color: #48bb78; }
  .form-container {
    max-width: 600px;
    margin: auto;
    padding: 1rem;
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  .form-field { margin-bottom: 1rem; }
  label { display: block; font-weight: bold; margin-bottom: 0.25rem; }
  input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #cbd5e0;
    border-radius: 0.375rem;
  }
  button {
    padding: 0.75rem 1.5rem;
    background: #3182ce;
    color: white;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
  }
  button:disabled {
    background: #a0aec0;
    cursor: not-allowed;
  }
</style>

<div class="form-container">
  <h2>Aggiungi un nuovo libro</h2>
  {#if error}
    <p class="error">{error}</p>
  {/if}
  {#if successMessage}
    <p class="success">{successMessage}</p>
  {/if}

  <form on:submit|preventDefault={handleSubmit}>
    {#each campi as campo}
      <div class="form-field">
        <label for={campo.key}>
          {campo.label}{campo.required ? ' *' : ''}
        </label>
        <input
          id={campo.key}
          type={campo.type}
          bind:value={book[campo.key]}
          required={campo.required}
        />
      </div>
    {/each}
    <button type="submit" disabled={loading}>
      {#if loading}
        Caricamento...
      {:else}
        Invia
      {/if}
    </button>
  </form>
</div>
