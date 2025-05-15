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

      console.log('status:', response.status);
      console.log('data:', data);
      console.log(typeof(isa));
      console.log(password);
      console.log(localStorage.getItem('token'));


      if (!response.ok) {
        error = data.message || 'Credenziali non valide';
      } else {
        localStorage.setItem('token', data.token);
        // Puoi anche reindirizzare alla pagina della biblioteca o altro
        window.location.href = '/app/dashboard';
      }
    } catch (err) {
      error = 'Errore di rete o del server';
    } finally {
      loading = false;
    }
  }
</script>

<form on:submit|preventDefault={handleLogin} class="p-4 rounded bg-white shadow space-y-4 max-w-sm mx-auto mt-10">
  <h2 class="text-xl font-bold">Login Biblioteca</h2>

  <input
    type="text"
    bind:value={isa}
    placeholder="Codice ISA"
    class="w-full p-2 border rounded"
    required
  />

  <input
    type="password"
    bind:value={password}
    placeholder="Password"
    class="w-full p-2 border rounded"
    required
  />

  {#if error}
    <p class="text-red-600">{error}</p>
  {/if}

  <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded" disabled={loading}>
    {loading ? 'Accesso...' : 'Accedi'}
  </button>
</form>
