import { get, post, put, del } from './api';

const ENDPOINT = 'staffs/';

export const getStaffs = async (skip = 0, limit = 10, search = '') => {
    const params = { skip, limit };
    if (search) params.search = search;
    return await get(ENDPOINT, params);
};

export const getStaffById = async (id) => {
    return await get(`${ENDPOINT}${id}`);
};

export const createStaff = async (staffData) => {
    return await post(ENDPOINT, staffData);
};

export const updateStaff = async (id, staffData) => {
    return await put(`${ENDPOINT}${id}`, staffData);
};

export const deleteStaff = async (id) => {
    return await del(`${ENDPOINT}${id}`);
};
