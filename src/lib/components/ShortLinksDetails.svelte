<script context="module" lang="ts">
    // previousCopiedID hold the latest ID of clicked link
    // Put inside context module to share with other sibling components
    let previousCopiedID: HTMLElement;
</script>
<script lang="ts">
    export let url: string = "";
    function copyLink(link: string){
        navigator.clipboard.writeText(link);

        // hide copied text from the previous click
        if (previousCopiedID){
            previousCopiedID.style.display = "none"
        }

        // show copied text on new clicked link
        const copiedId = document.getElementById(link)
        if (copiedId instanceof HTMLElement){
            copiedId.style.display = "block";
            previousCopiedID = copiedId;
        }
    }
</script>
<style>
    .url, .copy {
        border: 1px solid #ccc;
        padding: 2px 5px;
        margin: 3px 0px;
    }
    .copied {
        padding: 2px 5px;
        margin: 3px 0px;
    }
    .copy {
        border: 0px solid #aaa;
        background-color: #ddd;
    }
    .hide {
        display: none;
    }
</style>

<div class="columns mx-0 my-0 px-0 py-0">
    <div class="column is-4 url">
        <a target="_blank" href={url}>{url}</a>
    </div>
    <div class="column is-1 copy has-text-centered" role="link" tabindex="0"
        on:click={copyLink(url)}
        on:keyup={() => {}}>
        <span class="icon">
            <i class="fas fa-copy"></i>
        </span>
    </div>
    <div class="column copied hide" id={url}>
        Copied!
    </div>
</div>
