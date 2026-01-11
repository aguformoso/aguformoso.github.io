```js
let attendees = await d3.csv(
  await FileAttachment(
    "data/lacnic_attendees_1_43.csv"
  ).url()
)
display(
    d3.flatGroup(attendees, d=>d.country, d=>d.meeting_number)
)
```

```js
const output = await d3.json(
  `https://query.wikidata.org/sparql?query=SELECT%20DISTINCT%20%3Fitem%20%3FitemLabel%20%3Fcountry%20%3FcountryLabel%20%3Fcode%20WHERE%20%7B%0A%20%20%3Fitem%20wdt%3AP31%20wd%3AQ5107%3B%0A%20%20%20%20(wdt%3AP527*)%20%3Fcountry.%0A%20%20%3Fcountry%20%0A%20%20%20%20wdt%3AP297%20%3Fcode.%0A%20%20SERVICE%20wikibase%3Alabel%20%7B%20bd%3AserviceParam%20wikibase%3Alanguage%20%22en%22.%20%7D%0A%7D`,
  { headers: { accept: "application/sparql-results+json" } }
)
const countryToContinent = Object.fromEntries(
    output.results.bindings.map(({ code, itemLabel }) => [
        code.value,
        itemLabel.value
    ])
)
const continents = [...new Set(Object.values(countryToContinent))]


display(countryToContinent)
```

```js
display(
    [...new Set(attendees.map(a => a.country))].join(' ')
)
```