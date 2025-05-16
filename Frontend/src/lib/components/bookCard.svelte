<script>
  import { Card, Button } from "flowbite-svelte";
  import { createEventDispatcher } from "svelte";

  // Prendi tutti gli argomenti dal genitore
  let { CDD, autore, argomenti, lingua, titolo, casa_editrice, collocazione, stato, prestabile, note, isAdmin = false } = $props();

  const dispatch = createEventDispatcher();

  function deleteBook() {
    dispatch("delete");
  }
</script>


<div class="space-y-4">
  <Card img="/images/placeholder.svg">
    <div class="m-6">
      <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{titolo}</h5>
      <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{lingua}, {autore}</p>
      <p class="mb-3 leading-tight font-normal text-gray-700 dark:text-gray-400">{argomenti}</p>
      <h3>{CDD}</h3>

      {#if prestabile === "TRUE" || prestabile === true}
        <Button class="w-40">prendi in prestito</Button>
      {:else}
        <div class="w-40 opacity-50 cursor-not-allowed select-none">non disponibile</div>
      {/if}

      {#if isAdmin}
        <Button color="failure" on:click={deleteBook} class="mt-4 w-40">
          Elimina
        </Button>
      {/if}
    </div>
  </Card>
</div>