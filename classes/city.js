import * as eventbrite from '../api/eventbrite';
import * as mailchimp from '../api/mailchimp';

import { Campaign } from './mailchimp';
import { Eventbrite } from './eventbrite';

const Tag = city => city.replace(/ /g, '-');

export class City {
    constructor({ slug, name, mailchimpSegmentId }) {
        this.slug = slug.toUpperCase();
        this.name = name;
        this.tag = Tag(this.name);
        this.mailchimpSegmentId = mailchimpSegmentId;
    }

    get readyToCreateCampaign() {
        return this.__next_event;
    }

    get campaignName() {
        if (!this.readyToCreateCampaign) return undefined;
        return `Palestra ${this.slug} ${this.__next_event.formattedDate}`;
    }


    // ---- EVENTBRITE METHODS ----

    async fetchNextEvent() {
        console.log(`fetch next event from ${this.name} starts`);

        const event = await eventbrite.searchNextEvent(this.name);
        this.__next_event = new Eventbrite(event);

        console.log(this.__next_event.info);
        console.log(`fetch next events from ${this.name} ends`);
        return this.__next_event;
    }

    async _fetchEvents() {
        console.log(`fetch events from ${this.name} starts`);

        const { events } = await eventbrite.searchEvent(this.name);
        this.__events = events.map(e => new Eventbrite(e));

        console.log(`fetch events from ${this.name} ends`);
        return this.__events;
    }

    async _getEvent(n) {
        console.log(`get event from ${this.name} ${n} starts`);
        if(!this.__events) await this._fetchEvents();

        const event = this.__events[n];
        await event.fetchOrders();

        console.log(event.info);
        console.log(`get event from ${this.name} ${n} ends`);
        return event;
    }

    infoFromEvents() {
        return this.__events.map(e => e.info);
    }

    infoFromEvent(n) {
        return this.__events[n].info;
    }


    // ---- MAILCHIMP METHODS ----

    async addUsersFromEvent(n = 0) {
        console.log(`add users from city ${this.name}, tag ${this.tag}, n ${n} starts`);
        await mailchimp.addUsersWithTag(this.tag, this.__events[n].orders.map(o => o.toMailchimpJSON()));
        console.log(`add users from city ${this.name}, tag ${this.tag}, n ${n} ends`);
    }

    async createCampaign({
        subject = this.__next_event.name,
        previewText
    } = {}) {
        if (!this.readyToCreateCampaign) return undefined;
        console.log(`create campaign ${this.campaignName} for ${this.name} starts`);
        const campaign = await mailchimp.createCampaign({
            subject: this.normalizeSubject(subject),
            previewText,
            name: this.campaignName,
            segmentId: this.mailchimpSegmentId
        });

        this.campaign = new Campaign(campaign);
        console.log(`create campaign ${this.campaignName} for ${this.name} end`);
        console.log(`go to https://us12.admin.mailchimp.com/campaigns/edit?id=${this.campaign.web_id}`);
        return this.campaign;
    }

    async createCampaignContent(title, description, textLink) {
        console.log(`create campaign content for ${this.campaignName} starts`);

        const image = await this.uploadEventImageToMailchimp(this.__next_event);
        await this.campaign.createContentFromTemplate(this.slug, {
            image,
            title,
            description,
            date: this.__next_event.formattedDateMonth,
            textLink,
            eventLink: this.__next_event.url,
            dateTime: this.__next_event.formattedDate
        });

        console.log(`create campaign content for ${this.campaignName} ends`);
        console.log(`go to https://us12.admin.mailchimp.com/campaigns/edit?id=${this.campaign.web_id}`);
    }

    async uploadEventImageToMailchimp(event) {
        console.log(`uploadEventImageToMailchimp for ${this.campaignName} starts`);
        await event.fetchDetailedInfo();
        console.log(`event.base64image.length: ${event.base64image.length}`);

        const file = await mailchimp.uploadFile({
            name: `${event.name}.jpg`,
            folderId: 0,
            fileData: event.base64image
        });

        console.log(`uploadEventImageToMailchimp for ${this.campaignName} ends`);
        console.log(`go to ${file.full_size_url}`);
        return file.full_size_url;
    }

    normalizeSubject(subject) {
        return subject
        .trim()
        .replace(/  +/g, ' ')
        .replace(/[“”"']/g, "")
        .replace(new RegExp(`(Palestra em ${this.name})( *\/ *[a-zA-Z]+)?`, 'ig'), '$1')
        .replace(new RegExp(`(Palestra em ${this.name})( *- *)?`, 'ig'), '$1: ')
        .trim();
    }
}