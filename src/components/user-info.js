/* jshint esversion: 6 */

import * as d3 from "npm:d3";

export async function userInfo(){
    return Object.fromEntries(
        d3
            .dsvFormat("=")
            .parseRows(await d3.text(`https://cloudflare.com/cdn-cgi/trace`))
    )
}
