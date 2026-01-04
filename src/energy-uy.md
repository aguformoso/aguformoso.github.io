---
theme: [light, dark, alt, wide]
toc: false
---

# Electricity grid dashboard
## Uruguay

Latest data ${dataLast.date.toLocaleDateString("en-EU")}

<div class="grid grid-cols-4" style="grid-auto-rows: 240px;">

<div class="card grid-colspan-2 grid-rowspan-3">

```js
Plot.plot({
    title:'Energy generation by location',
    // subtitle:'E',
  // width,
  projection: {
    type: "mercator",
    domain: uruguay
  },
  r: { transform: (r) => r ** 2 },
  color: {
    legend: false,//true,
    domain: centrales.features.map((f) => f.properties.name)
  },
  marks: [
    Plot.geo(uruguay, { fill: "var(--theme-foreground-faintest)" }),
    Plot.geo(uruguay, { stroke: "var(--theme-background)" }),
    Plot.geo(centrales, {
      r: "power",
      fill: "#dfdfd6",
      stroke: "#dfdfd6"
    })
  ]
})
```

</div>

<div class="card grid-colspan-2">

```js
Plot.plot({
    title:'Energy generation by plant',
    width,
    height:width*9/16/3,
  color: {
    legend: true,
    domain: centrales.features.map((f) => f.properties.name),
  },
  marks: [
    Plot.areaY(foo, { x: "date", y: "value", fill: "col" }),
    Plot.ruleY([0])
  ]
})
```

</div>

<div class="card grid-colspan-2">

```js
Plot.plot({
    title:'Cumulative energy generation by plant',
    subtitle:'Since the year 2000 (start of this dataset)',
    marginLeft: 100,
    color: {
        legend: false, // previous color legend should be enough
        domain: centrales.features.map((f) => f.properties.name),
    },
    marks: [
        Plot.barX(
            d3
                .flatRollup(
                    foo,
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
<h2>Imports and exports per country</h2>
<h3>Under construction... stay tuned!</h3>
</div>

</div>

## Data tables

An easier way to explore the data.

### The original data

This is the data from the source, holding one datum per month, with each datum containing values for each of the plants, and also containing totals and subtotals.
<div class="card" style="padding: 0;">

```js
Inputs.table(data, { value: data })
```

</div>

[Link to the data download page](https://www.gub.uy/ministerio-industria-energia-mineria/datos-y-estadisticas/datos/series-estadisticas-energia-electrica)

```js
let dataLast = data.sort((a, b) => b.date - a.date)[0]

```

```js
let centrales = ({
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [-56.421037, -32.831182] },
      properties: { name: "Terra", power: dataLast.Terra }
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [-56.806039, -32.873816] },
      properties: { name: "Baygorria", power: dataLast.Baygorria }
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [-57.451691, -33.056311] },
      properties: { name: "Palmar", power: dataLast.Palmar }
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [-57.938613, -31.275204] },
      properties: {
        name: "Salto Grande",
        power: dataLast["Salto Grande (corresp. a Uruguay)"]
      }
    },
    // {
    //   type: "Feature",
    //   geometry: { type: "Point", coordinates: [-56.197297, -34.885294] },
    //   properties: { name: "Batlle", power: d3.sum(getEntriesFor("Batlle")) }
    // }
    // {
    //   type: "Feature",
    //   geometry: { type: "Point", coordinates: [-56.53874, -34.750461] },
    //   properties: { power: d3.sum(getEntriesFor("Tigre")) }
    // }
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
        entries.filter(([name, value]) => name.includes(col)).map((d) => d[1])
      );
      // console.log(
      //   col,
      //   d3.sum(
      //     entries.filter(([name, value]) => name.includes(col)).map((d) => d[1])
      //   )
      // );
      return { date: d.date, col, value }; //: d[col] };
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
let getEntriesFor = (str) =>
  Object.entries(dataLast).filter(
    ([name, power]) => power && name.includes(str)
  )
```

```js
const uruguay = d3.json(
  `https://raw.githubusercontent.com/alotropico/uruguay.geo/refs/heads/master/uruguay.geojson`
)
```

---

## About this dashboard

This dashboard was inspired by Observable's [U.S. electricity grid dashboard](). Data was collected from the [Government of Uruguay](https://www.gub.uy/ministerio-industria-energia-mineria/datos-y-estadisticas/datos/series-estadisticas-energia-electrica).

Like it? Leave a star here on GitHub! More data will be added based on interest.