import type { Event } from '$lib/types/model.types';
import { mockGroup, mockGroup2 } from './group.mock';
import { mockUser, mockUser2 } from './user.mock';

export const mockEvent: Event = {
	id: 1,
	name: 'Test Event',
	location: 'Test Location',
	authorId: mockUser.id,
	groupId: mockGroup.id,
	author: mockUser,
	group: mockGroup,
	createdAt: new Date()
};

export const mockEvent2: Event = {
	id: 2,
	name: 'Test Event 2',
	location: 'Test Location 2',
	authorId: mockUser2.id,
	groupId: mockGroup2.id,
	author: mockUser2,
	group: mockGroup2,
	createdAt: new Date()
};

export const mockEvents: Event[] = [mockEvent, mockEvent2];
