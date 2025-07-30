CREATE UNIQUE INDEX `unique_game_player` ON `game_players` (`game_id`,`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `unique_game_symbol` ON `game_players` (`game_id`,`symbol`);