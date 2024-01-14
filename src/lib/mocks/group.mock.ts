import type { Group } from '$lib/types/model.types';
import { mockUser, mockUser2 } from './user.mock';

export const mockGroup: Group = {
	id: '1',
	name: 'Test Group',
	author: mockUser,
	joined: true,
	members: 3,
	createdAt: new Date(new Date().setDate(new Date().getDate() - 1))
};

export const mockGroup2: Group = {
	id: '2',
	name: 'Test Group 2',
	author: mockUser2,
	joined: false,
	members: 78,
	createdAt: new Date(new Date().setDate(new Date().getDate() - 123))
};

export const mockGroups: Group[] = [mockGroup, mockGroup2];
