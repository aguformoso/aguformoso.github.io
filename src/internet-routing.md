---
theme: [light, dark, alt, wide]
toc: false
---

```js
import {userInfo} from "./components/user-info.js";
import {networkInfo} from "./components/network-info.js";

const user = await userInfo()
const network = await networkInfo(user.ip);
```

```js
import {generatePath, clipPath, notConsecutivePath} from "./components/routing.js";
```

```js
import * as Inputs from "npm:@observablehq/inputs";
```

```js
const routeViews = await d3.json(`https://routeviews-cors.aguformoso.workers.dev/prefix/${network.prefix}`)
let dotLinks = routeViews[0].reporting_peers.map(
    r => ({...r, dotLink: generatePath(r.as_path)})
);
const dotPaths = [...new Set(dotLinks.map(
    r => r.dotLink.links
).flat())].join('; ')

const dotNodes =    [...new Set(dotLinks.map(
        d=>d.dotLink.nodes.map(
            n => `AS${n} [style=filled bgcolor="red"]`
        )
    ).flat())].join(';')

```

# Internet Routing information

Your IP=${user.ip}, prefix=${network.prefix}, asn=${network.asns.join(', ')}

```js
const input = view(
    Inputs.form(
        {
            asn: Inputs.text(
                    {
                        value: network.asns.join(','),
                        label: 'ASN to query for',
                        submit: true
                    }
                ),
            startTime: Inputs.date({label: 'Start', value:new Date('2020-01-01'), submit:true}),
            endTime: Inputs.date({label: 'End', value:new Date(), submit:true})
        }
    )
)
```

```js
import {Address4, Address6} from "https://cdn.skypack.dev/ip-address@10.1.0";
class Address {
    constructor(ip) {
        return ip.includes(':') ? 
            this.address = new Address6(ip) : 
            this.address = new Address4(ip)
    }
}
```

```js
const ripestatAnnounced = (
    await d3.json(
        `https://stat.ripe.net/data/announced-prefixes/data.json?resource=${input.asn}&starttime=${input.startTime.toISOString().split('T')[0]}&endtime=${input.endTime.toISOString().split('T')[0]}`
    )
).data.prefixes
    
    
```

```js
const timeline = ripestatAnnounced.map(
    ({prefix, timelines}) => {
        
        prefix = new Address(prefix)
        return timelines.map(
            ({starttime, endtime}) => ({
                prefix,
                starttime: new Date(`${starttime}Z`),
                endtime: new Date(`${endtime}Z`)
            })
        )
    }
).flat()
```

```dot
digraph G {
  rankdir = LR
  ${dotPaths};
}
```

```js
Plot.plot({
    title: `Routing information for ${input.asn}`,
  width, 
  marginLeft: 100,
    y:{tickFormat: d=> Address4.fromBigInt(d).address},
  marks: [
    Plot.rectX(
      timeline.filter((t) => t.prefix.v4),
      {
        x1: "starttime",
        x2: "endtime",
        y1: t => t.prefix.startAddress().bigInt(),
        y2: t => t.prefix.endAddress().bigInt(),
        fill: "red",
        stroke: "red"
      }
    ),
    // Plot.rectX(
    //   announced.filter((v) => !v.prefix.includes(":")),
    //   {
    //     x1: "start",
    //     x2: "stop",
    //     y: "prefix",
    //     fill: "dataset"
    //   }
    // )
  ]
})
```