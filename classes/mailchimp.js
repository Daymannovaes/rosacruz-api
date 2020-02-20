import * as api from '../api/mailchimp.js';
import * as fs from 'fs';
import * as path from 'path';
import { get, pick } from 'lodash';

const templateFolder = path.resolve(__dirname, '../templates');

export class Campaign {
    constructor(campaign) {
        this.id = campaign.id;
        this.web_id = campaign.web_id;
        this.name = get(campaign, 'settings.title');

        this.type = campaign.type || 'regular';
        this.list_id = get(campaign, 'recipients.list_id');
        this.segment_id = get(campaign, 'recipients.segment_opts.saved_segment_id');
        this.match = get(campaign, 'recipients.segment_opts.match');


        this.url = campaign.long_archive_url;
        this.send_time = campaign.send_time;

        this._contentFetched = false;
        this._campaign = campaign;
    }

    async fetchContent(force) {
        if (this._contentFetched && !force) return this._content;

        this._content = await api.campaignContent(this.id);
        this._contentFetched = true;
        return this._content;
    }

    get info() {
        return pick(this, ['id', 'web_id', 'url', 'send_time', 'name']);
    }

    writeContent() {
        const filePath = path.resolve(templateFolder, `content-${this.id}.tmp.html`);
        console.log(`Saving file ${filePath} starts`);

        fs.writeFile(filePath, this._content.html, function(error) {
            if(error) {
                return console.log(error);
            }

            console.log(`Saving file ${filePath} ends`);
        });
    }

    async readTemplate(slug) {
        return new Promise((resolve, reject) => {
            const filename = path.resolve(templateFolder, `template-${slug.toLowerCase()}-v2.html`);

            fs.readFile(filename, 'utf8', (error, data) => {
                if(error) {
                    console.log(error);
                    return reject(error);
                }

                this._template = data;
                resolve(this._template);
            });
        });
    }

    async createContentFromTemplate(slug, {
        image,
        title,
        description,
        date,
        textLink,
        eventLink,
        dateTime
    }) {
        const template = await this.readTemplate(slug);
        const html = template
            .replace('{{IMAGE}}', image)
            .replace('{{TITLE}}', title)
            .replace('{{DESCRIPTION}}', description)
            .replace('{{DATE}}', date)
            .replace('{{TEXT_LINK}}', textLink)
            .replace('{{EVENT_LINK}}', eventLink)
            .replace('{{DATE_TIME}}', dateTime);

        return await api.updateCampaignContent(this.id, html);
        // IMAGE https://mailchimp.com/developer/reference/file-manager-files/
        // TITLE
        // DESCRIPTION
        // DATE
        // TEXT_LINK
        // EVENT_LINK
        // DATE_TIME
    }
}