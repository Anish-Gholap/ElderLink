// list of community clubs in Singapore in alphabetical order
const getLocationOfCC = (cc) => "Singapore"; // TODO: implement this function later


const listOfCCsStrings = [
    "Aljunied CC",
    "Anchorvale CC",
    "Ang Mo Kio CC",
    "Bedok CC",
    "Bishan CC",
    "Bukit Batok CC",
    "Bukit Panjang CC",
    "Bukit Timah CC",
    "Changi Simei CC",
    "Cheng San CC",
    "Choa Chu Kang CC",
    "Clementi CC",
    "Eunos CC",
    "Geylang Serai CC",
    "Henderson CC",
    "Hong Kah North CC",
    "Hougang CC",
    "Jalan Besar CC",
    "Jurong Green CC",
    "Jurong Spring CC",
    "Kampong Chai Chee CC",
    "Kampong Glam CC",
    "Kebun Baru CC",
    "Kembangan Chai Chee CC",
    "Kim Seng CC",
    "Marine Parade CC",
    "Nee Soon Central CC",
    "Nee Soon East CC",
    "Nee Soon South CC",
    "Pasir Ris East CC",
    "Pasir Ris Elias CC",
    "Paya Lebar Kovan CC",
    "Potong Pasir CC",
    "Punggol 21 CC",
    "Queenstown CC",
    "Sembawang CC",
    "Sengkang CC",
    "Siglap CC",
    "Tampines Central CC",
    "Tampines Changkat CC",
    "Tampines East CC",
    "Tanjong Pagar CC",
    "Teck Ghee CC",
    "Telok Blangah CC",
    "Toa Payoh Central CC",
    "Toa Payoh East CC",
    "Toa Payoh South CC",
    "Toa Payoh West CC",
    "Ulu Pandan CC",
    "West Coast CC",
    "Whampoa CC",
    "Woodlands CC",
    "Yew Tee CC",
    "Yio Chu Kang CC",
    "Yuhua CC",
    "Zhenghua CC"
];

let listOfCCs = listOfCCsStrings.map(cc => {
    return {
        label: cc,
        location: getLocationOfCC(cc)
    }
});

export default listOfCCs;