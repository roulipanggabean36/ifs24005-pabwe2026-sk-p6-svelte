<script>
  import { onMount } from 'svelte'
  import { currentPath, navigate, initNavigation } from './helpers/navigation.js'
  import { isLoggedIn } from './features/auth/states/authStore.js'
  import { matchRoute, getRedirect } from './router.js'
  import AuthLayout from './features/auth/layouts/AuthLayout.svelte'
  import LoginPage from './features/auth/pages/LoginPage.svelte'
  import RegisterPage from './features/auth/pages/RegisterPage.svelte'
  import LinkTreeLayout from './features/linktrees/layouts/LinkTreeLayout.svelte'
  import HomePage from './features/linktrees/pages/HomePage.svelte'
  import DetailPage from './features/linktrees/pages/DetailPage.svelte'
  import UsersPage from './features/users/pages/UsersPage.svelte'
  import ProfilePage from './features/users/pages/ProfilePage.svelte'
  import NotFoundPage from './pages/NotFoundPage.svelte'

  const route = $derived(matchRoute($currentPath))
  const redirect = $derived(getRedirect(route, $isLoggedIn))

  onMount(() => initNavigation())

  $effect(() => {
    if (redirect) navigate(redirect, { replace: true })
  })
</script>

{#if redirect}
  <p class="p-6 text-slate-500">Mengalihkan...</p>
{:else if route.name === 'login'}
  <AuthLayout><LoginPage /></AuthLayout>
{:else if route.name === 'register'}
  <AuthLayout><RegisterPage /></AuthLayout>
{:else if route.name === 'notFound'}
  <NotFoundPage />
{:else}
  <LinkTreeLayout>
    {#if route.name === 'home'}
      <HomePage />
    {:else if route.name === 'detail'}
      {#key route.params.linkTreeId}
        <DetailPage linkTreeId={route.params.linkTreeId} />
      {/key}
    {:else if route.name === 'users'}
      <UsersPage />
    {:else}
      <ProfilePage />
    {/if}
  </LinkTreeLayout>
{/if}
