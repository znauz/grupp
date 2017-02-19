/* global sharedVueStuff, Vue, socket */
'use strict';

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function getOrderNumber() {
    // It's probably not a good idea to generate a random order
    //  number, client-side. 
    // A better idea would be to let the server decide.
    return "#" + getRandomInt(1, 1000000);
}



new Vue({
    el: '#ordering',
    mixins: [sharedVueStuff], // include stuff that goes to both
                              //  diner and kitchen
    data: {
        toOrder: [],
        mainDish: [],
        extras: [],
        extrasInfo: [],
        total: 0

    },
    methods: {
        placeOrder: function() {
            var arr = document.getElementsByClassName('ordersInProgress');
            var i=arr.length-1;
            for(i; i>-1; i--) {
                arr[i].parentNode.removeChild(arr[i]);
            }
            this.total = 0;
            // Here two ways of getting selected items are illustrated
            // 1. The Vue way, notice the data model declarations
            //  above
            
            //var mainCourse = this.mainDish;
            //var extras = this.extras;
            // 2. The old-school way: create an array with values of
            //  checked items
            //var theRest = [].filter.call(document.getElementsByName('item[]'), function(i) {
              //  return i.checked;
            //}).map(function(i) {
              //  return i.value;
            //});
            // OK, it's not really neat to use two different ways
            //  of accomplishing the same thing
            // but let's pretend it's for an educational purpose ...
            //  here comes another no-no:
            //var orderItems = mainCourse.concat(extras).concat(theRest);
            // Finally we make use of socket.io's magic to send the
            //  stuff to the kitchen

            var orderItems = [];
            var i=0;
            for(i; i<this.toOrder.length; i++) {
                orderItems.push(this.toOrder[i].label);
            }
            
            socket.emit('order', {orderId: getOrderNumber(), orderItems: orderItems});
        },
        sendToReceipt: function(item) {
            var orderTable = document.getElementById('currentOrder');
            var newTr  = document.createElement('tr');
            newTr.setAttribute('class', 'ordersInProgress');
            var newTd  = document.createElement('td');
            newTd.setAttribute('class', 'orderData');
            newTd.setAttribute('name', 'toKitchen');
            var newTd2 = document.createElement('td');
            newTd2.setAttribute('class', 'orderPrice');
            
            var txt = item.label;
            var sum = item.price;

            var i=0;
            for(i; i<this.extrasInfo.length; i++) {
                if ((item.label + '::' + this.extrasInfo[i].name) == this.extrasInfo[i].id) {
                    txt += "::" + this.extrasInfo[i].name;
                    sum += this.extrasInfo[i].price;
                    document.getElementById(item.label + '::' + this.extrasInfo[i].name).setAttribute('checked', false);
                }
            }

            var txt2 = sum + ":-"; 
            var newTxt = document.createTextNode(txt);
            var newTxt2 = document.createTextNode(txt2);
            newTd.appendChild(newTxt);
            newTd2.appendChild(newTxt2);
            newTr.appendChild(newTd);
            newTr.appendChild(newTd2);
            orderTable.appendChild(newTr);

            var order = {label: txt, price: sum};
            this.toOrder.push(order);
            this.total += sum;
        },
        setValues: function(id, name, price) {
            var i=0;
            if (this.extrasInfo.length != 0) {
                for(i; i<(this.extrasInfo.length+1); i++) {
                    if(i != this.extrasInfo.length) {
                        if(id === this.extrasInfo[i].id) {
                            this.extrasInfo.splice(i, 1);
                            i = this.extrasInfo.length + 1;
                        }
                    }
                    else {
                        var newArr = {id: id, name: name, price: price};
                        this.extrasInfo.push(newArr);
                        i = this.extrasInfo.length + 1;
                    }
                }
            }
            else {
                var newArr = {id: id, name: name, price: price};
                this.extrasInfo.push(newArr);
            }
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

    // Get all elements with class="tablinks" and remove the class
    //  "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the link
    //  that opened the tab
    document.getElementById(food).style.display = "block";
    evt.currentTarget.className += " active";
}
