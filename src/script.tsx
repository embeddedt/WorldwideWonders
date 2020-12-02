import { LatLngTuple } from "leaflet";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import classnames from 'classnames';

interface UnknownLandmark  { name: string; src: string; }
interface Question {
    countryName: string;
    description: string;
    location: LatLngTuple;
    famousLandmark: string;
    unknownLandmark: UnknownLandmark;
    zoom?: number;
}

const landmarkQuestions: Question[] = [
    {
        countryName: "Australia",
        description: `Australia is the sixth biggest country in the world by land area. 25 million people live in Australia, and about 85% of them live near the east coast. Australia is known for its mining (coal, iron, gold, diamonds and crystals), its production of wool, and as the world's largest producer of bauxite.`,
        location: [-25.3456376,131.0283911],
        famousLandmark: "sydney_opera_house.jpg",
        unknownLandmark: { name: 'Uluru', src: 'uluru.jpg' }
    },
    {
        countryName: "Namibia",
        description: `Namibia is a country in southern Africa on the Atlantic coast and has a population of 2.1 million people. The name of the country is from the Namib Desert. This is said to be the oldest desert in the world.`,
        location: [-19.5925574,17.9314899],
        famousLandmark: "namibia.jpg",
        unknownLandmark: { name: 'Hoba', src: 'hoba.jpg' }
    },
    {
        countryName: "Kansas",
        description: `Kansas is a state in the United States. It is known for the Dust Bowl, a period of time from 1930 to 1936 where there was little rainfall and high temperatures. Kansas has also been popularized by the line, "We're not in Kansas anymore" spoken by Dorothy in the Wizard of Oz.`,
        location: [38.7267878,-98.032701],
        famousLandmark: 'wizardofoz.jpg',
        unknownLandmark: { name: 'Mushroom Rock', src: 'mushroomrock.jpg' },
    },
    {
        countryName: 'Easter Island',
        description: 'Easter Island is an island and special territory of Chile in the southeastern Pacific Ocean. It is one of the most remote inhabited islands in the world.',
        location: [-27.1258992,-109.3738341],
        famousLandmark: null,
        zoom: 9,
        unknownLandmark: { name: 'Moai', src: 'moai.jpg' }
    },
    {
        countryName: 'Alabama',
        description: 'Alabama is a state in the United States, unique in that it has the largest number of inland waterways.',
        famousLandmark: null,
        unknownLandmark: { name: 'Boll Weevil Monument', src: 'boilweevil.jpg' },
        location: [31.3144572,-85.8562]
    },
    {
        countryName: 'Wiltshire',
        description: 'Wiltshire is a county in South West England with an area of 3,485 km2 (1,346 square miles). Wiltshire is characterised by its high downland and wide valleys.',
        location: [51.1788853,-1.8284037],
        famousLandmark: 'bigben.jpg',
        unknownLandmark: { name: 'Stonehenge', src: 'stonehenge.jpg' },
    },
    {
        countryName: 'New York',
        description: "New York is one of the busiest and the fourth most populated state in the U.S. It is known for having the world's largest subway network and the U.S.'s largest city.",
        location: [40.4378332,-69.7609606],
        famousLandmark: 'newyorksubway.jpg',
        unknownLandmark: { name: 'Hess triangle', src: 'hesstriangle.jpg' },
    },
    {
        countryName: 'France',
        description: "Paris, France is known largely for the famous Eiffel Tower constructed by Gustav Eiffel, but that's not the only interesting structure there.",
        location: [48.893551,2.2365426],
        famousLandmark: 'eiffel.jpg',
        unknownLandmark: { name: 'Le Pouce', src: 'lepouce.jpg' }
    },
    {
        countryName: 'Turkmenistan',
        description: "Turkmenistan is a small country in Asia. It is slightly smaller than Spain and somewhat larger than the US state of California. Over 80% of the country is covered by the Karakum Desert.",
        location: [40.2526072,58.4375117],
        famousLandmark: null,
        unknownLandmark: { name: 'Darvaza Gas Crater', src: 'doortohell.jpg' }
    },
    {
        countryName: 'Uzbekistan',
        description: "Uzbekistan is a small country in Central Asia.",
        location: [43.7709823,59.0058087],
        famousLandmark: null,
        unknownLandmark: { name: 'The Ships of Moynaq', src: 'moynaq.jpg' },
    },
    {
        countryName: "California",
        description: "California is a state in the U.S. known for its strong agricultural, movie-making, and technological businesses. Throughout history, California has experienced many droughts, As the most populous state in the United States and a major agricultural producer, drought in California can have a severe economic as well as environmental impact. Drought may be due solely to, or found in combination with, weather conditions; economic or political actions; or population and farming.",
        famousLandmark: 'goldengate.jpg',
        unknownLandmark: { name: 'Glass Beach', src: 'glassbeach.jpg' },
        location: [39.4526132,-123.8156819]
    },
    {
        countryName: "Brazil",
        description: "Brazil is a country in South America. It is the world's fifth largest country. The country has about 209 million people. Brazil was named after brazilwood, which is a tree that once grew very well along the Brazilian coast.",
        famousLandmark: 'christ.jpg',
        unknownLandmark: { name: 'Sugarloaf Mountain', src: 'sugarloaf.jpg' },
        location: [-22.9492383,-43.1633305]
    },
    {
        countryName: "Utah",
        description: "Utah is known for its natural diversity and is home to features ranging from arid deserts with sand dunes to thriving pine forests in mountain valleys. It is a rugged and geographically diverse state at the convergence of three distinct geological regions: the Rocky Mountains, the Great Basin, and the Colorado Plateau.",
        famousLandmark: null,
        unknownLandmark: { name: 'Arches National Park', src: 'arches.jpg' },
        location: [38.7320195,-109.7257248]
    },
    {
        countryName: "Wyoming",
        description: "Wyoming is a landlocked state in the western United States. The 10th largest state by area, it is also the least populous and second most sparsely populated state in the country. The state capital and the most populous city is Cheyenne, which had an estimated population of 63,957 in 2018.",
        famousLandmark: 'oldfaithful.jpg',
        unknownLandmark: { name: 'Devils Tower', src: 'devilstower.jpg' },
        location: [44.5877457,-104.6963864]
    },
    {
        countryName: "Northern Ireland",
        description: "Northern Ireland is variously described as a country, province, or region, which is part of the United Kingdom. Located in the northeast of the island of Ireland, Northern Ireland shares a border to the south and west with the Republic of Ireland.",
        famousLandmark: 'irelandropebridge.jpg',
        unknownLandmark: { name: "Giants' Causeway", src: 'causeway.jpg' },
        location: [55.2406446,-6.5140728]
    },
    {
        countryName: "China",
        description: "China, a country in East Asia, is the world's most populous country, with a population of around 1.4 billion in 2019. China has been characterized as an emerging superpower, mainly because of its economy, fast infrastructural development, and military.",
        unknownLandmark: { name: 'Stone Forest', src: 'stoneforest.jpeg' },
        famousLandmark: null,
        location: [48.4341994,129.4309113]
    },
    {
        countryName: "Arizona",
        description: "Arizona is a state in the United States of America. Its climate can be very hot. In Phoenix, the average temperature is about 107 degrees Fahrenheit (42 degrees Celsius) in summer.",
        famousLandmark: 'grandcanyon.jpeg',
        unknownLandmark: { name: 'Monument Valley', src: 'monumentvalley.jpg' },
        location: [36.9980328,-110.1006461]
    },
    {
        countryName: "Peru",
        description: "Peru is a country in South America. Throughout the 20th century, Peru endured armed territorial disputes, coups, social unrest, and internal conflicts, as well as periods of stability and economic upswing. Alberto Fujimori was elected to the presidency in 1990; his government was credited with economically stabilizing Peru and successfully ending the Shining Path insurgency, though he was widely accused of human rights violations and suppression of political dissent.",
        famousLandmark: null,
        unknownLandmark: { name: 'Machu Picchu', src: 'picchu.jpg' },
        location: [-13.163136,-72.5471516]
    },
    {
        countryName: "Canada",
        description: "Canada is a country in the northern part of North America. Its ten provinces and three territories extend from the Atlantic to the Pacific and northward into the Arctic Ocean, covering 9.98 million square kilometres (3.85 million square miles), making it the world's second-largest country by total area. Its southern and western border with the United States, stretching 8,891 kilometres (5,525 mi), is the world's longest bi-national land border.",
        famousLandmark: 'cntower.jpg',
        unknownLandmark: { name: 'West Edmonton Mall', src: 'edmontonmall.jpg' },
        location: [53.5239662,-113.626365]
    },
    {
        countryName: "Dover",
        description: "Dover is a town and major ferry port in Kent, South East England. It faces France across the Strait of Dover, the narrowest part of the English Channel at 33 kilometres (21 mi) from Cap Gris Nez in France.",
        famousLandmark: 'doverstreet.jpeg',
        unknownLandmark: { name: 'White Cliffs', src: 'whitecliffs.jpg' },
        location: [51.1200879,1.2713195]
    }
];

/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

console.log("There are", landmarkQuestions.length, "questions");
shuffle(landmarkQuestions);

function ChangeView({ center, zoom }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
}

window.onload = function () {
    function LandmarkMap(props) {
        return (
            <MapContainer attributionControl={false} scrollWheelZoom={false} doubleClickZoom={false} zoomControl={false} dragging={false}>
                <ChangeView center={props.position} zoom={props.zoom}/>
                <TileLayer
                    attribution={null}
                    url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                />
                <Marker interactive={false} position={props.position}>
                </Marker>
            </MapContainer>
        );
    }

    function LandmarkQuestionChoice(props: { onClick?: (isCorrect: boolean) => void; interactable?: boolean; isCorrect?: boolean; label: string; src: string; }) {
        const interactable = typeof props.interactable != 'undefined' ? props.interactable : true;
        const onClick = () => {
            if(typeof props.onClick == 'function') {
                props.onClick(typeof props.isCorrect != 'undefined' && props.isCorrect);
            }
        };
        return <div className={classnames("landmark-choice", !interactable && "landmark-choice-nointeract")}>
            <img src={'pictures/' + props.src} onClick={onClick}/>
            <span className="landmark-choice-label">{props.label}</span>
        </div>;
    }

    function LandmarkQuestion(props: { nextQuestion: (landmark?: UnknownLandmark) => void; questionIndex: number; }) {
        const question = landmarkQuestions[props.questionIndex];
        const [ hasBeenWrong, setHasBeenWrong ] = useState(false);
        const [ right, setRight ] = useState<UnknownLandmark>(null);
        const onClickChoice = (isCorrect) => {
            if(isCorrect)
                setRight(question.unknownLandmark);
            else {
                setHasBeenWrong(true);
                
            }
        };
        const choices = useMemo(() => {
            const choices: (UnknownLandmark&{isCorrect?: boolean;})[] = [];
            choices.push(Object.assign({}, question.unknownLandmark, { isCorrect: true }));
            const unknownLandmarks = shuffle(landmarkQuestions.reduce((prev, cur, index) => {
                if(index != props.questionIndex) {
                    prev.push(cur.unknownLandmark);
                }
                return prev;
            }, [] as UnknownLandmark[]));
            for(var i = 0; i < Math.min(3, unknownLandmarks.length); i++) {
                choices.push(unknownLandmarks[i]);
            }
            shuffle(choices);
            return choices.map(choice => <LandmarkQuestionChoice onClick={onClickChoice} isCorrect={choice.isCorrect} key={choice.name} src={choice.src} label={choice.name}/>);
        }, [ question ]);
        useEffect(() => {
            if(hasBeenWrong)
                setHasBeenWrong(false);
            setRight(null);
        }, [ props.questionIndex ]);
        useEffect(() => {
            if(right != null) {
                setTimeout(() => {
                    props.nextQuestion(hasBeenWrong ? null : right);
                }, 2000);
            }
        }, [ right ]);
        const text = right ? "That's right!" : (hasBeenWrong ? 'Nope.' : 'Which of these landmarks belongs to this country?');
        const color = right ? 'green' : (hasBeenWrong ? 'red' : 'black');
        return <>
            <div className="landmark-question-header">
                <div className="landmark-question-images">
                    <LandmarkMap position={question.location} zoom={typeof question.zoom != 'undefined' ? question.zoom : 1}/>
                    {question.famousLandmark != null && <img className="landmark-image-famous" src={'pictures/' + question.famousLandmark}/>}
                </div>
                <p></p>
                <p className="landmark-description">{question.description}</p>
                <h1 style={{textAlign: 'center', color: color }}>{text}</h1>
            </div>
            {(right == null) && <div className="landmark-choices">
                {choices}
            </div>}
        </>;
    }
    function App() {
        const [ currentQuestionIndex, setCurrentQuestionIndex ] = useState(0);
        const rightFirstTime = useRef([] as UnknownLandmark[]);
        const nextQuestion = (landmark) => {
            if(landmark != null)
                rightFirstTime.current.push(landmark);
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        };
        if(currentQuestionIndex < landmarkQuestions.length)
            return <LandmarkQuestion nextQuestion={nextQuestion} questionIndex={currentQuestionIndex}/>;
        else
            return <>
                <h1 style={{textAlign: 'center' }}>Well done! Here's what you got right:</h1>
                <div>
                    {rightFirstTime.current.map(landmark => <LandmarkQuestionChoice key={landmark.name} interactable={false} label={landmark.name} src={landmark.src}/>)}
                </div>
                
            </>;
    }
    ReactDOM.render(<App />, document.getElementById("game-container"));
};
