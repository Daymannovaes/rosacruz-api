# rosacruz-api

## Install

`yarn install`

## Usage

run this in terminal

```javascript
MAILCHIMP_KEY=your_mc_key MAILCHIMP_LIST=your_list_id EVENTBRITE_KEY=your_eb_key EVENTBRITE_ORG=your_org_id node -r esm

import * as index from './index';
index.getLastEventFromBH();
// ... wait for log `get event from belo horizonte 0 ends` to show up

index.eventsInfoFromBH() // contains info about last events

index.__events[index.BH][0].orders // contain all orders from the last event
index.__events[index.BH][0].info // major info of the event
index.eventInfo(index.BH, 0) // same than above, returns info from event 0 from BH


index._getEventFrom(index.BH, 1) // to fetch the second last event. 0 = last, 1 = second last, and so on

index.addUsersFrom(index.BH, 0); // add users in mailchimp, where n equals the order of the event. 0 = last event, 1 = second last
index.addUsersFrom(index.LS, 0);
```
