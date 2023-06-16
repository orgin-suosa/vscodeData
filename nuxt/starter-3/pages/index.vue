<template>
    <div>
        <h1>Welcome to the homepage</h1>
        <button @click="enableCustomLayout">Update layout</button>

        <!-- <NuxtLayout name="custom">
            <template #header> 
                Some LayoutHeader template content.
            </template>

            The rest of the page
        </NuxtLayout> -->
        <NuxtLayout name="default"></NuxtLayout>
        <AppAlert>
            This is an auto-imported component
        </AppAlert>
        <NuxtLink to="/about">about Page</NuxtLink>
    </div>
</template>
<script setup>
function enableCustomLayout () {
  setPageLayout('custom')
}
definePageMeta({
  layout: false,
});
</script>
  