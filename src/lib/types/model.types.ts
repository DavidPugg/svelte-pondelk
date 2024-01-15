export type User = {
	id: string;
	username: string;
	avatar: string;
	email: string;
	createdAt: Date;
};

export type Group = {
	id: string;
	name: string;
	description: string;
	author: User;
	createdAt: Date;
	joined: boolean;
	members: number;
};

export type Event = {
	id: string;
	name: string;
	location: string;
	author: User;
	group: Group;
	createdAt: Date;
};

export type Membership = {
	id: string;
	user: User;
	group: Group;
	pending: boolean;
	createdAt: Date;
};

export type Participation = {
	id: string;
	user: User;
	event: Event;
	verified: boolean;
	createdAt: Date;
};
