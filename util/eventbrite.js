import { get } from 'lodash';

export const eventPublishDate = event => new Date(get(event, 'publish_settings.published_date', undefined));
