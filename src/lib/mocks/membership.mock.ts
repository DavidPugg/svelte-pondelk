import type { Membership } from '$lib/types/model.types';
import { mockGroup, mockGroup2 } from './group.mock';
import { mockUser, mockUser2 } from './user.mock';

export const mockMembership: Membership = {
	id: 1,
	userId: mockUser.id,
	groupId: mockGroup.id,
	invitedBy: mockUser.id,
	pending: false,
	createdAt: new Date(),
	user: mockUser,
	group: mockGroup
};

export const mockMembership2: Membership = {
	id: 2,
	userId: mockUser2.id,
	groupId: mockGroup2.id,
	invitedBy: mockUser2.id,
	pending: true,
	createdAt: new Date(),
	user: mockUser2,
	group: mockGroup2
};

export const mockMemberships = [mockMembership, mockMembership2];
