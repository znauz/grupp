/* global sharedVueStuff, Vue, socket */
'use strict';

//Global variable for orderNumbers
var oNR = 0;

//Function to get the orderNumber
function getOrderNumber() {
    oNR++;
    return "#" + oNR;
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
        total: 0,
        calc: 0,
    },
    methods: {
        //Function to send order to kitchen
        placeOrder: function() {
            if(this.toOrder.length > 0) {
		var tableNumber = document.getElementById('tableDrop');
		var tableValue = tableNumber.options[tableNumber.selectedIndex].value;
		if(tableValue > 0){

		if(tableValue.disabled) {
		    console.log("Omg disabled wtf");
		    
		}

	
		var tableString = "Bord: " + tableValue;

                var arr = document.getElementsByClassName(
                    'ordersInProgress');
                var i=arr.length-1;
                for(i; i>-1; i--) {
                    arr[i].parentNode.removeChild(arr[i]);
                }
                this.total = 0;
                
                //  stuff to the kitchen
                var orderItems = [];
		orderItems.push(tableString);
                var i=0;
                for(i; i<this.toOrder.length; i++) {
                    //Testing printouts
                    console.log(this.toOrder[i].thing);
                    console.log(this.toOrder[i].label);
                    //Error with undefined "thing"
                    if (this.toOrder[i].thing != "drink") {
                        orderItems.push(this.toOrder[i].label);
                    }
                }
		
                socket.emit('order',
                            {orderId: getOrderNumber(),
                             orderItems: orderItems});
                this.toOrder = [];
                    this.orderNumber++;
		}
		else {
		    window.alert("välj ett bord");
		}
            }
        },
        //Function to send food or drink from menu to receipt
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
                if ((item.label + '::' + this.extrasInfo[i].name)
                    == this.extrasInfo[i].id)
                {
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
        //Function to set info from checkboxed at click
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
        },
        // When the user clicks on the button, open Cash modal
        openModal: function() {
            // Get the modal
            this.calc = 0;
            var text = document.getElementById('calcInfo');
            text.value = this.calc;
            
            var modal = document.getElementById('myModal');
            
            modal.style.display = "block";
        },
        //When the user click on the button, open Card Modal
        openModal2: function() {
            // Get the modal
            var modal = document.getElementById('myModal2');

            modal.style.display = "block";
        },
        // When the user clicks on close, close the modal
        closeModal: function() {
            // Get the modal
            var orgTot = this.total;
            var calcVal = this.calc;
            var currTot = 0;

            if (orgTot != 0) {
                this.total -= calcVal;
                currTot = this.total;
                this.total = 0;
                this.calcVal = 0;
            }
            
            var modal = document.getElementById('myModal');
            var modal2 = document.getElementById('myModal2');
            
            modal.style.display = "none";
            modal2.style.display = "none";

            if (orgTot != 0) {
                if ((currTot === 0) || (currTot < 0)) {
                    if (currTot < 0) {
                        window.alert("return: "
                                     + currTot*(-1)
                                     + " kr");
                        this.total = 0;
                    }
                    this.placeOrder();
                }
            }
        },
        //Function to add Number to calcModal display
        addNum: function(value) {
            var info = document.getElementById('calcInfo');

            var value = this.calc = this.calc*10 + value;
            info.value = value;
        },
        //Function to clear calc modal display
        clear: function(value) {
            var info = document.getElementById('calcInfo');

            var value = this.calc = 0;
            info.value = value;
        },
        //Function to back 1 step in calc modal display
        back: function() {
            var info = document.getElementById('calcInfo');

            var value = this.calc = (this.calc - (this.calc%10))/10;
            info.value = value;
        }
    }
});

//Function to traverse trough tabs in menu
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

//Set onclick for the window
window.onclick = function(event) {
    // Get the modal
    var modal = document.getElementById('myModal');
    var modal2 = document.getElementById('myModal2');
    
    if (event.target == modal) {
        modal.style.display = "none";
    }
    if (event.target == modal2) {
        modal2.style.display = "none";
    }
}
