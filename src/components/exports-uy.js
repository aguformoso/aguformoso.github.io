/* jshint esversion: 6 */

import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";
import {FileAttachment} from "observablehq:stdlib";

export async function exports(){
    let txt = await d3.text(
        await FileAttachment("Exportacion de energia electrica por destino.csv").url()
    );

    let header = txt
        .split("\n")
        .slice(
            2, // leave out the "title"
            3
        )
        .join("\n")
        .replaceAll("�", "_") // unicode replacement character
        .replaceAll("\r", "");

    let body = txt
        .split("\n")
        .slice(3)
        .join("\n")
        .replaceAll("\r", "");

    let data_ = d3
        .dsvFormat(";")
        .parse(`${header}\n${body}`);

    return data_
        .map((d) => {
            const parsed = Object.fromEntries(
                Object.keys(d)
                    .slice(2)
                    .map((k) => [k, parseFloat(d[k])])
            );
            const date = new Date(parseInt(d["a_o"]), d["mes"]);

            return {
                date,
                ...parsed
            };
        })
        .filter((d) => d.date > new Date("2000-01-01")) // invalid dates
};

export async function imports(){
    let txt = await d3.text(
        await FileAttachment("Importacion de energia electrica por origen.csv").url()
    );

    let header = txt
        .split("\n")
        .slice(
            2, // leave out the "title"
            3
        )
        .join("\n")
        .replaceAll("�", "_") // unicode replacement character
        .replaceAll("\r", "");

    let body = txt
        .split("\n")
        .slice(3)
        .join("\n")
        .replaceAll("\r", "");

    let data_ = d3
        .dsvFormat(";")
        .parse(`${header}\n${body}`);

    return data_
        .map((d) => {
            const parsed = Object.fromEntries(
                Object.keys(d)
                    .slice(2)
                    .map((k) => [k, parseFloat(d[k])])
            );
            const date = new Date(parseInt(d["a_o"]), d["mes"]);

            return {
                date,
                ...parsed
            };
        })
        .filter((d) => d.date > new Date("2000-01-01")) // invalid dates
};
