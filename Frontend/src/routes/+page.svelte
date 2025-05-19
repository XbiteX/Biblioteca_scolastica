<script>
  import { onMount } from 'svelte'
  onMount(async () => {
    if (localStorage.getItem('token')) {
      try{
        const result = await fetch('https://bookstoreonline.onrender.com/justVerifyToken', {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!result.ok){
              window.location.href = '/app/login';
              return;
      }
      }catch(error){
        console.error('Errore durante il recupero dei dati:', error)
      }

      window.location.href = '/app/dashboard';
    }else{
      window.location.href = '/app/login';
    }
  })
</script>