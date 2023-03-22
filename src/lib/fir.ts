type BuildTupleHelper<
	Element,
	Length extends number,
	Rest extends Element[],
> = Rest["length"] extends Length
	? [...Rest]
	: BuildTupleHelper<Element, Length, [Element, ...Rest]>
export type Tuple<Element, Length extends number> = number extends Length
	? Element[]
	: BuildTupleHelper<Element, Length, []>

export type Player = "black" | "white"
export type GridStatus = "none" | Player
export type Grid = {
	status: GridStatus
}
export type Board = Tuple<Tuple<Grid, 10>, 10>
export type GameResult = { winner: Player }
export type Game = { board: Board; turn: Player; result: GameResult | null }
export type Position = { x: number; y: number }
export namespace Position {
	export const create = (x: number, y: number): Position => ({ x, y })
}

export namespace Game {
	export const create = (): Game => ({
		board: Array.from({ length: 10 }, () =>
			Array.from({ length: 10 }, () => ({ status: "none" })),
		) as Board,
		turn: "black",
		result: null,
	})

	export const check = (game: Game): Player | null => {
		for (let y = 2; y < 8; y++) {
			for (let x = 2; x < 8; x++) {
				const grid = game.board[y][x]
				if (grid.status === "none") {
					continue
				}
				const player = grid.status as Player
				const horizontal = [
					game.board[y][x - 2],
					game.board[y][x - 1],
					game.board[y][x + 1],
					game.board[y][x + 2],
				]
				const vertical = [
					game.board[y - 2][x],
					game.board[y - 1][x],
					game.board[y + 1][x],
					game.board[y + 2][x],
				]
				const diagonalA = [
					game.board[y - 2][x - 2],
					game.board[y - 1][x - 1],
					game.board[y + 1][x + 1],
					game.board[y + 2][x + 2],
				]
				const diagonalB = [
					game.board[y + 2][x - 2],
					game.board[y + 1][x - 1],
					game.board[y - 1][x + 1],
					game.board[y - 2][x + 2],
				]
				const win = [vertical, horizontal, diagonalA, diagonalB].some(
					(list) => !list.some(($) => $.status !== player),
				)
				if (win) return player
			}
		}
		return null
	}

	export const alternate = (player: Player) => (player === "black" ? "white" : "black")

	export type PlayResult = {
		error: boolean
		game: Game
	}

	export const play = (game$: Game, position: Position): PlayResult => {
		let game = structuredClone(game$) as Game

		if (game.board[position.y][position.x].status !== "none") return { error: true, game }

		game.board[position.y][position.x].status = game.turn
		game.turn = alternate(game.turn)

		const winner = check(game)
		if (winner) {
			game.result = { winner }
		}

		return {
			error: false,
			game,
		}
	}
}
