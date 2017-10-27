// @flow
import $ from 'lib/$';
import fetch from 'lib/fetch';
import config from 'lib/config';
import reportError from 'lib/report-error';
import formatters from 'membership/formatters';
import { display } from 'membership/stripe';

const PACKAGE_COST = '.js-weekly-package-cost';
const PAYMENT_FORM = '.js-weekly-card-details';
const SUBSCRIBER_ID = '.js-weekly-subscriber-id';
const REMAINING_TRIAL_LENGTH = '.js-weekly-remaining-trial-length';
const REMAINING_TRIAL_LENGTH_CONTAINER =
    '.js-weekly-remaining-trial-length-container';
const PACKAGE_CURRENT_RENEWAL_DATE = '.js-weekly-current-renewal-date';
const PACKAGE_CURRENT_PERIOD_END = '.js-weekly-current-period-end';
const PACKAGE_CURRENT_PERIOD_START = '.js-weekly-current-period-start';
const PACKAGE_NEXT_PAYMENT_DATE = '.js-weekly-next-payment-date';
const PACKAGE_NEXT_PAYMENT_PRICE = '.js-weekly-next-payment-price';
const PACKAGE_NEXT_PAYMENT_CONTAINER = '.js-weekly-next-payment-container';
const PACKAGE_INTERVAL = '.js-weekly-plan-interval';
const DETAILS_JOIN_DATE = '.js-weekly-join-date';
const NOTIFICATION_CANCEL = '.js-weekly-cancel-tier';
const weekly_DETAILS = '.js-weekly-details';
const weekly_PRODUCT = '.js-weekly-product';
const UP_SELL = '.js-weekly-up-sell';
const weekly_INFO = '.js-weekly-info';
const LOADER = '.js-weekly-loader';
const IS_HIDDEN_CLASSNAME = 'is-hidden';
const ERROR = '.js-weekly-error';

const hideLoader = (): void => {
    $(LOADER).addClass(IS_HIDDEN_CLASSNAME);
};

const populateUserDetails = (userDetails: UserDetails): void => {
    const glyph = userDetails.subscription.plan.currency;
    $(SUBSCRIBER_ID).text(userDetails.subscription.subscriberId);
    $(weekly_PRODUCT).text(userDetails.subscription.plan.name);
    $(PACKAGE_COST).text(
        formatters.formatAmount(userDetails.subscription.plan.amount, glyph)
    );
    $(DETAILS_JOIN_DATE).text(formatters.formatDate(userDetails.joinDate));
    $(PACKAGE_INTERVAL).text(`${userDetails.subscription.plan.interval}ly`);
    $(PACKAGE_CURRENT_PERIOD_START).text(
        formatters.formatDate(userDetails.subscription.start)
    );
    $(PACKAGE_CURRENT_PERIOD_END).text(
        formatters.formatDate(userDetails.subscription.end)
    );
    $(PACKAGE_CURRENT_RENEWAL_DATE).text(
        formatters.formatDate(userDetails.subscription.renewalDate)
    );
    const trialLeft = userDetails.subscription.trialLength;
    if (trialLeft > 0) {
        $(REMAINING_TRIAL_LENGTH).text(
            `${trialLeft} day${trialLeft !== 1 ? 's' : ''}`
        );
        $(REMAINING_TRIAL_LENGTH_CONTAINER).removeClass(IS_HIDDEN_CLASSNAME);
    }

    $(PACKAGE_NEXT_PAYMENT_DATE).text(
        formatters.formatDate(userDetails.subscription.nextPaymentDate)
    );
    if (
        userDetails.subscription.nextPaymentPrice !==
        userDetails.subscription.plan.amount
    ) {
        $(PACKAGE_NEXT_PAYMENT_PRICE).text(
            formatters.formatAmount(
                userDetails.subscription.nextPaymentPrice,
                glyph
            )
        );
        $(PACKAGE_NEXT_PAYMENT_CONTAINER).removeClass(IS_HIDDEN_CLASSNAME);
    }

    if (!userDetails.optIn) {
        $(NOTIFICATION_CANCEL).removeClass(IS_HIDDEN_CLASSNAME);
        $(weekly_DETAILS).addClass(IS_HIDDEN_CLASSNAME);
    } else if (userDetails.subscription.card) {
        display(
            PAYMENT_FORM,
            userDetails.subscription.card,
            userDetails.subscription.card.stripePublicKeyForUpdate
        );
    }
    $(weekly_INFO).removeClass(IS_HIDDEN_CLASSNAME);
};

const displayweeklyUpSell = (): void => {
    $(UP_SELL).removeClass(IS_HIDDEN_CLASSNAME);
};

const displayErrorMessage = (): void => {
    $(ERROR).removeClass(IS_HIDDEN_CLASSNAME);
};

export const weeklyTab = (): void => {
    fetch(`${config.get('page.userAttributesApiUrl')}/me/mma-weekly`, {
        mode: 'cors',
        credentials: 'include',
    })
        .then(resp => resp.json())
        .then(json => {
            if (json && json.subscription) {
                hideLoader();
                populateUserDetails(json);
            } else {
                hideLoader();
                displayweeklyUpSell();
            }
        })
        .catch(err => {
            hideLoader();
            displayErrorMessage();
            reportError(err, {
                feature: 'mma-weekly',
            });
        });
};
