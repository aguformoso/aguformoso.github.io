/* jshint esversion: 6 */

import * as d3 from "npm:d3";

export async function networkInfo(ip){
    return (await d3.json(
        `https://stat.ripe.net/data/network-info/data.json?resource=${ip}`
    )).data
}
