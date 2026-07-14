<script lang="ts">
	import { UserSearch } from 'lucide-svelte';
</script>

<div class="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16 text-center">
	<div class="flex size-12 items-center justify-center rounded-full bg-muted">
		<UserSearch class="size-6 text-muted-foreground" />
	</div>
	<div class="space-y-1">
		<p class="font-medium">No se encontraron locutores</p>
		<p class="text-sm text-muted-foreground">
			No se encontraron locutores para los filtros seleccionados.
		</p>
	</div>
</div>
