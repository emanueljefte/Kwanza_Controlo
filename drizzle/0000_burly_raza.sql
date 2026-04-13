CREATE TABLE `notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`body` text NOT NULL,
	`frequency` integer NOT NULL,
	`schedule_date` text NOT NULL,
	`schedule_time` text NOT NULL,
	`enabled` integer DEFAULT true NOT NULL,
	`marked_to_delete` integer DEFAULT false,
	`user` text,
	FOREIGN KEY (`user`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text,
	`amount` real,
	`category` text,
	`description` text,
	`image` text,
	`date` text,
	`uid` text,
	`walletId` integer,
	`is_dirty` integer DEFAULT 0,
	`marked_to_delete` integer DEFAULT 0,
	FOREIGN KEY (`uid`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`walletId`) REFERENCES `wallets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`email` text,
	`password` text,
	`image` text,
	`is_dirty` integer DEFAULT 0,
	`created_at` text DEFAULT '2026-03-05T02:18:07.802Z',
	`updated_at` text DEFAULT '2026-03-05T02:18:07.803Z',
	`last_login` text DEFAULT '2026-03-05T02:18:07.803Z'
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `wallets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`amount` real,
	`totalIncome` real,
	`totalExpenses` real,
	`image` text,
	`created` text,
	`is_dirty` integer DEFAULT 0,
	`marked_to_delete` integer DEFAULT 0,
	`user` text,
	FOREIGN KEY (`user`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
