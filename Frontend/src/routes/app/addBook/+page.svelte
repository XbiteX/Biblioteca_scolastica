<script>
  let error = '';
  let successMessage = '';
  let loading = false;

  // Lista dei campi 
  let campi = $state([
    { nome: "_id", type: "number", required: true },
    { nome: "Collocazione", type: "text", required: true },
    { nome: "Autore", type: "text", required: true },
    { nome: "Titolo", type: "text", required: true },
    { nome: "Lingua", type: "text", required: true },
    { nome: "CDD", type: "text", required: false },
    { nome: "Note", type: "text", required: false },
    { nome: "CasaEditrice", type: "text", required: false },
    { nome: "Prestabile", type: "text", required: false },
    { nome: "Argomenti", type: "text", required: false }
  ]);

  let book = $state({});

  // Validazione dei soli campi obbligatori
  function validateForm() {
    const requiredFields = ["_id", "Collocazione", "Autore", "Titolo", "Lingua"];
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!book[field]) {
        alert("Tutti i campi obbligatori devono essere compilati.");
        return false;
    } 
  }
  return true;
}


  async function handleSubmit() {
    console.log(book);
    if (validateForm()) {
      try {
        const response = await fetch('https://bookstoreonline.onrender.com/addBook', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(book)
        });

        const data = await response.json();
        if (response.ok) {
          alert('Libro aggiunto con successo!');
          book = {}; // resetta il form
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
  <!-- Formulario di inserimento libri -->
  <form onsubmit={handleSubmit}>
    <div class="book-form">
      {#each campi as campo}
      <div class="input-field">
        <label for={campo.nome}>{campo.nome}</label>
        {#if campo.type === "text"}
        <input type="text" id={campo.nome} bind:value={book[campo.nome]} required={campo.required} class="w-full p-2 border rounded" />
        {:else}
        <input type="number" id={campo.nome} bind:value={book[campo.nome]} required={campo.required} class="w-full p-2 border rounded" />
        {/if}
        {#if campo.required}
        <span class="text-red-600">Questo campo è obbligatorio</span>
        {/if}
      </div>
      {/each}
    </div>
    <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded">Invia</button>
  </form>
  

  