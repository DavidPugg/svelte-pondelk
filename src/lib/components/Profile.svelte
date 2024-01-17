<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';

	export let username: string;
	export let avatar: string;

	$: initials = username?.split('')[0];

	const avatarColors = [
		{
			background: '#7D84B2',
			border: '#6C7299'
		},
		{
			background: '#8AA399',
			border: '#7A8A7A'
		},
		{
			background: '#8FA6CB',
			border: '#7A8A7A'
		},
		{
			background: '#C3DF86',
			border: '#B3CF76'
		},
		{
			background: '#A4E6B5',
			border: '#94D6A5'
		}
	];

	function pickRandomColor() {
		const charCode = username.charCodeAt(0);
		const colorIndex = charCode % avatarColors.length;
		return avatarColors[colorIndex];
	}

	$: color = pickRandomColor();
</script>

<Avatar.Root>
	{#if avatar}
		<Avatar.Image src={avatar} alt="avatar" />
	{:else}
		<Avatar.Fallback
			style="
			background-color: {color.background};
			border-color: {color.border};
		"
			class={`border-2 text-white`}>{initials}</Avatar.Fallback
		>
	{/if}
</Avatar.Root>
