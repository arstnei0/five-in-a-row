import { Component, createMemo, For } from "solid-js"
import { Game, Position } from "./fir"
import "./Board.sass"

export const Board: Component<{ game: Game; setGame: (game: Game) => void }> = (props) => {
	const game = createMemo(() => props.game)
	const { setGame } = props

	return (
		<>
			<div class="board">
				<For each={game().board}>
					{(row, y) => (
						<div class="row">
							<For each={row}>
								{(grid, x) => (
									<div
										class="grid"
										data-status={grid.status}
										onClick={() => {
											const result = Game.play(
												game(),
												Position.create(x(), y()),
											)
											setGame(result.game)
										}}
									></div>
								)}
							</For>
						</div>
					)}
				</For>
			</div>
		</>
	)
}
