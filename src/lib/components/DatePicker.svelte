<script lang="ts">
  import Label from '$lib/components/ui/label/label.svelte';
  import * as Popover from '$lib/components/ui/popover/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import Calendar from '$lib/components/ui/calendar/calendar.svelte';
  import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
  import { getLocalTimeZone, today } from '@internationalized/date';
  import type { CalendarDate } from '@internationalized/date';

  let open = $state(false);
  let {
    selectedDate = $bindable(),
  }: {
    selectedDate: CalendarDate | undefined;
  } = $props();
</script>

<Label for="selectedDate" class="px-1">Fecha</Label>
<Popover.Root bind:open>
  <Popover.Trigger id="selectedDate">
    {#snippet child({ props })}
      <Button
        {...props}
        variant="outline"
        class="w-32 justify-between font-normal"
      >
        {selectedDate
          ? selectedDate.toDate(getLocalTimeZone()).toLocaleDateString()
          : 'Seleccionar fecha'}
        <ChevronDownIcon class="pe-2" />
      </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content class="w-auto overflow-hidden p-0" align="start">
    <Calendar
      type="single"
      bind:value={selectedDate}
      minValue={today(getLocalTimeZone())}
      onValueChange={() => {
        open = false;
      }}
      captionLayout="dropdown"
    />
  </Popover.Content>
</Popover.Root>
