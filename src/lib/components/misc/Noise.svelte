<script lang="ts">
    interface Props {
        opacity?: number;
        size?: number;
    }

    let { opacity = 0.6, size = 8 }: Props = $props();
</script>

<div style:opacity style:background-size="{size}rem {size}rem"></div>

<style>
    div {
        position: absolute;
        inset: 0;
        background-image: url("$lib/images/noise.webp");
        background-repeat: repeat;
        mix-blend-mode: overlay;
        image-rendering: pixelated;
        pointer-events: none;
    }
</style>
