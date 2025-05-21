<script>
  import { onMount } from 'svelte'
  import { checkToken } from '$lib/index.js'

  onMount(async () => {
    if (localStorage.getItem('token') && await checkToken()) {
      window.location.href = '/app/dashboard';
    }else{
      window.location.href = '/app/login';
    }
  })
</script>