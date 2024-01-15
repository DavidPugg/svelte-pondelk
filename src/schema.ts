import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable(
	'users',
	{
		id: integer('id').primaryKey(),
		username: text('username').notNull(),
		email: text('email').notNull(),
		createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
	},
	(table) => ({
		usernameIdx: uniqueIndex('username_idx').on(table.username),
		emailIdx: uniqueIndex('email_idx').on(table.email)
	})
);

export const groups = sqliteTable(
	'groups',
	{
		id: integer('id').primaryKey(),
		name: text('name').notNull(),
		description: text('description').notNull(),
		authorId: integer('author_id').references(() => users.id),
		createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
	},
	(table) => ({
		nameIdx: uniqueIndex('groups_name_idx').on(table.name)
	})
);

export const events = sqliteTable(
	'events',
	{
		id: integer('id').primaryKey(),
		name: text('name').notNull(),
		location: text('location').notNull(),
		authorId: integer('author_id').references(() => users.id),
		groupId: integer('group_id')
			.references(() => groups.id)
			.notNull(),
		createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
	},
	(table) => ({
		nameIdx: uniqueIndex('events_name_idx').on(table.name)
	})
);

export const memberships = sqliteTable(
	'memberships',
	{
		id: integer('id').primaryKey(),
		userId: integer('user_id')
			.references(() => users.id)
			.notNull(),
		groupId: integer('group_id')
			.references(() => groups.id)
			.notNull(),
		pending: integer('pending', { mode: 'boolean' }).notNull(),
		createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
	},
	(table) => ({
		userGroupIdx: uniqueIndex('user_group_idx').on(table.userId, table.groupId)
	})
);

export const participations = sqliteTable(
	'participations',
	{
		id: integer('id').primaryKey(),
		userId: integer('user_id').references(() => users.id),
		eventId: integer('event_id').references(() => events.id),
		verified: integer('verified', { mode: 'boolean' }).notNull(),
		createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
	},
	(table) => ({
		userEventIdx: uniqueIndex('user_event_idx').on(table.userId, table.eventId)
	})
);
