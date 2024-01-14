import { mockGroup, mockGroup2 } from './group.mock';
import { mockUser, mockUser2 } from './user.mock';

export const mockMembership = {
	id: '1',
	user: mockUser,
	group: mockGroup,
	pending: false,
	createdAt: new Date()
};

export const mockMembership2 = {
	id: '2',
	user: mockUser2,
	group: mockGroup2,
	pending: true,
	createdAt: new Date()
};

export const mockMemberships = [mockMembership, mockMembership2];
