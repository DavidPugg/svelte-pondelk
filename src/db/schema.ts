import { relations, sql } from 'drizzle-orm';
import { boolean, integer, pgTable, serial, text, timestamp, unique } from 'drizzle-orm/pg-core';

export const users = pgTable(
	'users',
	{
		id: serial('id').primaryKey(),
		sub: text('sub').notNull(),
		authType: text('auth_type').notNull(),
		username: text('username').notNull(),
		email: text('email').notNull(),
		picture: text('picture'),
		createdAt: timestamp('created_at')
			.notNull()
			.default(sql`now()`)
	},
	(table) => ({
		usernameIdx: unique().on(table.username),
		emailIdx: unique().on(table.email)
	})
);

export const userRelations = relations(users, ({ many }) => ({
	groups: many(memberships),
	events: many(participations)
}));

export type NewUserDB = typeof users.$inferInsert;
export type UserDB = typeof users.$inferSelect;

// ----------------------- //

export const groups = pgTable(
	'groups',
	{
		id: serial('id').primaryKey(),
		name: text('name').notNull(),
		description: text('description').notNull(),
		authorId: integer('author_id').references(() => users.id),
		createdAt: timestamp('created_at')
			.notNull()
			.default(sql`now()`)
	},
	(table) => ({
		nameIdx: unique().on(table.name)
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

export const events = pgTable(
	'events',
	{
		id: serial('id').primaryKey(),
		name: text('name').notNull(),
		location: text('location').notNull(),
		authorId: integer('author_id').references(() => users.id),
		groupId: integer('group_id')
			.references(() => groups.id, { onDelete: 'cascade' })
			.notNull(),
		createdAt: timestamp('created_at')
			.notNull()
			.default(sql`now()`)
	},
	(table) => ({
		nameGroupIdx: unique().on(table.name, table.groupId)
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

// ----------------------- //`

export const memberships = pgTable(
	'memberships',
	{
		id: serial('id').primaryKey(),
		userId: integer('user_id')
			.references(() => users.id, { onDelete: 'cascade' })
			.notNull(),
		groupId: integer('group_id')
			.references(() => groups.id, { onDelete: 'cascade' })
			.notNull(),
		pending: boolean('pending').notNull(),
		invitedBy: integer('invited_by').references(() => users.id),
		createdAt: timestamp('created_at')
			.notNull()
			.default(sql`now()`)
	},
	(table) => ({
		userGroupIdx: unique().on(table.userId, table.groupId)
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

export const participations = pgTable(
	'participations',
	{
		id: serial('id').primaryKey(),
		userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
		eventId: integer('event_id').references(() => events.id, { onDelete: 'cascade' }),
		verified: boolean('verified').notNull(),
		createdAt: timestamp('created_at')
			.notNull()
			.default(sql`now()`)
	},
	(table) => ({
		userEventIdx: unique().on(table.userId, table.eventId)
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
