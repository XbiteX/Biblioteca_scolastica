<script>
  import {Button, Input, Label} from 'flowbite-svelte';
  import { onMount } from 'svelte';

  // cropperjs per il ritaglio delle immagini
  import 'cropperjs/dist/cropper.css';
  import Cropper from 'cropperjs';
  
  let error = '';
  let successMessage = '';
  let loading = false;

  // Variabili per la gestione dell'immagine
  let fileInput;
  let imagePreview;
  let cropper;
  let selectedFile;
  let showCropper = false;

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

  function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Verifica che sia un'immagine
    if (!file.type.startsWith('image/')) {
      error = 'Per favore seleziona un file immagine valida.';
      return;
    }

    selectedFile = file;
    const reader = new FileReader();
    
    reader.onload = (e) => {
      showCropper = true;
      
      // Aspetta che il DOM sia aggiornato prima di inizializzare il cropper, non possiamo usare onMount pk onMount viene eseguito solo una volta all'inizio
      setTimeout(() => {
        if (imagePreview) {
          imagePreview.src = e.target.result;
          
          // Inizializza il cropper
          if (cropper) {
            cropper.destroy();
          }
          
          cropper = new Cropper(imagePreview, {
            aspectRatio: 3/4, // Rapporto tipico per copertine di libri
            viewMode: 2,
            dragMode: 'move',
            autoCropArea: 1,
            restore: false,
            guides: false,
            center: false,
            highlight: false,
            cropBoxMovable: true,
            cropBoxResizable: true,
            toggleDragModeOnDblclick: false,
          });
        }
      }, 100);
    };
    
    reader.readAsDataURL(file);
    error = '';
  }

  function cropAndSaveImage() {
    if (!cropper) return;

    // Ottieni l'immagine ritagliata come canvas
    const canvas = cropper.getCroppedCanvas({
      width: 300,
      height: 400,
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high',
    });

    // Converti in base64
    const base64Image = canvas.toDataURL('image/jpeg', 0.8);
    
    // Aggiungi l'immagine all'oggetto book
    book.immagine = base64Image;
    
    // Nascondi il cropper
    showCropper = false;
    successMessage = 'Immagine ritagliata e salvata con successo!';
    
    setTimeout(() => {
      successMessage = '';
    }, 3000);
  }

  function cancelCrop() {
    showCropper = false;
    fileInput.value = '';
    selectedFile = null;
    if (cropper) {
      cropper.destroy();
      cropper = null;
    }
  }

  function removeImage() {
    delete book.immagine;
    showCropper = false;
    fileInput.value = '';
    selectedFile = null;
    if (cropper) {
      cropper.destroy();
      cropper = null;
    }
  }

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

<div class="max-w-[800px] mx-auto p-4 bg-white rounded shadow-md">
  <h2 class="text-2xl font-bold mb-6">Aggiungi un nuovo libro</h2>
  
  {#if error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {error}
    </div>
  {/if}
  
  {#if successMessage}
    <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
      {successMessage}
    </div>
  {/if}

  <form on:submit|preventDefault={handleSubmit}>
    <!-- Campi del libro -->
    {#each campi as campo}
      <div class="mb-4">
        <Label for={campo.key} class="block text-sm font-medium text-gray-700 mb-2">
          {campo.label}{campo.required ? ' *' : ''}
        </Label>
        <Input
          id={campo.key}
          type={campo.type}
          bind:value={book[campo.key]}
          required={campo.required}
          class="w-full"
        />
      </div>
    {/each}

    <!-- Sezione immagine -->
    <div class="mb-6">
      <Label class="block text-sm font-medium text-gray-700 mb-2">
        Immagine copertina (opzionale)
      </Label>
      
      <div class="space-y-4">
        <!-- Input file -->
        <input
          bind:this={fileInput}
          type="file"
          accept="image/*"
          on:change={handleFileSelect}
          class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />

        <!-- Preview dell'immagine salvata -->
        {#if book.immagine && !showCropper}
          <div class="relative inline-block">
            <img src={book.immagine} alt="Copertina" class="w-32 h-auto border rounded shadow" />
            <button
              type="button"
              on:click={removeImage}
              class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
            >
              ×
            </button>
          </div>
        {/if}
      </div>
    </div>

    <!-- Cropper modal -->
    {#if showCropper}
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto">
          <h3 class="text-lg font-semibold mb-4">Ritaglia l'immagine</h3>
          
          <div class="mb-4">
            <img bind:this={imagePreview} alt="Anteprima" class="max-w-full" style="max-height: 400px;" />
          </div>
          
          <div class="flex justify-end space-x-3">
            <Button
              type="button"
              on:click={cancelCrop}
              class="bg-gray-500 hover:bg-gray-600"
            >
              Annulla
            </Button>
            <Button
              type="button"
              on:click={cropAndSaveImage}
              class="bg-blue-500 hover:bg-blue-600"
            >
              Conferma ritaglio
            </Button>
          </div>
        </div>
      </div>
    {/if}

    <!-- Pulsante submit -->
    <div class="pt-4">
      <Button type="submit" disabled={loading} class="w-full">
        {#if loading}
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Caricamento...
        {:else}
          Aggiungi libro
        {/if}
      </Button>
    </div>
  </form>
</div>

<style>
  :global(.cropper-container) {
    max-height: 400px;
  }
</style>