# rosacruz-api

## Install

`yarn install`

## Usage

run this in terminal

```javascript
MAILCHIMP_KEY=your_mc_key MAILCHIMP_LIST=your_list_id EVENTBRITE_KEY=your_eb_key EVENTBRITE_ORG=your_org_id node -r esm

import * as index from './index';

index.BH._getEvent(0); // fetch last event from eventbrite, from BH
// wait for log `get event from belo horizonte 0 ends` to show up

index.BH.infoFromEvent(0); // use this to check NAME and DATE

index.BH.addUsersFromEvent(0); // add users in mailchimp

index.LS, index.BH, index.CG, index.DIV
index.BH.__events[0].info
index.BH.__events[0].orders

// creating campaign
index.BH.fetchNextEvent(); // fetch next event from eventbrite, from BH
// wait for log `fetch next event from belo horizonte ends` to show up

index.BH.createCampaign() // create campaign from Next Event
// wait for log `create campaign "palestra ..." for belo horizonte ends`
```
