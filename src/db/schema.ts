import { relations } from 'drizzle-orm';
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

export const userRelations = relations(users, ({ many }) => ({
	groups: many(memberships),
	events: many(participations)
}));

export type NewUserDB = typeof users.$inferInsert;
export type UserDB = typeof users.$inferSelect;

// ----------------------- //

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

export const groupRelations = relations(groups, ({ one, many }) => ({
	author: one(users, {
		fields: [groups.authorId],
		references: [users.id]
	}),
	members: many(memberships),
	events: many(events)
}));

export type NewGroupDB = typeof groups.$inferInsert;
export type GroupDB = typeof groups.$inferSelect;

// ----------------------- //

export const events = sqliteTable(
	'events',
	{
		id: integer('id').primaryKey(),
		name: text('name').notNull(),
		location: text('location').notNull(),
		authorId: integer('author_id').references(() => users.id),
		groupId: integer('group_id')
			.references(() => groups.id, { onDelete: 'cascade' })
			.notNull(),
		createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
	},
	(table) => ({
		nameIdx: uniqueIndex('events_name_idx').on(table.name)
	})
);

export const eventRelations = relations(events, ({ one, many }) => ({
	author: one(users, {
		fields: [events.authorId],
		references: [users.id]
	}),
	group: one(groups, {
		fields: [events.groupId],
		references: [groups.id]
	}),
	participations: many(participations)
}));

export type NewEventDB = typeof events.$inferInsert;
export type EventDB = typeof events.$inferSelect;

// ----------------------- //

export const memberships = sqliteTable(
	'memberships',
	{
		id: integer('id').primaryKey(),
		userId: integer('user_id')
			.references(() => users.id, { onDelete: 'cascade' })
			.notNull(),
		groupId: integer('group_id')
			.references(() => groups.id, { onDelete: 'cascade' })
			.notNull(),
		pending: integer('pending', { mode: 'boolean' }).notNull(),
		createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
	},
	(table) => ({
		userGroupIdx: uniqueIndex('user_group_idx').on(table.userId, table.groupId)
	})
);

export const membershipRelations = relations(memberships, ({ one }) => ({
	user: one(users, {
		fields: [memberships.userId],
		references: [users.id]
	}),
	group: one(groups, {
		fields: [memberships.groupId],
		references: [groups.id]
	})
}));

export type NewMembershipDB = typeof memberships.$inferInsert;
export type MembershipDB = typeof memberships.$inferSelect;

// ----------------------- //

export const participations = sqliteTable(
	'participations',
	{
		id: integer('id').primaryKey(),
		userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
		eventId: integer('event_id').references(() => events.id, { onDelete: 'cascade' }),
		verified: integer('verified', { mode: 'boolean' }).notNull(),
		createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
	},
	(table) => ({
		userEventIdx: uniqueIndex('user_event_idx').on(table.userId, table.eventId)
	})
);

export const participationRelations = relations(participations, ({ one }) => ({
	user: one(users, {
		fields: [participations.userId],
		references: [users.id]
	}),
	event: one(events, {
		fields: [participations.eventId],
		references: [events.id]
	})
}));

export type NewParticipationDB = typeof participations.$inferInsert;
export type ParticipationDB = typeof participations.$inferSelect;

// ----------------------- //
