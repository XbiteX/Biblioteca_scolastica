<script>
    let error = ''; // Per memorizzare eventuali errori
    let successMessage = ''; // Per il messaggio di successo
    let loading = false; // Gestisce il loading durante l'invio del modulo

    let campi = [{
        nome:"id",
        type:"number",
        required:true
    },
    {
        nome:"collocazione",
        type:"text",
        required:true
    },
    {
        nome:"autore",
        type:"text",
        required:true
    },
    {
        nome:"titolo",
        type:"text",
        required:true
    },
    {
        nome:"lingua",
        type:"text",
        required:true
    },
    {
        nome:"cdd",
        type:"text",
        required:false
    },
    {
        nome:"note",
        type:"text",
        required:false
    },
    {
        nome:"casaEditrice",
        type:"text",
        required:false
    },
    {
        nome:"prestabile",
        type:"text",
        required:false
    },
    {
        nome:"argomenti",
        type:"text",
        required:false
    }] = $state();
    
    // Array di libri (esempio)
    let book = {};
  
    // Funzione per la validazione finale del modulo
    function validateForm() {
      let valid = true;
    if (!book.id || !book.Autore || !book.Titolo || !book.Lingua) {
        valid = false;
        alert("Tutti i campi obbligatori devono essere compilati.");
    }
      return valid;
    }
  
    
    // Funzione per l'invio del modulo
    async function handleSubmit() {

        console.log(book)
      if (validateForm()) {
        try {
          const response = await fetch('https://bookstoreonline.onrender.com/addBook', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({book})
          });
          
          const data = await response.json();
          if (response.ok) {
            alert('Libro aggiunto con successo!');
            // Puoi reindirizzare o resettare il modulo dopo l'invio
          } else {
            alert(data.message || 'Errore durante l\'aggiunta del libro');
          }
        } catch (err) {
          console.error('Errore di rete o server', err);
          alert('Errore di rete o server');
        }
      }
    }
  </script>

{#each campi as campo}
<div class="input-field">
    <label for={campo.nome}>{campo.nome}</label>
    {#if type === 'number'}
      <input type="number" id={label} bind:value={book[campo.nome]} required={campo.required} class="w-full p-2 border rounded" />
    {:else}
      <input type="text" id={label} bind:value={book[campo.nome]} required={campo.required} class="w-full p-2 border rounded" />
    {/if}
    {#if campo.required}
      <span class="text-red-600">* Questo campo è obbligatorio</span>
    {/if}
  </div>
{/each}


  <!-- Formulario di inserimento libri -->
  <form on:submit|preventDefault={handleSubmit}>
    <div class="book-form">

        <div class="input-field">
            <label for={campo.nome}>{campo.nome}</label>
            {#if type === 'number'}
              <input type="number" id={label} bind:value={book[campo.nome]} required={campo.required} class="w-full p-2 border rounded" />
            {:else}
              <input type="text" id={label} bind:value={book[campo.nome]} required={campo.required} class="w-full p-2 border rounded" />
            {/if}
            {#if campo.required}
              <span class="text-red-600">* Questo campo è obbligatorio</span>
            {/if}
          </div>
    </div>
  
    <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded">Invia</button>
  </form>
  

  