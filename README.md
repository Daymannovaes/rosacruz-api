# rosacruz-api

## Install

`yarn install`

## Usage

run this in terminal

```javascript
MAILCHIMP_KEY=your_mc_key MAILCHIMP_LIST=your_list_id EVENTBRITE_KEY=your_eb_key EVENTBRITE_ORG=your_org_id node -r esm

import * as index from './index';

index.__cities.BH._getEvent(0); // fetch last event from eventbrite, from BH
// wait for log `get event from belo horizonte 0 ends` to show up

index.__cities.BH.infoFromEvent(0); // use this to check NAME and DATE

index.__cities.BH.addUsersFromEvent(0); // add users in mailchimp

index.__cities.LS, index.__cities.BH, index.__cities.CG, index.__cities.DIV
index.__cities.BH.__events[0].info
index.__cities.BH.__events[0].orders
```
