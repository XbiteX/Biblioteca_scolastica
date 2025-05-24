<script>
  import { onMount } from "svelte";
  import { Button } from "flowbite-svelte";

  let reservations = [];
  let ruolo = null;
  let userIsa = null;
  let loading = false;
  let error = "";

  // Fetch prenotazioni
  async function fetchReservations() {
    loading = true;
    error = "";
    
    const token = localStorage.getItem("token");
    
    if (!token) {
      error = "Devi effettuare il login.";
      loading = false;
      return;
    }

    try {
      const res = await fetch("https://bookstoreonline.onrender.com/getReservations", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        reservations = data;
      } else {
        const errorData = await res.json();
        error = errorData.message || "Errore nel caricamento delle prenotazioni";
      }
    } catch (err) {
      console.error(err);
      error = "Errore di rete o server";
    } finally {
      loading = false;
    }
  }

  // Elimina prenotazione
  async function handleDeleteReservation(reservationId) {
    if (!reservationId || !confirm("Sei sicuro di voler eliminare questa prenotazione?")) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Devi effettuare il login.");
      return;
    }

    try {
      const res = await fetch("https://bookstoreonline.onrender.com/deleteReservation", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ id: reservationId })
      });

      if (res.ok) {
        alert("Prenotazione eliminata con successo!");
        await fetchReservations(); // Ricarica le prenotazioni
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Errore durante l'eliminazione della prenotazione");
      }
    } catch (err) {
      console.error(err);
      alert("Errore di rete o server");
    }
  }

  // Formatta data per visualizzazione
  function formatDate(dateString) {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("it-IT");
  }

  // Controlla se l'utente può eliminare la prenotazione
  function canDeleteReservation(reservation) {
    return ruolo === "admin" || reservation.user_isa === userIsa;
  }

  onMount(async () => {
    // Controlla autenticazione
    if (!localStorage.getItem("token")) {
      window.location.href = "/app/login";
      return;
    }
    
    ruolo = localStorage.getItem("ruolo");
    userIsa = parseInt(localStorage.getItem("isa")); // Converti in numero per confronto corretto
    await fetchReservations();
  });
</script>

<div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800">
  <!-- Header -->
  <div class="w-full max-w-7xl p-4">
    <div class="bg-white dark:bg-gray-700 rounded-lg p-6 mb-6 shadow-md">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {ruolo === "admin" ? "Tutte le Prenotazioni" : "Le Mie Prenotazioni"}
      </h1>
      <p class="text-gray-600 dark:text-gray-300">
        {ruolo === "admin" 
          ? "Gestisci tutte le prenotazioni della biblioteca" 
          : "Visualizza e gestisci le tue prenotazioni"}
      </p>
    </div>
  </div>

  <!-- Messaggio di errore -->
  {#if error}
    <div class="w-full max-w-7xl p-4">
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded dark:bg-red-900 dark:border-red-700 dark:text-red-200">
        {error}
      </div>
    </div>
  {/if}

  <!-- Loading -->
  {#if loading}
    <div class="flex justify-center items-center h-64">
      <div class="text-lg text-gray-600 dark:text-gray-300">Caricamento prenotazioni...</div>
    </div>
  {:else}
    <!-- Griglia prenotazioni -->
    <div class="w-full max-w-7xl p-4">
      {#if reservations.length === 0}
        <div class="bg-white dark:bg-gray-700 rounded-lg p-8 text-center shadow-md">
          <p class="text-gray-500 dark:text-gray-400 text-lg">
            {ruolo === "admin" 
              ? "Nessuna prenotazione presente nel sistema" 
              : "Non hai ancora effettuato prenotazioni"}
          </p>
        </div>
      {:else}
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {#each reservations as reservation}
            <div class="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <!-- Header della card -->
              <div class="flex justify-between items-start mb-4">
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  ID: {reservation._id || "N/A"}
                </div>
                {#if ruolo === "admin"}
                  <div class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded dark:bg-blue-900 dark:text-blue-200">
                    Admin View
                  </div>
                {/if}
              </div>

              <!-- Informazioni utente -->
              <div class="mb-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Codice ISA: {reservation.user_isa}
                </h3>
              </div>

              <!-- Informazioni libro -->
              <div class="mb-4">
                <p class="text-sm text-gray-600 dark:text-gray-300 mb-1">
                  <span class="font-medium">Libro ID:</span> {reservation.book_id}
                </p>
              </div>

              <!-- Date prenotazione -->
              <div class="mb-6">
                <div class="flex flex-col space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600 dark:text-gray-400">Data Inizio:</span>
                    <span class="font-medium text-gray-900 dark:text-white">{formatDate(reservation.data_inizio)}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600 dark:text-gray-400">Data Fine:</span>
                    <span class="font-medium text-gray-900 dark:text-white">{formatDate(reservation.data_fine)}</span>
                  </div>
                </div>
              </div>

              <!-- Bottone elimina (solo se l'utente ha i permessi) -->
              {#if canDeleteReservation(reservation)}
                <div class="flex justify-end">
                  <Button 
                    color="red" 
                    size="sm"
                    on:click={() => handleDeleteReservation(reservation._id)}
                  >
                    Elimina
                  </Button>
                </div>
              {:else}
                <div class="flex justify-end">
                  <div class="text-sm text-gray-400 dark:text-gray-500">
                    Non eliminabile
                  </div>
                </div>
              {/if}
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/if}

  <!-- Bottone torna alla dashboard -->
  <div class="w-full max-w-7xl p-4">
    <div class="flex justify-center">
      <Button 
        color="alternative" 
        on:click={() => window.location.href = "/app/dashboard"}
      >
        Torna alla Dashboard
      </Button>
    </div>
  </div>
</div>