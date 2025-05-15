<script>
  import { onMount } from 'svelte'
  onMount(() => {
    if (localStorage.getItem('token')) {
      window.location.href = '/app/dashboard'
    }else{
      window.location.href = '/app/login'
    }
  })
</script>