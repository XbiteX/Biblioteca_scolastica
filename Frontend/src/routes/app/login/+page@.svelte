<script>
  let isa = '';
  let password = '';
  let error = '';
  let loading = false;

  async function handleLogin() {
    loading = true;
    error = '';

    try {
      const response = await fetch('https://bookstoreonline.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isa, password })
      });

      const data = await response.json();

      if (!response.ok) {
        error = data.message || 'Credenziali non valide';
      } else {
        localStorage.setItem('token', data.token);
        localStorage.setItem('ruolo', data.ruolo);
        localStorage.setItem('isa', data.isa);
        window.location.href = '/app/dashboard';
      }
    } catch (err) {
      error = 'Errore di rete o del server';
    } finally {
      loading = false;
    }
  }
</script>

<form
  on:submit|preventDefault={handleLogin}
  class="max-w-md mx-auto mt-20 p-6 bg-white rounded-2xl shadow-lg space-y-5 border border-gray-200"
>
  <h2 class="text-2xl font-semibold text-center text-gray-800">Accesso Biblioteca scolastica</h2>

  <div class="space-y-1">
    <label for="isa" class="block text-sm font-medium text-gray-700">Codice ISA</label>
    <input
      id="isa"
      type="text"
      bind:value={isa}
      placeholder="Inserisci il codice ISA"
      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />
  </div>

  <div class="space-y-1">
    <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
    <input
      id="password"
      type="password"
      bind:value={password}
      placeholder="Inserisci la password"
      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />
  </div>

  {#if error}
    <p class="text-sm text-red-600 bg-red-100 p-2 rounded">{error}</p>
  {/if}

  <button
    type="submit"
    class="w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50"
    disabled={loading}
  >
    {loading ? 'Accesso in corso...' : 'Accedi'}
  </button>
</form>
