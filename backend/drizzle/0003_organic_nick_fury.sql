ALTER TABLE `schedules` MODIFY COLUMN `notary_id` int;--> statement-breakpoint
ALTER TABLE `schedules` MODIFY COLUMN `secondary_notary_id` int;--> statement-breakpoint
ALTER TABLE `schedules` ADD `notary_name` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `schedules` ADD `secondary_notary_name` varchar(255) NOT NULL;