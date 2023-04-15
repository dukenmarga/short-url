<svelte:head>
    <title>Short URL! by @github/dukenmarga</title>
</svelte:head>

<script lang="ts">
    import { fade } from "svelte/transition"
    // define variables
    let long_url: string = "";
    let ok: boolean = true;
    let error_msg: string = "";

    // Common struct for short url
    type ShortURLStruct = Record<string, string>
    let short_url: ShortURLStruct | undefined = undefined;

    // Data format returned from the API
    type RespSuccess = {
        ok: true,
        result: ShortURLStruct
    }
    type RespError = {
        ok: false,
        error_code: number,
        error: string
    }
    let json_data: RespSuccess | RespError;

    let isLoading: boolean = false;
    async function shortit(){
        // show loading spinner and clear result
        isLoading = true;
        short_url = undefined;
        ok = true;

        // send request to short url API
        const response = await fetch('/short', {
            method: 'POST',
            body: JSON.stringify({ url: long_url }),
            headers: {
                'content-type': 'application/json'
            }
        });

        // convert to JSON
        json_data = await response.json();

        // if ok, put in a var
        if (json_data.ok && "result" in json_data) {
            short_url = json_data.result;
        } else {
            ok = false;
            short_url = undefined;
            error_msg = json_data.error;
        }
        isLoading = false;
    }
</script>

<section class="section is-medium">
    <h2 class="has-text-danger">URL Short!</h2>
    <h6>by @github/dukenmarga</h6>
    <div class="field">
        <div class="control">
            <label for="url" class="has-text-weight-bold">Your URL</label>
            <input id="url" class="input" type="text" bind:value={long_url}
                placeholder="Your long url here ex. https://yourlongurl.com/many-words-in-the-path-that-you-need-to-make-it-shorter">
        </div>
    </div>
    <div class="field">
        <div class="control">
            <button class="button is-info" class:is-loading={isLoading}
                on:click|preventDefault={shortit}>Make it short!</button>
        </div>
    </div>

    {#if short_url }
        <li><a href={short_url.full_short_link}>{short_url.full_short_link}</a></li>
        <li><a href={short_url.full_short_link2}>{short_url.full_short_link2}</a></li>
        <li><a href={short_url.full_short_link3}>{short_url.full_short_link3}</a></li>
    {/if}
    {#if !ok}
        <div class="notification is-danger" transition:fade>
            {error_msg}
        </div>
    {/if}
</section>
