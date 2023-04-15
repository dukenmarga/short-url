import type { RequestHandler } from "./$types";
import { json } from "@sveltejs/kit";

export const POST = (async ({ fetch, request }) => {
    const API_PATH = "https://api.shrtco.de/v2/shorten?url=";
    const { url } = await request.json()
    const API_ENDPOINT = API_PATH + url
    const response = await fetch(API_ENDPOINT, {
        method: 'GET',
    })

    // const json_data = 
    return json(await response.json())
}) satisfies RequestHandler;