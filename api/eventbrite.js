import { get, post } from 'axios';
import { first } from 'lodash';
const KEY = process.env.EVENTBRITE_KEY;
const ORG_ID = process.env.EVENTBRITE_ORG;

const BASE_URL = 'https://www.eventbriteapi.com/v3';
const ebGet = (path, qs = '') => get(`${BASE_URL}/${path}?token=${KEY}&${qs}`).then(r => r.data);

export const getMe = () => ebGet('users/me');

export const searchEvent = filter => ebGet(`organizations/${ORG_ID}/events`, `show_series_parent=true&expand=venue%2Csales_data_with_null%2Cpublish_settings%2Cevent_sales_status&order_by=start_desc&name_filter=${encodeURIComponent(filter)}&page=1&page_size=20&status=live%2Cstarted%2Cended%2Ccanceled&time_filter=past`);
export const searchNextEvent = filter => ebGet(
    `organizations/${ORG_ID}/events`,
    `show_series_parent=true&expand=venue%2Csales_data_with_null%2Cpublish_settings%2Cevent_sales_status&order_by=start_asc&name_filter=${encodeURIComponent(filter)}&page=1&page_size=20&status=live%2Cstarted%2Cended%2Ccanceled&time_filter=current_future`
).then(( { events }) => first(events));

export const eventOrders = eventId => getPaginated({
    url: `events/${eventId}/orders`,
    type: 'orders'
});

export const getPaginated = async ({ url, qs, type, maxRecords }) => {
    let response = await ebGet(url, qs);
    let records = response[type];

    let count = 1;
    while(response.pagination.has_more_items && (!maxRecords || records.length > maxRecords)) {
        count++;

        response = await ebGet(url, `continuation=${response.pagination.continuation}`);
        records = records.concat(response[type]);

        console.log(`get ${url} page ${count}, total ${records.length} records`);
    }

    return records;
};
