import { get, post } from 'axios';
import { chain } from 'lodash';

const KEY = process.env.MAILCHIMP_KEY;
const LIST_ID = process.env.MAILCHIMP_LIST;

const BASE_URL = 'https://us12.api.mailchimp.com/3.0'; 
const mcGet = (path, qs = '') => get(`${BASE_URL}/${path}?${qs}`, {
    headers: {
        'Authorization': `Basic ${KEY}`
    }
}).then(r => r.data);
const mcPost = (path, data) => post(`${BASE_URL}/${path}`, {
    data,
    headers: {
        'Authorization': `Basic ${KEY}`
    }
}).then(r => r.data);

export const getMe = () => mcGet('');

export const addUsersWithTag = (tag, users) => mcPost(`lists/${LIST_ID}`, {
    update_existing: true,
    members: users.map(user => Object.assign(user, { tags: chain(user).get('tags', []).concat(tag).uniq().value() }))
});

export const listLists = () => mcGet('lists');

export const eventOrders = eventId => getPaginated({
    url: `events/${eventId}/orders`,
    type: 'orders'
});

export const getPaginated = async ({ url, qs, type, maxRecords }) => {
    let response = await mcGet(url, qs);
    let records = response[type];

    let count = 1;
    while(response.pagination.has_more_items && (!maxRecords || records.length > maxRecords)) {
        count++;

        response = await mcGet(url, `continuation=${response.pagination.continuation}`);
        records = records.concat(response[type]);

        console.log(`get ${url} page ${count}, total ${records.length} records`);
    }

    return records;
};
