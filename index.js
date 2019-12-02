
import * as eventbrite from './api/eventbrite';
import { Eventbrite } from './classes/eventbrite';

export async function getLastEventFrom(search) {
    const { events } = await eventbrite.searchEvent(search);
    const event = new Eventbrite(events[0]);

    await event.fetchOrders();

    return event;
}

export const getLastEventFromBH = () => getLastEventFrom('belo horizonte');
export const getLastEventFromLS = () => getLastEventFrom('lagoa santa');