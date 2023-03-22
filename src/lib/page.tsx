import { createSignal } from "solid-js"
import { Board } from "./Board"
import { Game } from "./fir"

export const ExamplePage = () => {
	const [game, setGame] = createSignal(Game.create())
	return <Board game={game()} setGame={setGame} />
}
