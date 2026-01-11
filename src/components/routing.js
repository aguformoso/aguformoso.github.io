/* jshint esversion: 6 */

import * as d3 from "npm:d3";

class DotLink {
    constructor(links, nodes) {
        this.links = links;
        this.nodes = nodes;
    }
}

// from https://en.wikipedia.org/wiki/Tier_1_network
const tier1s = [
    "7018",
    "3320",
    "3257",
    "6830",
    "3356",
    "2914",
    "5511",
    "3491",
    "6453",
    "6762",
    "1299",
    "12956",
    "701",
    "6461",
    // other major networks
    //
    "7473",
    "174",
    "6939",
    "9002",
    "1273",
    "2828",
    "4637",
    "7922"
];
const t1s = new Set(tier1s);

export function notConsecutivePath(path) {
    let s2 = [];

    for (let idx = 0; idx < path.length; idx++) {

        if (s2[s2.length-1] !== path[idx]) {
            s2.push(path[idx]);
        }
    }
    return s2;
}

export function clipPath(path) {
    if (new Set(path).intersection(t1s).size === 0) return [];

    let s2 = [];

    for (let idx = 0; idx < path.length; idx++) {
        if (t1s.has(path[idx])) {
            s2 = path.slice(0, idx + 1);
            break;
        }
    }
    return s2;
}

export function generatePath(path_) {
    let pathUnclipped = path_.split(' ').reverse();
    let path = clipPath(notConsecutivePath(pathUnclipped));
    const pairs = d3.pairs(path).filter(
        ([a,b]) => a !== b
    );

    // console.log(pathUnclipped, path, d3.pairs(path) );

    return new DotLink(
        pairs.map(
                ([a,b]) => `"${a}" -> "${b}" [color="var(--theme-foreground-muted)"]`
            ),
        [...new Set(pairs.flat())]
    );
}
