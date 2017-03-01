/* global sharedVueStuff, Vue, socket */
'use strict';

new Vue({
    el: '#orders',
    mixins: [sharedVueStuff], // include stuff that goes to both diner and kitchen
    methods: {
        markDone: function(orderid) {
            this.orders[orderid].done = true;
            socket.emit("orderDone", orderid);
        },
	markFinished: function(orderid) {
	    
	    console.log(orderid);
	    (this.orders).splice(orderid, 1);
	    socket.emit("orderFinished", orderid);
	}
    }
});
