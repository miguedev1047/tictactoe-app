DROP INDEX "session_token_unique";--> statement-breakpoint
DROP INDEX "user_email_unique";--> statement-breakpoint
DROP INDEX "unique_game_player";--> statement-breakpoint
DROP INDEX "unique_game_symbol";--> statement-breakpoint
ALTER TABLE `user` ALTER COLUMN "symbol" TO "symbol" text DEFAULT 'NONE';--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `unique_game_player` ON `game_players` (`game_id`,`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `unique_game_symbol` ON `game_players` (`game_id`,`symbol`);