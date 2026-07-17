<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import type { Broadcaster } from '$lib/graphql/schema';

	interface Props {
		broadcaster: Broadcaster | null;
		open: boolean;
	}

	let { broadcaster, open = $bindable() }: Props = $props();

	const fullName = $derived(
		broadcaster ? `${broadcaster.firstName} ${broadcaster.lastName}` : ''
	);
	const initials = $derived(
		broadcaster
			? `${broadcaster.firstName[0] ?? ''}${broadcaster.lastName[0] ?? ''}`.toUpperCase()
			: ''
	);
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="max-h-[85vh] max-w-lg overflow-hidden p-0">
		{#if broadcaster}
			<ScrollArea class="max-h-[85vh]">
				<div class="p-6">
					<Dialog.Header class="mb-4">
						<div class="flex items-center gap-4">
							<Avatar.Root class="size-16">
								<Avatar.Image src={broadcaster.profilePictureUrl} alt={fullName} class="object-cover" />
								<Avatar.Fallback>{initials}</Avatar.Fallback>
							</Avatar.Root>
							<div class="text-left">
								<Dialog.Title class="text-xl">{fullName}</Dialog.Title>
								{#if broadcaster.city || broadcaster.country}
									<Dialog.Description>
										{[broadcaster.city, broadcaster.country].filter(Boolean).join(', ')}
									</Dialog.Description>
								{/if}
							</div>
						</div>
					</Dialog.Header>

					<audio controls src={broadcaster.demos[0]?.audioUrl} class="mb-6 h-10 w-full">
						<track kind="captions" />
					</audio>

					<div class="space-y-6">
						<section class="space-y-3">
							<h3 class="text-sm font-medium text-muted-foreground">Información personal</h3>
							<div class="grid grid-cols-2 gap-3 text-sm">
								<div>
									<p class="text-muted-foreground">Nombre</p>
									<p class="font-medium">{broadcaster.firstName}</p>
								</div>
								<div>
									<p class="text-muted-foreground">Apellido</p>
									<p class="font-medium">{broadcaster.lastName}</p>
								</div>
								{#if broadcaster.age}
									<div>
										<p class="text-muted-foreground">Edad</p>
										<p class="font-medium">{broadcaster.age} años</p>
									</div>
								{/if}
								{#if broadcaster.gender}
									<div>
										<p class="text-muted-foreground">Género</p>
										<p class="font-medium">{broadcaster.gender}</p>
									</div>
								{/if}
							</div>
						</section>

						<Separator />

						<section class="space-y-3">
							<h3 class="text-sm font-medium text-muted-foreground">Información profesional</h3>

							{#if broadcaster.skills.length}
								<div class="space-y-1.5">
									<p class="text-xs text-muted-foreground">Aptitudes</p>
									<div class="flex flex-wrap gap-1.5">
										{#each broadcaster.skills as skill (skill)}
											<Badge variant="secondary">{skill}</Badge>
										{/each}
									</div>
								</div>
							{/if}

							{#if broadcaster.languages.length}
								<div class="space-y-1.5">
									<p class="text-xs text-muted-foreground">Idiomas</p>
									<div class="flex flex-wrap gap-1.5">
										{#each broadcaster.languages as language (language)}
											<Badge variant="outline">{language}</Badge>
										{/each}
									</div>
								</div>
							{/if}

							{#if broadcaster.yearsOfExperience}
								<div>
									<p class="text-xs text-muted-foreground">Años de experiencia</p>
									<p class="text-sm font-medium">{broadcaster.yearsOfExperience} años</p>
								</div>
							{/if}

							{#if broadcaster.description}
								<div>
									<p class="text-xs text-muted-foreground">Descripción</p>
									<p class="text-sm leading-relaxed">{broadcaster.description}</p>
								</div>
							{/if}
						</section>

						{#if broadcaster.country || broadcaster.city || broadcaster.additionalInfo}
							<Separator />

							<section class="space-y-3">
								<h3 class="text-sm font-medium text-muted-foreground">Información adicional</h3>
								<div class="grid grid-cols-2 gap-3 text-sm">
									{#if broadcaster.country}
										<div>
											<p class="text-muted-foreground">País</p>
											<p class="font-medium">{broadcaster.country}</p>
										</div>
									{/if}
									{#if broadcaster.city}
										<div>
											<p class="text-muted-foreground">Ciudad</p>
											<p class="font-medium">{broadcaster.city}</p>
										</div>
									{/if}
								</div>
								{#if broadcaster.additionalInfo}
									<p class="text-sm leading-relaxed">{broadcaster.additionalInfo}</p>
								{/if}
							</section>
						{/if}
					</div>
				</div>
			</ScrollArea>
		{/if}
	</Dialog.Content>
</Dialog.Root>
