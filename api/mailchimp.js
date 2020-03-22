import { get, put, post } from 'axios';
import { chain, uniqBy } from 'lodash';

const KEY = process.env.MAILCHIMP_KEY;
const LIST_ID = process.env.MAILCHIMP_LIST;
const ALUNOS_SEGMENT_ID = process.env.ALUNOS_SEGMENT_ID || 908934;

const BASE_URL = 'https://us12.api.mailchimp.com/3.0';
const mcGet = (path, qs = '') => get(`${BASE_URL}/${path}?${qs}`, {
    headers: {
        'Authorization': `Basic ${KEY}`
    }
}).then(r => r.data);

const mcPost = (path, data) => post(`${BASE_URL}/${path}`, data, {
    headers: {
        'Authorization': `Basic ${KEY}`
    }
}).then(r => r.data);

const mcPut = (path, data) => put(`${BASE_URL}/${path}`, data, {
    headers: {
        'Authorization': `Basic ${KEY}`
    }
}).then(r => r.data);

export const getMe = () => mcGet('');

export const addUsersWithTag = (tag, users) => {
    const members = users.map(user => Object.assign(user, { tags: chain(user).get('tags', []).concat(tag).uniq().value() }));

    const data = {
        members: uniqBy(members, m => m.email_address),
        update_existing: true
    };

    console.log(JSON.stringify(data, 2));
    return mcPost(`lists/${LIST_ID}`, data);
}

export const getLists = () => mcGet('lists');
export const getList = (listId) => mcGet(`lists/${listId}`);

export const listCampaigns = () => mcGet('campaigns?count=100');
export const campaignContent = campaignId => mcGet(`campaigns/${campaignId}/content`);

const Segment = id => ({
    condition_type: 'StaticSegment',
    field: 'static_segment',
    op: 'static_is',
    value: id
});

export const createCampaign = ({
    name,
    subject,
    segmentId,
    previewText
}) => {
    const data = {
        type: 'regular',
        settings: {
            title: name,
            subject_line: subject,
            preview_text: previewText,
            from_name: 'Rosacruz Áurea',
            reply_to: 'belohorizonte@rosacruzaurea.org.br',
        },
        recipients: {
            list_id: LIST_ID,
            segment_opts: {
                match: 'any',
                conditions: [
                    Segment(segmentId),
                    Segment(ALUNOS_SEGMENT_ID)
                ]
            }
        }
    };
    return mcPost(`campaigns`, data);
}

export const updateCampaignContent = (campaignId, html) => mcPut(`campaigns/${campaignId}/content`, { html });
export const uploadFile = ({
    folderId: folder_id,
    fileData: file_data,
    name,
}) => mcPost(`/file-manager/files`, {
    name,
    folder_id,
    file_data
});