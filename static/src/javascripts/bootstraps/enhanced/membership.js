// @flow
import { membershipTab } from 'membership/membership-tab';
import { digitalpackTab } from 'membership/digitalpack-tab';
import { weeklyTab } from 'membership/weekly-tab';

export const init = (): void => {
    membershipTab();
    digitalpackTab();
    weeklyTab();
};
