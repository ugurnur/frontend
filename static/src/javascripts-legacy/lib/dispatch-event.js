define(function () {
    return function (node, eventName, eventDetail) {
        var event = new CustomEvent(eventName, {detail: eventDetail});
        node.dispatchEvent(event);
    }
});
