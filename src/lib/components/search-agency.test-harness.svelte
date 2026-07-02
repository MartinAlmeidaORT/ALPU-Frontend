<script lang="ts">
  import SearchAgency from './search-agency.svelte';

  let valorId = $state<string | number | null | undefined>(null);
</script>

<SearchAgency bind:valorId />
<output aria-label="selected-agency-id">{valorId ?? ''}</output>
