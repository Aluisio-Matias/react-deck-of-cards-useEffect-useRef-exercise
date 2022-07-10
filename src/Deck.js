import { useState, useEffect, useRef } from "react";
import Card from "./Card";
import axios from "axios";
import './Deck.css';

const BASE_URL = "http://deckofcardsapi.com/api/deck";

const Deck = () => {
    const [deck, setDeck] = useState(null);
    const [drawn, setDrawn] = useState([]);
    const [autoDraw, setAutoDraw] = useState(false);
    const timerRef = useRef(null);

    /*load the deck of cards*/
    useEffect(() => {
        const getData = async () => {
            let { data } = await axios.get(`${BASE_URL}/new/shuffle`);
            setDeck(data);
        }
        getData();
    }, [setDeck]);

    /* Draw one card every second if autoDraw is true */
    useEffect(() => {
        const getCard = async () => {
            let { deck_id } = deck;

            try {
                let drawRes = await axios.get(`${BASE_URL}/${deck_id}/draw`);

                if (drawRes.data.remaining === 0) {
                    setAutoDraw(false);
                    throw new Error("Error: no cards remaining!");
                }

                const card = drawRes.data.cards[0];

                setDrawn(d => [
                    ...d,
                    {
                        id: card.code,
                        name: card.suit + " " + card.value,
                        image: card.image
                    }
                ]);
            } catch (error) {
                alert(error);
            }
        }

        if (autoDraw && !timerRef.current) {
            timerRef.current = setInterval(async () => {
                await getCard();
            }, 1000);
        }

        return () => {
            clearInterval(timerRef.current);
            timerRef.current = null;
        };
    }, [autoDraw, setAutoDraw, deck]);

    const toggleAutoDraw = () => {
        setAutoDraw(auto => !auto);
    };

    const cards = drawn.map(c => (
        <Card key={c.id} name={c.name} image={c.image} />
    ));

    return (
        <div className="Deck">
            <h1>React Deck of Cards API</h1>
            {deck ? (
                <button className="Draw-button" onClick={toggleAutoDraw}>
                    {autoDraw ? "STOP" : "KEEP"} AUTO DRAWING!
                </button>
            ) : null}

            <div className="Deck-cardarea">{cards}</div>


        </div>
    );
}

export default Deck;





/*Part 1 - Click to draw */
// import { useState, useEffect } from "react";
// import Card from "./Card";
// import axios from "axios";
// import './Deck.css';

// const BASE_URL = "http://deckofcardsapi.com/api/deck";

// const Deck = () => {
//     const [deck, setDeck] = useState(null);
//     const [drawn, setDrawn] = useState([]);

//     /*load the deck of cards*/
//     useEffect(() => {
//         const getData = async () => {
//             let { data } = await axios.get(`${BASE_URL}/new/shuffle`);
//             setDeck(data);
//         }
//         getData();
//     }, [setDeck]);

//     /*draw cards*/
//     useEffect(() => {
//         async function getCard() {
//             let { deck_id } = deck;

//             try {
//                 let drawRes = await axios.get(`${BASE_URL}/${deck_id}/draw`);

//                 if (drawRes.data.remaining === 0) {
//                     throw new Error("Error: no cards remaining!");
//                 }

//                 const card = drawRes.data.cards[0];

//                 setDrawn(d => [
//                     ...d,
//                     {
//                         id: card.code,
//                         name: card.suit + " " + card.value,
//                         image: card.image
//                     }
//                 ]);
//             } catch (error) {
//                 alert(error);
//             }
//         }

//         getCard();
//     }, [deck, drawn, setDrawn]);

//     const cards = drawn.map(c => (
//         <Card key={c.id} name={c.name} image={c.image} />
//     ));

//     function toggleDraw() {
//         setDrawn(cards);
//     }

//     return (
//         <div className="Deck">
//             <h1>React Deck of Cards API</h1>
//             <button className="Draw-button" onClick={toggleDraw}>Draw cards!</button>
//             <div className="Deck-cardarea">{cards}</div>
//         </div>
//     );
// }

// export default Deck;