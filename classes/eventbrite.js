import * as api from '../api/eventbrite.js';
import { get, pick } from 'lodash';

export class Eventbrite {
    constructor(event) {
        this.id = event.id;
        this.url = event.url;
        this.name = get(event, 'name.text');
        this.date = new Date(get(event, 'start.local', undefined));
        this.dateUtc = new Date(get(event, 'start.utc', undefined));

        this._orderFetched = false;

        this.__publishDate = new Date(get(event, 'publish_settings.published_date', undefined));
    }

    async fetchOrders() {
        this._orders = await api.eventOrders(this.id);
        this._orderFetched = true;
        return this._orders;
    }

    get orders() {
        return this._orders.map(o => new Person(o));
    }

    get info() {
        return pick(this, ['id', 'url', 'name', 'date', 'dateUtc', '_orderFetched']);
    }
}

export class Person {
    constructor(order) {
        this.id = order.id;
        this.email = order.email;
        this.firstName = order.first_name;
        this.lastName = order.last_name;
    }

    toMailchimpJSON() {
        return {
            email_address: this.email,
            status: 'subscribed',
            merge_fields: {
                FNAME: this.firstName,
                LNAME: this.lastName
            },
            tags: ['eventbrite']
        }
    }
}