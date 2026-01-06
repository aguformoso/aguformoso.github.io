---
theme: [light, dark, alt, wide]
toc: false
---

```js
import {exports, imports} from "./components/exports-uy.js";
```

# Electricity grid dashboard
## Uruguay

Latest data ${dataLast.date.toLocaleDateString("es-UY")}

<div class="grid grid-cols-4">

<div class="card grid-colspan-2 grid-rowspan-3">

```js
const dateInput = Inputs.range(
    [0, parseInt((2025 - 2000)*12 + 10 -1)],
    {
        step: 1,
        value: new Date('2025-11-01')
    }
  )
dateInput.querySelector("input[type=number]").remove();

const date = Generators.input(dateInput);

let start = new Date(d3.min(data, d=>d.date))
```

<div style="display: flex; flex-direction: column; align-items: center;">
    <h1 style="margin-top: 0.5rem;">${chosen.toLocaleDateString("es-UY")}</h1>
    <div style="display: flex; align-items: center;">
        <div>2000-01-01</div>
        ${dateInput}
        <div style="padding-left: 0.5rem;">${dataLast.date.toLocaleDateString("es-UY")}</div>
    </div>
</div>

```js
let chosen = new Date(start)
chosen.setMonth(start.getMonth() + +date)
```

```js
let dataChosen = [
        "Salto Grande", "Terra", "Baygorria", "Palmar", "Batlle", "Punta del Tigre", "Solar", "E_licos",
        "Agentes Productores", "La Tablada"
    ].map(
        str=> data.map(d => getEntriesFor({data:d, str})).filter(d => d.date.getTime() === chosen.getTime())
    ).flat()
```

```js
Plot.plot({
    title:'Energy generation',
    // subtitle: 'By location',  // breaks padding at the bottom of the card
  projection: {
    type: "mercator",
    domain: uruguay
  },
    // margin:20,
  r: { transform: (r) => r ** 2 },
  color: {
    legend: true,
    domain: centrales.features.map((f) => f.properties.name)
  },
  marks: [
    Plot.geo(uruguay, { fill: "var(--theme-foreground-faintest)" }),
    Plot.geo(uruguay, { stroke: "var(--theme-background)" }),
    Plot.geo(centrales, {
      r: "power",
      fill: d => d.properties.name, fillOpacity:.5,
      stroke: d => d.properties.name, strokeOpacity: 1.0, strokeWidth: 3
    })
  ]
})
```

</div>

<div class="card grid-colspan-2">

```js
Plot.plot({
    title:'Energy generation timeline',
    subtitle:'By power plant',
    width,
    height:width*9/16/2,
  color: {
    legend: false,
    domain: centrales.features.map((f) => f.properties.name),
  },
  marks: [
    Plot.areaY(d3.sort(foo, d=>d.date), { x: "date", y: "value", fill: "col" }),
    Plot.ruleY([0]),
    Plot.ruleX([chosen]),
      
  ]
})
```

</div>

<div class="card grid-colspan-2">

```js
Plot.plot({
    title:'Energy generation',
    subtitle: `By power plant, on ${chosen.toLocaleDateString("es-UY")}`,
    marginLeft: 100,
    color: {
        legend: false, // previous color legend should be enough
        domain: centrales.features.map((f) => f.properties.name),
    },
    marks: [
        Plot.barX(
            d3
                .flatRollup(
                    dataChosen,
                    (ds) => d3.sum(ds.map((d) => d.value)),
                    (d) => d.col
                )
                .map((d) => ({ col: d[0], value: d[1] })),
            {
                x: "value",
                y: "col",
                fill: 'col',
                sort: { y: "x", reverse: true }
            }
        ),
        Plot.ruleX([0])
    ]
})
```

</div>

<div class="card grid-colspan-2">

```js
Plot.plot({
    title:'Cumulative energy generation',
    subtitle:'By power plant, since the year 2000',
    marginLeft: 100,
    color: {
        legend: false, // previous color legend should be enough
        domain: centrales.features.map((f) => f.properties.name),
    },
    marks: [
        Plot.barX(
            d3.sort(
                d3.flatGroup(foo, d=>d.date),
                d=>d[0] // flatGroup key
            ).reverse()[0][1],
            {
                x: "value",
                y: "col",
                fill: 'col',
                sort: { y: "x", reverse: true }
            }
        ),
        Plot.ruleX([0])
    ]
})
```
</div>

</div>

<div class="card grid-colspan-4 grid-rowspan-1">

```js
let exportsUy = await exports();
let importsUy = await imports();
let exportsUyByCountry = ["Brasil", "Argentina"]
    .map((col) =>
        exportsUy.map((d) => {
            const entries = Object.entries(d);
            const value = d3.sum(
                entries.filter(([name, value]) => name.includes(col)).map((d) => d[1])
            );
            return { date: d.date, col, value };
        })
    )
    .flat().map(d => ({...d, type:'export'}))
let importsUyByCountry = ["Brasil", "Argentina"]
    .map((col) =>
        importsUy.map((d) => {
            const entries = Object.entries(d);
            const value = d3.sum(
                entries.filter(([name, value]) => name.includes(col)).map((d) => d[1])
            );
            return { date: d.date, col, value:value*-1 };
        })
    )
    .flat().map(d => ({...d, type:'import'}))
```

```js
Plot.plot({
    title:'Exports timeline',
    subtitle:'By country',
    width,
    // height:width*9/16/2,
    tip:true,
  color: {
    legend: true,
      scheme: 'Paired',
    domain: d3.cross(['Argentina', 'Brasil'], ['export', 'import']).map(([a,b]) => `${a}-${b}`),
  },
  marks: [
    Plot.areaY([...exportsUyByCountry, ...importsUyByCountry], { x: "date", y: "value", fill: d=>`${d.col}-${d.type}` }),
    Plot.ruleY([0]),
    Plot.ruleX([chosen]),
      
  ]
})
```

</div>

## Data tables

This is another way to explore the data. after fetching the data from the source it needs to go through some transformations.

<div class="grid grid-cols-4">

<div class="card grid-colspan-2">

# Energyby power plant

```js
Inputs.table(foo)
```
</div>


<div class="card grid-colspan-2">

# Exports & imports

```js
Inputs.table([...exportsUyByCountry, ...importsUyByCountry])
```

</div>

<div class="card grid-colspan-4">

# The original data

This is the data as published by the source, holding one datum per month, with each datum containing values for each of the plants, and also containing totals and subtotals.

```js
Inputs.table(data)
```

</div>

</div>

[Link to the data download page](https://www.gub.uy/ministerio-industria-energia-mineria/datos-y-estadisticas/datos/series-estadisticas-energia-electrica)

```js
let dataLast = data.sort((a, b) => b.date - a.date)[0]
let dataFirst = data.sort((a, b) => a.date - b.date)[0]
```

```js
let centrales = ({
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [-56.421037, -32.831182] },
      properties: { name: "Terra", power: dataChosen.find(d => d.col === 'Terra').value }
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [-56.806039, -32.873816] },
      properties: { name: "Baygorria", power: dataChosen.find(d => d.col === 'Baygorria').value }
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [-57.451691, -33.056311] },
      properties: { name: "Palmar", power: dataChosen.find(d => d.col === 'Palmar').value }
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [-57.938613, -31.275204] },
      properties: {
        name: "Salto Grande",
        power: dataChosen.find(d => d.col === 'Salto Grande').value
      }
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [-56.197297, -34.885294] },
      properties: { 
          name: "Batlle",
          power: dataChosen.find(d => d.col === 'Batlle').value
      }
    },
      {
          type: "Feature",
          geometry: { type: "Point", coordinates: [-56.53874, -34.750461] },
          properties: {
              name: "Punta del Tigre",
              power: dataChosen.find(d => d.col === 'Punta del Tigre').value
          }
      },
      {
          type: "Feature",
          geometry: { type: "Point", coordinates: [-56.53874, -34.750461] }, // same as Punta del Tigre
          properties: {
              name: "La Tablada",
              power: dataChosen.find(d => d.col === 'La Tablada').value
          }
      },
      {
          type: "Feature",
          geometry: { type: "Point", coordinates: [-56.53874, -34.750461] }, // same as Punta del Tigre
          properties: {
              name: "Solar",
              power: dataChosen.find(d => d.col === 'Solar').value
          }
      },
      {
          type: "Feature",
          geometry: { type: "Point", coordinates: [-56.224468, -32.248476] }, // Pampa
          properties: {
              name: "E_licos",
              power: dataChosen.find(d => d.col === 'E_licos').value
          }
      },
      {
          type: "Feature",
          geometry: { type: "Point", coordinates: [-55.102324, -33.292332] }, // Valentines
          properties: {
              name: "E_licos",
              power: dataChosen.find(d => d.col === 'E_licos').value
          }
      },
      {
          type: "Feature",
          geometry: { type: "Point", coordinates: [-56.592939, -33.831058] }, // Arias
          properties: {
              name: "E_licos",
              power: dataChosen.find(d => d.col === 'E_licos').value
          }
      },
      {
          type: "Feature",
          geometry: { type: "Point", coordinates: [-55.5, -30.5] },
          properties: {
              name: "Agentes Productores",
              power: dataChosen.find(d => d.col === 'Agentes Productores').value
          }
      }
  ]
})
```

```js
let foo = centrales.features
  .map((c) => c.properties.name)
  .map((col) =>
    data.map((d) => {
      const entries = Object.entries(d);
      const value = d3.sum(
        entries.filter(
            ([name, value]) => name.includes(col) && !name.includes("CT") && !name.toLowerCase().includes("total")
        ).map((d) => d[1])
      );
      return { date: d.date, col, value };
    })
  )
  .flat()
```

```js
let text = await d3.text(
  await FileAttachment(
    "generacion bruta de energia electrica por planta.csv"
  ).url()
)
```

```js
let header = text
  .split("\n")
  .slice(
    2, // leave out the "title"
    36
  )
  .join(" ")
  .replaceAll("�", "_") // unicode replacement character
  .replaceAll("\n\r", "")
```

```js
let body = text
    .split("\n").slice(36).join("\n")
```

```js
let data_ = d3
  .dsvFormat(";")
  .parse(`${header}\n${body}`)
  
let data = data_
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
```

```js
let getEntriesFor = ({data = dataLast, str}) => {
    let res = Object.fromEntries(
        Object.entries(data).filter(
            ([name, power]) => name.includes(str) && !name.includes("CT") && !name.toLowerCase().includes("total")
        )
    )
    
    return {
        ...res, 
        [str]:d3.sum(Object.entries(res).map(d=>d[1])), 
        date: data.date,
        col: str, //  makes group-by-col easier
        value: d3.sum(Object.entries(res).map(d=>d[1])) //  makes rollup-by-col easier
    }
}
```

```js
const uruguay = d3.json(
  `https://raw.githubusercontent.com/alotropico/uruguay.geo/refs/heads/master/uruguay.geojson`
)
```

```js
import * as Inputs from "npm:@observablehq/inputs";
```

---

## About this dashboard

This dashboard was inspired by Observable's [U.S. electricity grid dashboard](). Data was collected from the [Government of Uruguay](https://www.gub.uy/ministerio-industria-energia-mineria/datos-y-estadisticas/datos/series-estadisticas-energia-electrica).

Like it? Leave a star [on GitHub](https://github.com/aguformoso/aguformoso.github.io)! More data will be added based on interest.