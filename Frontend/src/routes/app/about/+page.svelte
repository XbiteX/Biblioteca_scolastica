<script>
  import { onMount } from "svelte";
  import { browser } from "$app/environment";

  let selectedFloor = "primo";
  let selectedRoom = null;
  let token = null;
  let ruolo = null;
  let mounted = false;

  // Dati delle librerie per piano
  const libraryRooms = {
    primo: [
      {
        id: "156-159",
        name: "Biblioteca Principale",
        description: "Collezione generale e sala lettura principale",
        subjects: ["Letteratura italiana", "Storia", "Geografia"],
        position: { x: 580, y: 350 },
        color: "green"
      },
      {
        id: "capitolium",
        name: "Sezione Capitolium",
        description: "Testi storici e documenti antichi",
        subjects: ["Storia antica", "Archeologia"],
        position: { x: 380, y: 460 },
        color: "blue"
      },
      {
        id: "giuseppe-mercalli",
        name: "Sezione Giuseppe Mercalli",
        description: "Scienze della Terra e Geografia",
        subjects: ["Geologia", "Geografia fisica"],
        position: { x: 380, y: 480 },
        color: "blue"
      }
    ],
    rialzato: [
      {
        id: "informatica",
        name: "Biblioteca di Informatica",
        description: "Manuali tecnici e risorse digitali",
        subjects: ["Informatica", "Programmazione", "Tecnologia"],
        position: { x: 1050, y: 300 },
        color: "yellow"
      },
      {
        id: "officina-mecchine",
        name: "Biblioteca Tecnica",
        description: "Manuali e schemi tecnici",
        subjects: ["Meccanica", "Ingegneria"],
        position: { x: 760, y: 280 },
        color: "yellow"
      }
    ],
    secondo: [
      {
        id: "rosetta-1-2",
        name: "Sezione Rosetta",
        description: "Letteratura classica e moderna",
        subjects: ["Letteratura", "Filologia", "Lingue classiche"],
        position: { x: 890, y: 220 },
        color: "green"
      },
      {
        id: "madame-curie",
        name: "Sezione Madame Curie",
        description: "Scienze chimiche e fisiche",
        subjects: ["Chimica", "Fisica", "Scienze pure"],
        position: { x: 720, y: 320 },
        color: "green"
      },
      {
        id: "galileo-galilei",
        name: "Sezione Galileo Galilei",
        description: "Matematica e Astronomia",
        subjects: ["Matematica", "Astronomia", "Fisica"],
        position: { x: 1020, y: 500 },
        color: "blue"
      }
    ]
  };

  const floorInfo = {
    primo: {
      title: "Piano Primo",
      description: "Piano principale con la biblioteca centrale e le sezioni storiche"
    },
    rialzato: {
      title: "Piano Rialzato", 
      description: "Sezioni tecniche e informatiche"
    },
    secondo: {
      title: "Piano Secondo",
      description: "Sezioni scientifiche e letterarie specializzate"
    }
  };

  onMount(() => {
    mounted = true;
    if (browser) {
      token = localStorage.getItem("token");
      ruolo = localStorage.getItem("ruolo");
      
      if (!token) {
        window.location.href = "/app/login";
        return;
      }
    }
  });

  function selectFloor(floor) {
    selectedFloor = floor;
    selectedRoom = null;
  }

  function selectRoom(room) {
    selectedRoom = room;
  }

  function handleCatalogClick() {
    if (browser) {
      window.location.href = "/app/dashboard";
    }
  }
</script>

<svelte:head>
  <title>Biblioteca IIS Castelli - About</title>
  <meta name="description" content="Scopri la biblioteca dell'IIS Castelli con le sue sezioni specializzate distribuite su tre piani" />
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
  <!-- Header -->
  <div class="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
    <div class="max-w-7xl mx-auto px-4 py-16">
      <div class="text-center">
        <h1 class="text-4xl md:text-6xl font-bold mb-4">
          Biblioteca IIS Castelli
        </h1>
        <p class="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
          Un centro di conoscenza e apprendimento al servizio della comunità scolastica
        </p>
      </div>
    </div>
  </div>

  <!-- About Section -->
  <div class="max-w-7xl mx-auto px-4 py-16">
    <div class="grid md:grid-cols-2 gap-12 items-center mb-16">
      <!-- Testo descrittivo -->
      <div class="space-y-6">
        <h2 class="text-3xl font-bold text-gray-800 dark:text-white">
          Chi Siamo
        </h2>
        <div class="prose prose-lg dark:prose-invert">
          <p class="text-gray-600 dark:text-gray-300 mb-4">
            La Biblioteca dell'Istituto di Istruzione Superiore Castelli rappresenta il cuore pulsante 
            della vita culturale e didattica del nostro istituto. Situata su tre piani dell'edificio 
            scolastico, offre una vasta collezione di risorse per supportare l'apprendimento e la 
            ricerca degli studenti e del corpo docente.
          </p>
          <p class="text-gray-600 dark:text-gray-300">
            Con oltre 15.000 volumi distribuiti in sezioni specializzate, la nostra biblioteca 
            copre tutte le discipline curricolari, dalle materie umanistiche a quelle scientifiche 
            e tecniche, garantendo un supporto completo al percorso formativo.
          </p>
        </div>
      </div>

      <!-- Statistiche -->
      <div class="grid grid-cols-2 gap-6">
        <div class="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg shadow-md">
          <div class="text-3xl font-bold text-blue-600 dark:text-blue-300 mb-2">15.000+</div>
          <div class="text-gray-600 dark:text-gray-300">Volumi disponibili</div>
        </div>
        <div class="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg shadow-md">
          <div class="text-3xl font-bold text-green-600 dark:text-green-300 mb-2">7</div>
          <div class="text-gray-600 dark:text-gray-300">Sezioni specializzate</div>
        </div>
        <div class="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-lg shadow-md">
          <div class="text-3xl font-bold text-purple-600 dark:text-purple-300 mb-2">3</div>
          <div class="text-gray-600 dark:text-gray-300">Piani della biblioteca</div>
        </div>
        <div class="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 rounded-lg shadow-md">
          <div class="text-3xl font-bold text-orange-600 dark:text-orange-300 mb-2">50+</div>
          <div class="text-gray-600 dark:text-gray-300">Posti lettura</div>
        </div>
      </div>
    </div>

    <!-- Sezioni della Biblioteca -->
    <div class="mb-16">
      <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">
        Le Nostre Sezioni
      </h2>
      <div class="grid md:grid-cols-3 gap-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 dark:text-white">Letteratura e Umanesimo</h3>
          </div>
          <p class="text-gray-600 dark:text-gray-300">
            Sezioni dedicate alla letteratura italiana, storia e geografia con una ricca collezione 
            di classici e opere moderne.
          </p>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 dark:text-white">Scienze e Tecnologia</h3>
          </div>
          <p class="text-gray-600 dark:text-gray-300">
            Sezioni Madame Curie e Galileo Galilei con testi scientifici, manuali tecnici 
            e risorse per l'informatica.
          </p>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 dark:text-white">Archivi Storici</h3>
          </div>
          <p class="text-gray-600 dark:text-gray-300">
            Sezione Capitolium con documenti storici, testi antichi e materiali di valore 
            storico-culturale per la ricerca.
          </p>
        </div>
      </div>
    </div>

    <!-- Mappa Interattiva -->
    {#if mounted}
    <div class="mb-16">
      <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">
        Mappa della Biblioteca
      </h2>
      
      <!-- Selezione Piano -->
      <div class="flex justify-center mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 flex space-x-2">
          {#each Object.keys(floorInfo) as floor}
            <button
              class="px-6 py-3 rounded-md font-medium transition-colors"
              class:bg-blue-600={selectedFloor === floor}
              class:text-white={selectedFloor === floor}
              class:bg-gray-100={selectedFloor !== floor}
              class:dark:bg-gray-700={selectedFloor !== floor}
              class:text-gray-700={selectedFloor !== floor}
              class:dark:text-gray-300={selectedFloor !== floor}
              on:click={() => selectFloor(floor)}
            >
              {floorInfo[floor].title}
            </button>
          {/each}
        </div>
      </div>

      <!-- Info Piano Selezionato -->
      <div class="text-center mb-8">
        <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          {floorInfo[selectedFloor].title}
        </h3>
        <p class="text-gray-600 dark:text-gray-300">
          {floorInfo[selectedFloor].description}
        </p>
      </div>

      <!-- Mappa Piano -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
        <div class="relative w-full h-96 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
          <!-- Placeholder per la planimetria -->
          <div class="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div class="text-center">
              <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
              <p>Planimetria {floorInfo[selectedFloor].title}</p>
              <p class="text-sm opacity-75">Clicca sui punti colorati per vedere i dettagli</p>
            </div>
          </div>

          <!-- Punti delle librerie -->
          {#each libraryRooms[selectedFloor] as room}
            <button
              class="absolute w-4 h-4 rounded-full transform -translate-x-2 -translate-y-2 transition-all hover:scale-150 focus:scale-150 focus:outline-none focus:ring-2 focus:ring-offset-2"
              class:bg-green-500={room.color === 'green'}
              class:bg-blue-500={room.color === 'blue'}
              class:bg-yellow-500={room.color === 'yellow'}
              class:bg-red-500={room.color === 'red'}
              class:focus:ring-green-300={room.color === 'green'}
              class:focus:ring-blue-300={room.color === 'blue'}
              class:focus:ring-yellow-300={room.color === 'yellow'}
              class:focus:ring-red-300={room.color === 'red'}
              style="left: {room.position.x * 100 / 1200}%; top: {room.position.y * 100 / 600}%"
              on:click={() => selectRoom(room)}
              title={room.name}
            >
              <span class="sr-only">{room.name}</span>
            </button>
          {/each}
        </div>
      </div>

      <!-- Lista Sezioni del Piano -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each libraryRooms[selectedFloor] as room}
          <div 
            class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 cursor-pointer transition-all hover:shadow-xl border-2"
            class:border-blue-500={selectedRoom?.id === room.id}
            class:border-gray-200={selectedRoom?.id !== room.id}
            class:dark:border-blue-400={selectedRoom?.id === room.id}
            class:dark:border-gray-600={selectedRoom?.id !== room.id}
            on:click={() => selectRoom(room)}
            on:keydown={(e) => e.key === 'Enter' && selectRoom(room)}
            role="button"
            tabindex="0"
          >
            <div class="flex items-start justify-between mb-3">
              <h4 class="font-semibold text-gray-800 dark:text-white">{room.name}</h4>
              <div 
                class="w-3 h-3 rounded-full flex-shrink-0"
                class:bg-green-500={room.color === 'green'}
                class:bg-blue-500={room.color === 'blue'}
                class:bg-yellow-500={room.color === 'yellow'}
                class:bg-red-500={room.color === 'red'}
              ></div>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-3">
              {room.description}
            </p>
            <div class="flex flex-wrap gap-1">
              {#each room.subjects as subject}
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {subject}
                </span>
              {/each}
            </div>
          </div>
        {/each}
      </div>

      <!-- Dettagli Sezione Selezionata -->
      {#if selectedRoom}
        <div class="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 rounded-lg p-6">
          <h3 class="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            {selectedRoom.name}
          </h3>
          <p class="text-gray-700 dark:text-gray-300 mb-4">
            {selectedRoom.description}
          </p>
          <div class="mb-4">
            <h4 class="font-semibold text-gray-800 dark:text-white mb-2">Materie disponibili:</h4>
            <div class="flex flex-wrap gap-2">
              {#each selectedRoom.subjects as subject}
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {subject}
                </span>
              {/each}
            </div>
          </div>
          <div class="flex space-x-4">
            <button
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              on:click={handleCatalogClick}
            >
              Esplora Catalogo
            </button>
            <button
              class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
              on:click={() => selectedRoom = null}
            >
              Chiudi Dettagli
            </button>
          </div>
        </div>
      {/if}
    </div>
    {/if}

    <!-- Orari e Contatti -->
    <div class="grid md:grid-cols-2 gap-8">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Orari di Apertura
        </h3>
        <div class="space-y-2 text-gray-600 dark:text-gray-300">
          <div class="flex justify-between">
            <span>Lunedì - Venerdì:</span>
            <span class="font-medium">8:00 - 17:00</span>
          </div>
          <div class="flex justify-between">
            <span>Sabato:</span>
            <span class="font-medium">8:00 - 13:00</span>
          </div>
          <div class="flex justify-between">
            <span>Domenica:</span>
            <span class="font-medium text-red-500">Chiuso</span>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Contatti
        </h3>
        <div class="space-y-3 text-gray-600 dark:text-gray-300">
          <div class="flex items-center">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            <span>biblioteca@iiscastelli.edu.it</span>
          </div>
          <div class="flex items-center">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
            <span>+39 02 1234567</span>
          </div>
          <div class="flex items-center">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span>Via Esempio 123, Milano</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>