<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import * as Avatar from '$lib/components/ui/avatar/index.js';
  import { Badge } from '$lib/components/ui/badge/index.js';
  import { Separator } from '$lib/components/ui/separator/index.js';
  import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
  import type { Broadcaster, Demo } from '$lib/graphql/schema';
  import { Button } from '$lib/components/ui/button/index.js';
  import ChevronLeft from 'lucide-svelte/icons/chevron-left';
  import ChevronRight from 'lucide-svelte/icons/chevron-right';
  import * as Field from '$lib/components/ui/field/index.js';

  interface Props {
    broadcaster: Broadcaster | null;
    open: boolean;
  }

  let { broadcaster, open = $bindable() }: Props = $props();

  const fullName = $derived(
    broadcaster ? `${broadcaster.firstName} ${broadcaster.lastName}` : '',
  );
  const initials = $derived(
    broadcaster
      ? `${broadcaster.firstName[0] ?? ''}${broadcaster.lastName[0] ?? ''}`.toUpperCase()
      : '',
  );
  const demos = $derived(broadcaster?.demos ?? []);
  let currentDemoIndex = $state(0);
  const currentDemo = $derived(demos[currentDemoIndex]);
  function prevDemo() {
    currentDemoIndex =
      currentDemoIndex === 0 ? demos.length - 1 : currentDemoIndex - 1;
  }

  function nextDemo() {
    currentDemoIndex =
      currentDemoIndex === demos.length - 1 ? 0 : currentDemoIndex + 1;
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Content class="max-h-[85vh] max-w-lg overflow-hidden p-0">
    {#if broadcaster}
      <ScrollArea class="max-h-[85vh]">
        <div class="p-6">
          <Dialog.Header class="mb-4">
            <div class="flex items-center gap-4">
              <Avatar.Root class="size-16">
                <Avatar.Image
                  src={broadcaster.profilePictureUrl}
                  alt={fullName}
                  class="object-cover"
                />
                <Avatar.Fallback>{initials}</Avatar.Fallback>
              </Avatar.Root>
              <div class="text-left">
                <Dialog.Title class="text-xl">{fullName}</Dialog.Title>
                {#if broadcaster.address?.department || broadcaster.address?.country}
                  <Dialog.Description>
                    {[
                      broadcaster.address?.department?.name,
                      broadcaster.address?.country.name,
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </Dialog.Description>
                {/if}
              </div>
            </div>
          </Dialog.Header>
          {#if demos.length > 0}
            <div class="flex w-full items-center gap-2">
              {#if demos.length > 1}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  class="shrink-0"
                  onclick={prevDemo}
                  aria-label="Demo anterior"
                >
                  <ChevronLeft class="size-4" />
                </Button>
              {/if}

              <audio controls src={currentDemo?.audioUrl} class="h-10 w-full">
                <track kind="captions" />
              </audio>

              {#if demos.length > 1}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  class="shrink-0"
                  onclick={nextDemo}
                  aria-label="Siguiente demo"
                >
                  <ChevronRight class="size-4" />
                </Button>
              {/if}
            </div>

            {#if demos.length > 1}
              <div class="mt-2 flex w-full justify-center">
                <Field.Label class="text-base text-muted-foreground">
                  {'Titulo: ' + currentDemo?.title}
                </Field.Label>
              </div>
            {/if}
          {/if}
          <div class="space-y-6">
            <section class="space-y-3">
              <h3 class="text-sm font-medium text-muted-foreground">
                Información personal
              </h3>
              <div class="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p class="text-muted-foreground">Nombre</p>
                  <p class="font-medium">{broadcaster.firstName}</p>
                </div>
                <div>
                  <p class="text-muted-foreground">Apellido</p>
                  <p class="font-medium">{broadcaster.lastName}</p>
                </div>
                <div>
                  <p class="text-muted-foreground">Email</p>
                  <p class="font-medium">{broadcaster.email}</p>
                </div>
                <div>
                  <p class="text-muted-foreground">País</p>
                  <p class="font-medium">{broadcaster.address?.country.name}</p>
                </div>
                <div>
                  <p class="text-muted-foreground">Departamento</p>
                  <p class="font-medium">
                    {broadcaster.address?.department.name}
                  </p>
                </div>
                <div>
                  <p class="text-muted-foreground">Ciudad</p>
                  <p class="font-medium">{broadcaster.address?.city}</p>
                </div>
                {#if broadcaster.phoneNumber}
                  <div>
                    <p class="text-muted-foreground">Teléfono</p>
                    <p class="font-medium">{broadcaster.phoneNumber}</p>
                  </div>
                {/if}
              </div>
            </section>

            <Separator />

            <section class="space-y-3">
              <h3 class="text-sm font-medium text-muted-foreground">
                Información profesional
              </h3>

              {#if broadcaster.description}
                <div>
                  <p class="text-muted-foreground">Descripción</p>
                  <p class="font-medium">{broadcaster.description}</p>
                </div>
              {/if}

              {#if broadcaster.website}
                <div>
                  <p class="text-muted-foreground">Sitio web</p>
                  <p class="font-medium">{broadcaster.website}</p>
                </div>
              {/if}

              {#if broadcaster.skills.length}
                <div class="space-y-1.5">
                  <p class="text-xs text-muted-foreground">Aptitudes</p>
                  <div class="flex flex-wrap gap-1.5">
                    {#each broadcaster.skills as skill (skill)}
                      <Badge variant="secondary">{skill.name}</Badge>
                    {/each}
                  </div>
                </div>
              {/if}

              {#if broadcaster.languages.length}
                <div class="space-y-1.5">
                  <p class="text-xs text-muted-foreground">Idiomas</p>
                  <div class="flex flex-wrap gap-1.5">
                    {#each broadcaster.languages as language (language)}
                      <Badge variant="outline">{language.name}</Badge>
                    {/each}
                  </div>
                </div>
              {/if}

              {#if broadcaster.category}
                <div>
                  <p class="text-xs text-muted-foreground">Categoría</p>
                  <Badge variant="secondary">{broadcaster.category.name}</Badge>
                </div>
              {/if}
            </section>
          </div>
        </div>
      </ScrollArea>
    {/if}
  </Dialog.Content>
</Dialog.Root>
