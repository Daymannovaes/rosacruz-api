
import * as eventbrite from './api/eventbrite';
import * as mailchimp from './api/mailchimp';
import { Eventbrite, Person } from './classes/eventbrite';

export const BH = 'belo horizonte';
export const LS = 'lagoa santa';
const Tag = city => city.replace(/ /g, '-');

export const __events = {};

export async function _fetchEventsFrom(search) {
    console.log(`fetch events from ${search} starts`);

    const { events } = await eventbrite.searchEvent(search);
    __events[search] = events.map(e => new Eventbrite(e));

    console.log(`fetch events from ${search} ends`);
    return events[search];
}

export async function _getEventFrom(search, n) {
    console.log(`get event from ${search} ${n} starts`);
    if(!__events[search]) await _fetchEventsFrom(search);

    const event = __events[search][n];
    await event.fetchOrders();

    console.log(`get event from ${search} ${n} ends`);
    return event;
}

export async function _getLastEventFrom(search) {
    return await _getEventFrom(search, 0);
}

export const getLastEventFromBH = () => _getLastEventFrom(BH);
export const getLastEventFromLS = () => _getLastEventFrom(LS);

export const eventsInfoFromBH = () => __events[BH].map(e => e.info);
export const eventsInfoFromLS = () => __events[LS].map(e => e.info);

export async function addUsersFrom(city, n = 0) {
    const tag = Tag(city);
    console.log(`add users from city ${city}, tag ${tag}, n ${n} starts`);
    await mailchimp.addUsersWithTag(tag, __events[city][n].orders.map(o => o.toMailchimpJSON()));
    console.log(`add users from city ${city}, tag ${tag}, n ${n} ends`);
}

export async function addUsersFromBH(n = 0) {
    return await addUsersFrom(BH, n);
}
export async function addUsersFromLS(n = 0) {
    return await addUsersFrom(LS, n);
}