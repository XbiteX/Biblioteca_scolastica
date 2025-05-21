<script>
    import { Button, Input, Label } from 'flowbite-svelte';
    import { onMount } from 'svelte';
    let error = '';
    let successMessage = '';
    let loading = false;
    let ruolo

    onMount(() => {
      ruolo = localStorage.getItem("ruolo");
    });
    // Definizione dei campi da inviare al backend per la prenotazione
    const campi = [
      { key: 'data_inizio', label: 'Data Inizio', type: 'date', required: true },
      { key: 'data_fine', label: 'Data Fine', type: 'date', required: true },
    ];
  
    let reservation = {};
  
    function validateForm() {
      for (const campo of campi) {
        if (campo.required && !reservation[campo.key]) {
          error = `Il campo "${campo.label}" è obbligatorio.`;
          return false;
        }
      }
      error = '';
      return true;
    }
  
    async function handleSubmit() {
      if (!validateForm()) return;

      reservation.user_isa = localStorage.getItem('codice_isa');
      reservation.book_id = localStorage.getItem('bookID');

      const token = localStorage.getItem('token');
      if (!token) {
        error = 'Devi effettuare il login per prenotare un libro.';
        return;
      }

      loading = true;
      console.log('Invio token:', token);
      console.log('Dati prenotazione:', reservation);
  
      try {
        const res = await fetch('https://bookstoreonline.onrender.com/reserveBook', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(reservation),
        });
  
        const data = await res.json();
        console.log('Risposta server:', res.status, data);
  
        if (res.ok) {
          successMessage = 'Prenotazione effettuata con successo!';
          // redirect alla dashboard
          window.location.href = '/app/dashboard'; 
        } else {
          error = data.message || 'Errore durante la prenotazione';
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
    <h2>Prenotazione del Libro</h2>
    {#if error}
      <p class="text-red-400">{error}</p>
    {/if}
    {#if successMessage}
      <p class="text-green-500">{successMessage}</p>
    {/if}

<!-- solo gli utenti possono prenotare libri -->
    {#if ruolo === "student"}
    <form on:submit|preventDefault={handleSubmit}>
      {#each campi as campo}
        <div class="mb-4">
          <Label for={campo.key}>
            {campo.label}{campo.required ? ' *' : ''}
          </Label>
          <Input
            id={campo.key}
            type={campo.type}
            bind:value={reservation[campo.key]}
            required={campo.required}
          />
        </div>
      {/each}
      <Button type="submit" disabled={loading}>
        {#if loading}
          Caricamento...
        {:else}
          Prenota
        {/if}
      </Button>
    </form>
    {/if}
  </div>
  