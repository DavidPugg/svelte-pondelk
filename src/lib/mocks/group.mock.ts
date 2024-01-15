import type { Group } from '$lib/types/model.types';
import { mockUser, mockUser2 } from './user.mock';

export const mockGroup: Group = {
	id: '1',
	name: 'Test Group',
	description:
		'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum',
	author: mockUser,
	joined: true,
	members: 3,
	createdAt: new Date(new Date().setDate(new Date().getDate() - 1))
};

export const mockGroup2: Group = {
	id: '2',
	name: 'Test Group 2',
	description: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
	author: mockUser2,
	joined: false,
	members: 78,
	createdAt: new Date(new Date().setDate(new Date().getDate() - 123))
};

export const mockGroups: Group[] = [mockGroup, mockGroup2];
