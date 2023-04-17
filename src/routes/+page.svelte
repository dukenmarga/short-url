<svelte:head>
    <title>Short URL! by @github/dukenmarga</title>
</svelte:head>

<script lang="ts">
    import { fade } from "svelte/transition";
    import { onMount } from "svelte";
    import { pouch } from "../lib/utils/pouchdb"
    import ShortLinksDetails from "../lib/components/ShortLinksDetails.svelte";

    /**
     * Define Variables
     */
    let long_url: string = "";
    let ok: boolean = true;
    let error_msg: string = "";
    // connection to pouchdb
    let db: typeof PouchDB;
    // array of documents loaded from pouchdb
    let docs: [] | Record<string, Record<any, any>>[];

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

    // Data structure to save to PouchDB
    type PouchSaveStruct = Record<string, Date | string | number | Record<string, string>>

    // Data structure of PouchDB when loaded
    type PouchLoadAllStruct = Record<string, number | string | object | []>
    let allPouchData: PouchLoadAllStruct | undefined = undefined;

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
            const doc = {
                "_id": short_url.code,
                "short_url": short_url,
                "created_at": new Date()
            }
            pouch.save<PouchSaveStruct>(db, doc);
            reloadDocs()
        } else {
            ok = false;
            short_url = undefined;
            error_msg = json_data.error;
        }

        isLoading = false;
    }

    onMount(async() => {
        // According to https://stackoverflow.com/a/67275152/17614235,
        // we cannot just install pouchdb from npm, it won't work.
        // Sveltekit can't provide environment where pouchdb will run well.
        // Instead, we use CDN to load Pouchdb JS and create the instance when
        // the page is mounted.
        db = new PouchDB("shorturl");
        reloadDocs()
    })
    async function reloadDocs(){
        allPouchData = await pouch.loadAll(db);
        if (allPouchData && Array.isArray(allPouchData.rows)){
            docs = allPouchData.rows;
        }
    }
    async function removeDoc(id: string, rev: string){
        await pouch.remove(db, id, rev);
        reloadDocs();
    }
</script>

<section class="section is-medium">
    <h2 class="has-text-danger">Short URL!</h2>
    <h6>by <a href="https://github.com/dukenmarga/short-url">@github/dukenmarga</a></h6>
    <div class="field">
        <div class="control">
            <label for="url" class="has-text-weight-bold">Paste long URL</label>
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

    <!-- Show new created short links -->
    {#if short_url }
    <div class="box has-background-success-light" transition:fade>
        <h3>🔥 Here you go!</h3>
        <p>Original link: <span class="has-text-weight-bold">{short_url.original_link}</span></p>
        <ShortLinksDetails url={short_url.full_short_link} />
        <ShortLinksDetails url={short_url.full_short_link2} />
        <ShortLinksDetails url={short_url.full_short_link3} />
    </div>
    {/if}

    <!-- Show error if occured -->
    {#if !ok}
    <div class="notification is-danger" transition:fade>
        {error_msg}
    </div>
    {/if}

    <!-- History saved in PouchDB -->
    <div class="box has-background-warning">
        <h3>📜 Your History</h3>
        <div class="icon-text mt-0 mb-3">
            <span class="icon has-text-info">
                <i class="fas fa-info-circle"></i>
            </span>
            <span class="has-text-weight-medium">You history is saved only in your local browser.</span>
        </div>
        {#if allPouchData}
        {#each docs as doc}
        <div class="box has-background-white-ter mb-1 py-1">
            <details>
                <summary>
                    {doc.doc.short_url.original_link}
                </summary>
                <span>Created at: {doc.doc.created_at ?? ""}</span>
                <ShortLinksDetails url={doc.doc.short_url.full_short_link} />
                <ShortLinksDetails url={doc.doc.short_url.full_short_link2} />
                <ShortLinksDetails url={doc.doc.short_url.full_short_link3} />
                <div class="mt-0 mb-1">
                    <button class="button is-danger is-small is-outlined" on:click|preventDefault={removeDoc(doc.doc._id, doc.doc._rev)}>
                        <span>Delete</span>
                        <span class="icon is-small">
                            <i class="fas fa-times"></i>
                        </span>
                    </button>
                </div>
            </details>
        </div>
        {/each}
        {/if}
    </div>
</section>
