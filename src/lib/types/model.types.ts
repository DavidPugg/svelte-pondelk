import type { EventDB, GroupDB, MembershipDB, ParticipationDB, UserDB } from '../../db/schema';

export type User = UserDB;

export type Group = GroupDB & {
	author?: User;
	joined?: boolean;
	members?: number;
};

export type Event = EventDB & {
	author?: User;
	group?: Group;
};

export type Membership = MembershipDB & {
	user?: User;
	group?: Group;
};

export type Participation = ParticipationDB & {
	user?: User;
	event?: Event;
};
