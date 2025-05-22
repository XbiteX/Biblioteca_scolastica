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

<Navbar class="px-4 flex items-center justify-between">
  <!-- Logout a sinistra -->
  <NavUl class="flex items-center">
    <NavLi on:click={logout}>Logout</NavLi>
  </NavUl>

  <!-- Logo al centro o destra -->
  <NavBrand href="/" class="flex items-center">
    <img
      src="/images/Logo.png"
      class="w-20 h-auto object-contain"
      alt="Logo Biblioteca"
    />
  </NavBrand>

  <!-- Hamburger per mobile (opzionale) -->
  <NavHamburger />
</Navbar>

<slot />
