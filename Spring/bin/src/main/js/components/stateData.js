//Race data from: https://www.census.gov/quickfacts/fact/table/GA/RHI725219

const AZ = { 
  Population: "7,151,235", //MAKE SURE NUMBERS ARE STRINGS WITH COMMAS!!!!! ,,,,,
  PartyTable: {
    Democratic_Number: "1,378,324",
    Democratic_Percent: "32.2%",
    Republican_Number: "1,508,778",
    Republican_Percent: "35.2%",
    // None_Number: "0",
    // None_Percent: "0",
    Other_Number: "1,394,050",
    Other_Percent: "32.6%"
  },
  RaceTable: {
      White: "82.6%",
      Black: "5.2%",
      Asian: "3.7%",
      Native: "5.3%",
      Islander: "0.3%",
      Mixed: "2.9%",
      Hispanic: "31.7%" //Any race can be hispanic
  },
  Number_Districts: {
    Democratic: "5",
    Republican: "4"
  }
};

const GA = { 
  Population: "10,703,149", //MAKE SURE NUMBERS ARE STRINGS WITH COMMAS!!!!! ,,,,,
  PartyTable: {
    Democratic_Number: "1,086,729",
    Democratic_Percent: "14.7%",
    Republican_Number: "947,532",
    Republican_Percent: "12.8%",
    None_Number: "5,361,114",
    None_Percent: "72.5%",
    // Other_Number: "0",
    // Other_Percent: "0"
  },
  RaceTable: {
      White: "60.2%",
      Black: "32.6%",
      Asian: "4.4%",
      Native: "0.5%",
      Islander: "0.1%",
      Mixed: "2.2%",
      Hispanic: "9.9%" //Any race can be hispanic
  },
  Number_Districts: {
    Democratic: "6",
    Republican: "8"
  }
};

const NV = { 
  Population: "3,104,160", //MAKE SURE NUMBERS ARE STRINGS WITH COMMAS!!!!! ,,,,,
  PartyTable: {
    Democratic_Number: "762,460",
    Democratic_Percent: "37.0%",
    Republican_Number: "653,429",
    Republican_Percent: "31.7%",
    None_Number: "503,981	",
    None_Percent: "24.4%",
    Other_Number: "142,596",
    Other_Percent: "6.9%"
  },
  RaceTable: {
      White: "73.9%",
      Black: "10.3%",
      Asian: "8.7%",
      Native: "1.7%",
      Islander: "0.8%",
      Mixed: "4.6%",
      Hispanic: "29.9%" //Any race can be hispanic
  },
  Number_Districts: {
    Democratic: "3",
    Republican: "1"
  }
};

const stateData = [AZ,GA,NV];
export default stateData;