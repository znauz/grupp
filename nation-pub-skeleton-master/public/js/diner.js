/* global sharedVueStuff, Vue, socket */
'use strict';

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function getOrderNumber() {
    // It's probably not a good idea to generate a random order number, client-side. 
    // A better idea would be to let the server decide.
    return "#" + getRandomInt(1, 1000000);
}

new Vue({
    el: '#ordering',
    mixins: [sharedVueStuff], // include stuff that goes to both diner and kitchen
    data: {
        mainDish: [],
        extras: []

    },
    methods: {
        placeOrder: function() {
            // Here two ways of getting selected items are illustrated
            // 1. The Vue way, notice the data model declarations above
            var mainCourse = this.mainDish;
            var extras = this.extras;
            // 2. The old-school way: create an array with values of checked items
            var theRest = [].filter.call(document.getElementsByName('item[]'), function(i) {
                return i.checked;
            }).map(function(i) {
                return i.value;
            });
            // OK, it's not really neat to use two different ways of accomplishing the same thing
            // but let's pretend it's for an educational purpose ... here comes another no-no:
            var orderItems = mainCourse.concat(extras).concat(theRest);
            // Finally we make use of socket.io's magic to send the stuff to the kitchen
            socket.emit('order', {orderId: getOrderNumber(), orderItems: orderItems});
        },
	addItem: function(food) {
	    var mainCourse = this.mainDish;
	    var extras = this.extras;
	    
	    console.log("You ordered: " + food);
	    
	}
    }
});



function openFood(evt, food) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the link that opened the tab
    document.getElementById(food).style.display = "block";
    evt.currentTarget.className += " active";
}
