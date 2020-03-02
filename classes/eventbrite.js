import * as api from '../api/eventbrite.js';
import { get, pick } from 'lodash';

const pad = str => String(str).padStart(2, 0);

const MONTH = {
    0: 'janeiro',
    1: 'fevereiro',
    2: 'março',
    3: 'abril',
    4: 'maio',
    5: 'junho',
    6: 'julho',
    7: 'agosto',
    8: 'setembro',
    9: 'outubro',
    10: 'novembro',
    11: 'dezembro'
};
export class Eventbrite {
    constructor(event) {
        this.id = event.id;
        this.url = event.url;
        this.name = get(event, 'name.text');
        this.date = new Date(get(event, 'start.local', undefined));
        this.dateUtc = new Date(get(event, 'start.utc', undefined));

        this._orderFetched = false;
        this._detailsFetched = false;
        this._event = event;
    }

    async fetchOrders() {
        this._orders = await api.eventOrders(this.id);
        this._orderFetched = true;
        return this._orders;
    }

    async fetchDetailedInfo() {
        this._details = await api.eventDetails(this.id);
        this.description = (await api.eventDescription(this.id)).description;
        this.logo = get(this._details, 'logo.original.url', get(this._details, 'logo.url'));
        this.logoData = await api.fetchImage(this.logo);
        this._detailsFetched = true;
        return this._details;
    }

    get orders() {
        return this._orders ? this._orders.map(o => new Person(o)) : this._orders;
    }

    get info() {
        return pick(this, ['id', 'url', 'name', 'date', 'dateUtc', '_orderFetched']);
    }

    get detailedInfo() {
        return {
            ...this.info,
            ...pick(this, ['description', 'logo'])
        };
    }

    get base64image() {
        return Buffer.from(this.logoData, 'binary').toString('base64');
    }

    get formattedDate() {
        return `${pad(this.date.getDate())}/${pad(this.date.getMonth() + 1)}/${this.date.getFullYear()}`;
    }

    get formattedDateMonth() {
        return `${pad(this.date.getDate())} de ${MONTH[this.date.getMonth()]}`;
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