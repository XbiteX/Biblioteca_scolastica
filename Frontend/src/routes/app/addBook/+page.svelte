<script>
  import {Button, Input, Label} from 'flowbite-svelte';
  let error = '';
  let successMessage = '';
  let loading = false;

  // Definizione dei campi da inviare al backend
  const campi = [
    { key: '_id', label: 'ID', type: 'number', required: true },
    { key: 'collocazione', label: 'collocazione', type: 'text', required: true },
    { key: 'autore', label: 'autore', type: 'text', required: true },
    { key: 'titolo', label: 'titolo', type: 'text', required: true },
    { key: 'lingua', label: 'lingua', type: 'text', required: true },
    { key: 'cdd', label: 'cdd', type: 'text', required: false },
    { key: 'note', label: 'note', type: 'text', required: false },
    { key: 'casa_editrice', label: 'casa_editrice', type: 'text', required: false },
    { key: 'prestabile', label: 'prestabile', type: 'text', required: false },
    { key: 'argomenti', label: 'argomenti', type: 'text', required: false }
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
        console.error('Errore:', error);
      }
    } catch (err) {
      console.error(err);
      error = 'Errore di rete o server';
    } finally {
      loading = false;
    }
  }
</script>

<div class="max-w-[600px] mx-auto p-4 bg-white rounded shadow-md">
  <h2>Aggiungi un nuovo libro</h2>
  {#if error}
    <p class="text-red-400">{error}</p>
  {/if}
  {#if successMessage}
    <p class="text-green-500">{successMessage}</p>
  {/if}

  <form onsubmit={handleSubmit}>
    {#each campi as campo}
      <div class="mb-4">
        <Label for={campo.key}>
          {campo.label}{campo.required ? ' *' : ''}
        </Label>
        <Input
          id={campo.key}
          type={campo.type}
          bind:value={book[campo.key]}
          required={campo.required}
        />
      </div>
    {/each}
    <Button type="submit" disabled={loading}>
      {#if loading}
        Caricamento...
      {:else}
        Invia
      {/if}
    </Button>
  </form>
</div>
