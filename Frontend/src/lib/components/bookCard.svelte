<script>
  import { Card, Button } from "flowbite-svelte";
  import { createEventDispatcher } from "svelte";

  let {
    cdd,
    autore,
    argomenti,
    lingua,
    titolo,
    casa_editrice,
    collocazione,
    stato,
    prestabile,
    note,
    isAdmin = false,
    img
  } = $props();

  const dispatch = createEventDispatcher();
</script>

<div role="button"class="space-y-4" onclick={(e) =>{e.stopPropagation(); dispatch("open")}}>
  <Card {img} class="shadow-none border-0 flex flex-col min-h-[300px]" >
    <div class="m-6 flex flex-col h-full">

      <!-- Testo del libro -->
      <div class="flex-grow">
        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{titolo}</h5>
        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{lingua}, {autore}</p>
      </div>

      <div class="flex flex-col gap-2 mb-4">
        {#if prestabile === "true" || prestabile === true}
          <Button class="w-40" on:click={(e) =>{e.stopPropagation(); dispatch("reserve")}}>prendi in prestito</Button>
        {:else}
          <div class="w-40 opacity-50 cursor-not-allowed select-none">non disponibile</div>
        {/if}

        {#if isAdmin}
          <Button color="" onclick={(e) =>{ e.stopPropagation(); dispatch("delete")}} class="w-40">
            Elimina
          </Button>
          <Button onclick={(e) => {e.stopPropagation(); dispatch("update")}} class="w-40 bg-blue-300 hover:bg-blue-500">
            Modifica
          </Button>
        {/if}
      </div>

    </div>
  </Card>
</div>
