<svelte:head>
    <title>Short URL! by @github/dukenmarga</title>
    <script src="//cdn.jsdelivr.net/npm/pouchdb@8.0.1/dist/pouchdb.min.js"></script>
</svelte:head>

<script lang="ts">
    import { fade } from "svelte/transition";
    import { onMount } from "svelte";
    import { pouch } from "../lib/utils/pouchdb"

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

    <!-- Show new created short links -->
    {#if short_url }
    <div class="box">
        <h3>🔥 Here you go!</h3>
        <p>Original link: <span class="has-text-weight-bold">{short_url.original_link}</span></p>
        <ul>
            <li><a href={short_url.full_short_link}>{short_url.full_short_link}</a></li>
            <li><a href={short_url.full_short_link2}>{short_url.full_short_link2}</a></li>
            <li><a href={short_url.full_short_link3}>{short_url.full_short_link3}</a></li>
        </ul>
    </div>
    {/if}

    <!-- Show error if occured -->
    {#if !ok}
    <div class="notification is-danger" transition:fade>
        {error_msg}
    </div>
    {/if}

    <!-- History saved in PouchDB -->
    <div class="box">
        <h3>📜 Your History</h3>
        {#if allPouchData}
        {#each docs as doc}
        <details>
            <summary>
                {doc.doc.short_url.original_link}
            </summary>
            <span>Created at: {doc.doc.created_at ?? ""}</span>
            <ul class="mt-0 mb-0">
                <li><a target="_blank" href={doc.doc.short_url.full_short_link}>{doc.doc.short_url.full_short_link}</a></li>
                <li><a target="_blank" href={doc.doc.short_url.full_short_link2}>{doc.doc.short_url.full_short_link2}</a></li>
                <li><a target="_blank" href={doc.doc.short_url.full_short_link3}>{doc.doc.short_url.full_short_link3}</a></li>
            </ul>
            <div class="block mb-4 mt-0">
                <span class="tag is-danger">
                    Delete
                    <button class="delete is-small" on:click|preventDefault={removeDoc(doc.doc._id, doc.doc._rev)}></button>
                </span>
            </div>
        </details>
        {/each}
        {/if}
    </div>
</section>
