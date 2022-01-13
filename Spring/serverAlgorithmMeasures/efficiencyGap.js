const fs = require('fs');

const efficiencyGap = async () => {
    let districtPlan = require(`../outDissolve.json`);

    const getStateFavorsParty = (diff) => {
        if (diff > 0) return "D";
        else if (diff < 0) return "R";
        else return "tie";
    };

    let efficiencyGapBases = {};
    const bases = ["HOU20", "PRE20", "USS20", "USS18", "ATG18"];
    bases.forEach(basis => {
        if (districtPlan.features[0].properties[basis + "D"] === undefined) return;
        efficiencyGapBases[basis] = {
            "totalVotes": {},
            "districtWinnersByParty": {
                "D": 0, "R": 0
            },
            "lostVotes": {},
            "excessVotes": {},
            "wastedVotes": {},
            "totalWastedVotes": {
                "D": 0, "R": 0,
            },
            "wastedVotesDifference": 0,
            "totalVotesCast": 0,
            "efficiencyGap": 0,
            "efficiencyGapFavors": ""
        };
        districtPlan.features.forEach(feature => {
            let { District } = feature.properties;
            let basisDem = feature.properties[basis + "D"];
            let basisRep = feature.properties[basis + "R"];

            efficiencyGapBases[basis].totalVotes[District] = basisDem + basisRep;
            efficiencyGapBases[basis].totalVotesCast += basisDem + basisRep;
            let whoWonTheDistrict = basisDem > basisRep ? "D" : "R";
            efficiencyGapBases[basis].districtWinnersByParty[whoWonTheDistrict] += 1;
        });
        // console.log(JSON.stringify(efficiencyGapBases, null, 1));

        districtPlan.features.forEach(feature => {
            let { District } = feature.properties;
            let basisDem = feature.properties[basis + "D"];
            let basisRep = feature.properties[basis + "R"];
            // console.log({ basis, basisDem, basisRep, District });

            efficiencyGapBases[basis].lostVotes[District] = { "D": 0, "R": 0 };
            efficiencyGapBases[basis].excessVotes[District] = { "D": 0, "R": 0 };
            efficiencyGapBases[basis].wastedVotes[District] = { "D": 0, "R": 0 };

            if (basisRep < basisDem) {
                efficiencyGapBases[basis].lostVotes[District].R += basisRep;
                efficiencyGapBases[basis].excessVotes[District].D += basisDem - (efficiencyGapBases[basis].totalVotes[District] / 2);
            }
            else {
                efficiencyGapBases[basis].lostVotes[District].D += basisDem;
                efficiencyGapBases[basis].excessVotes[District].R += basisRep - (efficiencyGapBases[basis].totalVotes[District] / 2);
            }

            efficiencyGapBases[basis].wastedVotes[District].D = efficiencyGapBases[basis].lostVotes[District].D + efficiencyGapBases[basis].excessVotes[District].D;
            efficiencyGapBases[basis].wastedVotes[District].R = efficiencyGapBases[basis].lostVotes[District].R + efficiencyGapBases[basis].excessVotes[District].R;
        });

        for (district in efficiencyGapBases[basis].wastedVotes) {
            efficiencyGapBases[basis].totalWastedVotes.D += efficiencyGapBases[basis].wastedVotes[district].D;
            efficiencyGapBases[basis].totalWastedVotes.R += efficiencyGapBases[basis].wastedVotes[district].R;
        }
        efficiencyGapBases[basis].wastedVotesDifference = Math.max(efficiencyGapBases[basis].totalWastedVotes.D, efficiencyGapBases[basis].totalWastedVotes.R) - Math.min(efficiencyGapBases[basis].totalWastedVotes.D, efficiencyGapBases[basis].totalWastedVotes.R);

        efficiencyGapBases[basis].efficiencyGap = efficiencyGapBases[basis].wastedVotesDifference / efficiencyGapBases[basis].totalVotesCast;

        efficiencyGapBases[basis].efficiencyGapFavors = getStateFavorsParty(efficiencyGapBases[basis].districtWinnersByParty.D - efficiencyGapBases[basis].districtWinnersByParty.R);

        delete efficiencyGapBases[basis].totalVotes; 
        delete efficiencyGapBases[basis].districtWinnersByParty; 
        delete efficiencyGapBases[basis].lostVotes; 
        delete efficiencyGapBases[basis].excessVotes; 
        delete efficiencyGapBases[basis].wastedVotes; 
        delete efficiencyGapBases[basis].totalWastedVotes; 
        delete efficiencyGapBases[basis].wastedVotesDifference; 
        delete efficiencyGapBases[basis].totalVotesCast; 

        console.log({ basis }, JSON.stringify(efficiencyGapBases[basis], null, 1));
    });
    console.log(efficiencyGapBases);

    let efficiencyGapParsed = {};
    let efficiencyGapFavorsParsed = {};
    for (const basis in efficiencyGapBases) {
        efficiencyGapParsed[basis] = efficiencyGapBases[basis].efficiencyGap;
        // efficiencyGapFavorsParsed[basis] = efficiencyGapBases[basis].efficiencyGap ? efficiencyGapBases[basis].efficiencyGapFavors : null;
        efficiencyGapFavorsParsed[basis] = efficiencyGapBases[basis].efficiencyGapFavors;
    }

    fs.appendFileSync('./outMeasures.txt', `efficiencyGap ${JSON.stringify(efficiencyGapParsed)}\nefficiencyGapFavors ${JSON.stringify(efficiencyGapFavorsParsed)}\n`);
};

efficiencyGap();