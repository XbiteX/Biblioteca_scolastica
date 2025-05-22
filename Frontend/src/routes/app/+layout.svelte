<script>
  import {
    Navbar,
    NavBrand,
    NavLi,
    NavUl,
    NavHamburger,
  } from "flowbite-svelte";
  import { logout } from "$lib/index.js";
</script>

<Navbar class="px-4 flex items-center justify-between bg-blue-300">

    <!-- Logout a sinistra -->
  <NavUl class="flex items-center">
    <NavLi on:click={logout}>Logout</NavLi>
    <NavLi href="/about">About</NavLi>
    <NavLi href="/docs/components/navbar">Navbar</NavLi>
    <NavLi href="/pricing">Pricing</NavLi>

    <NavLi color="blue" href="/app/reserveBook">Gestisci prenotazioni</NavLi>
  </NavUl>
 
   <NavBrand href="/" class="flex items-center">
    <img
      src="/images/Logo.png"
      class="w-20 h-auto object-contain"
      alt="Logo Biblioteca"
    />
  </NavBrand>




</Navbar>

<slot />
