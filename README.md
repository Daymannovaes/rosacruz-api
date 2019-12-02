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

index.addUsersFromBH(); // add users in mailchimp
```