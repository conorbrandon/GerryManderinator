const states = ['AZ', 'GA', 'NV'];
const fs = require('fs');

states.forEach(state => {
    let graph = require(`./${state}/censusBlocks-graphRaw.json`);
    graph.adjacency.forEach(list => {
        list.filter(obj => {
            if (obj.shared_perim < 30.48) return obj;
        });
    });
    fs.writeFileSync(`./${state}/censusBlocks-graph.json`, JSON.stringify(graph));
});