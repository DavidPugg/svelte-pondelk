import { mockEvent, mockEvent2 } from './event.mock';
import { mockUser, mockUser2 } from './user.mock';

export const mockParticipation = {
	id: '1',
	user: mockUser,
	event: mockEvent,
	verified: false,
	createdAt: new Date()
};

export const mockParticipation2 = {
	id: '2',
	user: mockUser2,
	event: mockEvent2,
	verified: true,
	createdAt: new Date()
};

export const mockParticipations = [mockParticipation, mockParticipation2];
