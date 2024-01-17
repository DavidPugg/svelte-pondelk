import type { Participation } from '$lib/types/model.types';
import { mockEvent, mockEvent2 } from './event.mock';
import { mockUser, mockUser2 } from './user.mock';

export const mockParticipation: Participation = {
	id: 1,
	userId: mockUser.id,
	eventId: mockEvent.id,
	user: mockUser,
	event: mockEvent,
	verified: false,
	createdAt: new Date()
};

export const mockParticipation2: Participation = {
	id: 2,
	userId: mockUser2.id,
	eventId: mockEvent2.id,
	user: mockUser2,
	event: mockEvent2,
	verified: true,
	createdAt: new Date()
};

export const mockParticipations = [mockParticipation, mockParticipation2];
