<script lang="ts">
  import * as Card from '$lib/components/ui/card/index.js';
  import * as Avatar from '$lib/components/ui/avatar/index.js';
  import type { Broadcaster } from '$lib/graphql/schema';

  interface Props {
    broadcaster: Broadcaster;
    onOpenDetails: (broadcaster: Broadcaster) => void;
  }

  let { broadcaster, onOpenDetails }: Props = $props();

  const fullName = $derived(`${broadcaster.firstName} ${broadcaster.lastName}`);
  const initials = $derived(
    `${broadcaster.firstName[0] ?? ''}${broadcaster.lastName[0] ?? ''}`.toUpperCase(),
  );
  const demo = $derived(
    broadcaster
      ? (broadcaster.demos.find((d) => d.title.toLowerCase() === 'demo') ??
          broadcaster.demos[0])
      : null,
  );
</script>

<Card.Root
  class="overflow-hidden border-border/60 shadow-sm transition-shadow hover:shadow-md"
>
  <Card.Content class="flex flex-col items-center gap-4 p-6 text-center">
    <button
      type="button"
      onclick={() => onOpenDetails(broadcaster)}
      class="rounded-full transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      aria-label={`Ver detalles de ${fullName}`}
    >
      <Avatar.Root class="size-24">
        <Avatar.Image
          src={broadcaster.profilePictureUrl}
          alt={fullName}
          class="object-cover"
        />
        <Avatar.Fallback>{initials}</Avatar.Fallback>
      </Avatar.Root>
    </button>

    <button
      type="button"
      onclick={() => onOpenDetails(broadcaster)}
      class="text-base font-semibold text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
    >
      {fullName}
    </button>
    {#if demo}
      <audio controls src={demo?.audioUrl} class="h-10 w-full">
        <track kind="captions" />
      </audio>
      <span class="block w-full text-center text-base text-muted-foreground">
        {'Titulo: ' + demo?.title}
      </span>
    {/if}
    <div>
      <p class="text-sm text-muted-foreground">
        {broadcaster.description}
      </p>
    </div>
  </Card.Content>
</Card.Root>
