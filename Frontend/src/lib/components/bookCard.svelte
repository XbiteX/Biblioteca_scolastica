<script>
  import { Card, Button } from "flowbite-svelte";
  import { createEventDispatcher } from "svelte";

  // Prendi tutti gli argomenti dal genitore
  let { cdd, autore, argomenti, lingua, titolo, casa_editrice, collocazione, stato, prestabile, note, isAdmin = false } = $props();

  const dispatch = createEventDispatcher();
    function reserveBook(){
    window.location.href = '/app/reserveBook';
  }
</script>


<div class="space-y-4">
  <Card img="/images/placeholder.svg">
    <div class="m-6">
      <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{titolo}</h5>
      <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{lingua}, {autore}</p>
      <p class="mb-3 leading-tight font-normal text-gray-700 dark:text-gray-400">{argomenti}</p>
      <h3>{cdd}</h3>

      {#if prestabile === true}
        <Button class="w-40" onclick={reserveBook()}>prendi in prestito</Button>
      {:else}
        <div class="w-40 opacity-50 cursor-not-allowed select-none">non disponibile</div>
      {/if}

      {#if isAdmin}
        <Button color="" on:click={()=>dispatch("delete")} class="mt-4 w-40">
          Elimina
        </Button>
        <Button on:click={()=>dispatch("update")} class="mt-4 w-40 bg-blue-300 hover:bg-blue-500">
          Modifica
        </Button>
      {/if}
    </div>
  </Card>
</div>