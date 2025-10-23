<template>
  <section class="text-center">
    <h1 class="page-title">Access denied</h1>
    <p class="page-subtitle">You must be logged in to view this page.</p>
    <router-link
      :to="{ path: '/login', query: { redirect: $route.query.redirect || '/about' } }"
      class="btn btn-primary"
    >
      Go to Login
    </router-link>
  </section>
</template>

<script setup></script>
