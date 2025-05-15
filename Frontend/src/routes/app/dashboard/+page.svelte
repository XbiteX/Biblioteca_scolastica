<!-- qua verranno visualizzati i libri -->
 <script>
    import { onMount } from 'svelte';
    import BookCard from '$lib/components/bookCard.svelte';
    import { Toggle } from "flowbite-svelte";


    let ordinamento = $state();
    let autore = $state();
    let titolo = $state();
    let lingua = $state();
    let stato = $state();

    let books = $state() //array contenente i libri
    // let disponibile = $state(false) // booleano per il toggle della disponibilità dei libri

    async function fetchBooks() {
        let params = new URLSearchParams();

        if (ordinamento) params.append('ordinamento', ordinamento);
        if (autore) params.append('autore', autore);
        if (titolo) params.append('titolo', titolo);
        if (lingua) params.append('lingua', lingua);
        if (stato) params.append('stato', stato);
        console.log(params.toString())

        const url = `https://bookstoreonline.onrender.com/books?${params.toString()}`;
        console.log(params.toString())
        const risposta = await fetch(url, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
        });
           if (!risposta.ok) {
            const errorData = await risposta.json();
            console.error('Errore durante il recupero dei libri:', errorData.message);
            return;
        }
		books = await risposta.json();
    }

	onMount(async () => {

        if(!localStorage.getItem('token')){
            window.location.href = '/app/login';
        }
        console.log(localStorage.getItem("token"))

	    const response = await fetchBooks();
	});



    async function sortBooks(){

        ordinamento = "Titolo"
        const response = await fetchBooks();
    }

    async function toogleAvailable(){

        stato = "Titolo"
        const response = await fetchBooks();
    }


 </script>

<div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div class="flex flex-col sm:flex-row items-center gap-4 p-4 bg-white shadow rounded-lg">
  <input type="text" placeholder="Cerca..." class="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>

  <select class="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
    <option value="">Tutte le categorie</option>
    <option value="libri">Libri</option>
    <option value="elettronica">Elettronica</option>
    <option value="casa">Casa</option>
  </select>

  <button  onclick={sortBooks} class="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">Ordina alfabeticamente</button>

  <Toggle on:change={toogleAvailable}>disponibile</Toggle>

  <button class="w-full sm:w-auto px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition">Reset</button>

</div>


<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4">
    {#each books as book}
        <!-- lo "spacchettamento di book con {book} non funziona" -->
        <BookCard titolo={book.Titolo} casa_editrice={book['Casa editrice']} autore={book.Autore} lingua={book.Lingua} stato={book.Stato} argomenti={book.Argomenti} collocazione={book.Collocazione} prestabile={book.Prestabile}/>
    {/each}
</div>
</div>
