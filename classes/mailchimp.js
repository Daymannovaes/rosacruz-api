import * as api from '../api/mailchimp.js';
import * as fs from 'fs';
import { get, pick } from 'lodash';

export class Campaign {
    constructor(campaign) {
        this.id = campaign.id;
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

    async fetchContent() {
        this._content = await api.campaignContent(this.id);
        this._contentFetched = true;
        return this._content;
    }

    get info() {
        return pick(this, ['id', 'url', 'send_time', 'name']);
    }

    writeContent() {
        const filePath = `content-${this.id}.tmp.html`;
        console.log(`Saving file ${filePath} starts`);

        fs.writeFile(filePath, this._content.html, function(err) {

            if(err) {
                return console.log(err);
            }
        
            console.log(`Saving file ${filePath} ends`);
        }); 
    }
}