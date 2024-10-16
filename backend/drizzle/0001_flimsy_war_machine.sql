CREATE TABLE `courts`
(
  `id`        int AUTO_INCREMENT NOT NULL,
  `name`      varchar(255) NOT NULL,
  `attribute` varchar(255) NOT NULL,
  CONSTRAINT `courts_id` PRIMARY KEY (`id`)
);
--> statement-breakpoint
CREATE TABLE `districts`
(
  `id`       int AUTO_INCREMENT NOT NULL,
  `name`     varchar(255) NOT NULL,
  `court_id` int          NOT NULL,
  CONSTRAINT `districts_id` PRIMARY KEY (`id`)
);
--> statement-breakpoint
CREATE TABLE `files`
(
  `id`            int AUTO_INCREMENT NOT NULL,
  `path`          varchar(255) NOT NULL,
  `timestamp`     timestamp    NOT NULL DEFAULT (now()),
  `user_id`       int,
  `alias`         varchar(255) NOT NULL,
  `proceeding_id` int,
  CONSTRAINT `files_id` PRIMARY KEY (`id`)
);
--> statement-breakpoint
CREATE TABLE `meetings`
(
  `id`              int AUTO_INCREMENT NOT NULL,
  `title`           varchar(255) NOT NULL,
  `description`     varchar(255) NOT NULL,
  `type`            enum('online','in_person') NOT NULL,
  `start_date_time` datetime     NOT NULL,
  `user_id`         int,
  `proceeding_id`   int,
  CONSTRAINT `meetings_id` PRIMARY KEY (`id`)
);
--> statement-breakpoint
CREATE TABLE `messages`
(
  `id`            int AUTO_INCREMENT NOT NULL,
  `user_id`       int,
  `proceeding_id` int,
  `text`          varchar(1024) NOT NULL,
  `timestamp`     timestamp     NOT NULL DEFAULT (now()),
  CONSTRAINT `messages_id` PRIMARY KEY (`id`)
);
--> statement-breakpoint
CREATE TABLE `participants`
(
  `id`            int AUTO_INCREMENT NOT NULL,
  `user_id`       int NOT NULL,
  `proceeding_id` int NOT NULL,
  CONSTRAINT `participants_id` PRIMARY KEY (`id`)
);
--> statement-breakpoint
CREATE TABLE `phases`
(
  `id`          int AUTO_INCREMENT NOT NULL,
  `title`       varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  CONSTRAINT `phases_id` PRIMARY KEY (`id`)
);
--> statement-breakpoint
CREATE TABLE `proceedings`
(
  `id`         int AUTO_INCREMENT NOT NULL,
  `phase_id`   int  NOT NULL,
  `start_date` date NOT NULL,
  `notary_id`  int,
  CONSTRAINT `proceedings_id` PRIMARY KEY (`id`)
);
--> statement-breakpoint
CREATE TABLE `roles`
(
  `id`   int AUTO_INCREMENT NOT NULL,
  `name` varchar(255) NOT NULL,
  CONSTRAINT `roles_id` PRIMARY KEY (`id`)
);
--> statement-breakpoint
CREATE TABLE `schedules`
(
  `id`                  int AUTO_INCREMENT NOT NULL,
  `notary_id`           int          NOT NULL,
  `secondary_notary_id` int          NOT NULL,
  `court_id`            int          NOT NULL,
  `pattern`             varchar(255) NOT NULL,
  CONSTRAINT `schedules_id` PRIMARY KEY (`id`)
);
--> statement-breakpoint
CREATE TABLE `task_states`
(
  `id`    int AUTO_INCREMENT NOT NULL,
  `title` varchar(255) NOT NULL,
  CONSTRAINT `task_states_id` PRIMARY KEY (`id`)
);
--> statement-breakpoint
CREATE TABLE `tasks`
(
  `id`            int AUTO_INCREMENT NOT NULL,
  `title`         varchar(255) NOT NULL,
  `task_state_id` int,
  `file_id`       int,
  `text_answer`   varchar(1024),
  `proceeding_id` int,
  CONSTRAINT `tasks_id` PRIMARY KEY (`id`)
);
--> statement-breakpoint
CREATE TABLE `users`
(
  `id`           int AUTO_INCREMENT NOT NULL,
  `role_id`      int          NOT NULL,
  `before_title` varchar(255),
  `firstname`    varchar(255) NOT NULL,
  `lastname`     varchar(255) NOT NULL,
  `after_title`  varchar(255),
  `email`        varchar(255) NOT NULL,
  `password`     varchar(255) NOT NULL,
  CONSTRAINT `users_id` PRIMARY KEY (`id`)
);
--> statement-breakpoint
CREATE TABLE `verification_tokens`
(
  `id`         int AUTO_INCREMENT NOT NULL,
  `user_id`    int          NOT NULL,
  `token`      varchar(255) NOT NULL,
  `expires_at` varchar(255) NOT NULL,
  `reason`     enum('register','password_reset','email_change') NOT NULL,
  CONSTRAINT `verification_tokens_id` PRIMARY KEY (`id`)
);
--> statement-breakpoint
DROP TABLE `user`;--> statement-breakpoint
ALTER TABLE `districts`
  ADD CONSTRAINT `districts_court_id_courts_id_fk` FOREIGN KEY (`court_id`) REFERENCES `courts` (`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `files`
  ADD CONSTRAINT `files_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `files`
  ADD CONSTRAINT `files_proceeding_id_proceedings_id_fk` FOREIGN KEY (`proceeding_id`) REFERENCES `proceedings` (`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `meetings`
  ADD CONSTRAINT `meetings_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `meetings`
  ADD CONSTRAINT `meetings_proceeding_id_proceedings_id_fk` FOREIGN KEY (`proceeding_id`) REFERENCES `proceedings` (`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_proceeding_id_proceedings_id_fk` FOREIGN KEY (`proceeding_id`) REFERENCES `proceedings` (`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `participants`
  ADD CONSTRAINT `participants_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `participants`
  ADD CONSTRAINT `participants_proceeding_id_proceedings_id_fk` FOREIGN KEY (`proceeding_id`) REFERENCES `proceedings` (`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `proceedings`
  ADD CONSTRAINT `proceedings_phase_id_phases_id_fk` FOREIGN KEY (`phase_id`) REFERENCES `phases` (`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `proceedings`
  ADD CONSTRAINT `proceedings_notary_id_users_id_fk` FOREIGN KEY (`notary_id`) REFERENCES `users` (`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `schedules`
  ADD CONSTRAINT `schedules_notary_id_users_id_fk` FOREIGN KEY (`notary_id`) REFERENCES `users` (`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `schedules`
  ADD CONSTRAINT `schedules_secondary_notary_id_users_id_fk` FOREIGN KEY (`secondary_notary_id`) REFERENCES `users` (`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `schedules`
  ADD CONSTRAINT `schedules_court_id_courts_id_fk` FOREIGN KEY (`court_id`) REFERENCES `courts` (`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_task_state_id_task_states_id_fk` FOREIGN KEY (`task_state_id`) REFERENCES `task_states` (`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_file_id_files_id_fk` FOREIGN KEY (`file_id`) REFERENCES `files` (`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_proceeding_id_proceedings_id_fk` FOREIGN KEY (`proceeding_id`) REFERENCES `proceedings` (`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `users`
  ADD CONSTRAINT `users_role_id_roles_id_fk` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `verification_tokens`
  ADD CONSTRAINT `verification_tokens_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE no action ON UPDATE no action;
