export async function load() {
 // logic to fetch payments data here
// const payments = await getPayments();
const contracts = [{
    id: "1",
    broadcasterName: "Broadcaster A",
    AgencyName: "Agency X",
    state: "Active"
    },
    {
    id: "2",
    broadcasterName: "Broadcaster B",
    AgencyName: "Agency Y",
    state: "Pending"
    },
    {
    id: "3",
    broadcasterName: "Broadcaster C",
    AgencyName: "Agency Z",
    state: "Inactive"
    },
    {
    id: "4",
    broadcasterName: "Broadcaster D",
    AgencyName: "Agency W",
    state: "Active"
    },
    {
    id: "5",
    broadcasterName: "Broadcaster E",
    AgencyName: "Agency V",
    state: "Pending"
    }
];
 return {
  contracts
 };
}