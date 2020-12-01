const vm = new Vue({
    el: "#app",
    data: JSON.parse(localStorage.getItem("data")) || {
        date: Date.now(),
        start: Date.now()+1000*60*60*24,
        classes: [{
            name: "Name",
            done: 0,
            total: 1,
            todo: 0
        }]
    },
    computed: {
        assignments: function () {
            let timeLeft = days(new Date(Date.now()), new Date(this.date));
            console.log(timeLeft);
            let todo = this.totalAssignments - this.totalDone;
            return Math.round((todo / timeLeft) * 100) / 100;
        },
        totalDone: function () {
            return this.classes.reduce((acc, v) => {
                return acc + v.done;
            }, 0);
        },
        totalAssignments: function () {
            return this.classes.reduce((acc, v) => {
                return acc + v.total;
            }, 0);
        },
        totalPercent: function () {
            return Math.round(this.totalDone / this.totalAssignments * 10000) / 100;
        },
        target: function () {
            return Math.round((Date.now() - new Date(this.start).getTime()) / (new Date(this.date).getTime() - new Date(this.start).getTime()) * 10000) / 100;
        }
    },
    methods: {
        percentage: function (Class) {
            return Math.round(Class.done / Class.total * 10000) / 100;
        },
        percentageAndTodo: function(Class) {
            return (Class.done+Class.todo)/Class.total;
        },
        addNew: function () {
            this.classes.push({
                name: "Name",
                done: 0,
                total: 1,
                todo: 0
            });
        },
        remove: function (i) {
            this.classes.splice(i, 1);
        },
        todo: function () {
            if (this.assignments < 100) {
                for (let i = 0; i < this.classes.length; i++) {
                    this.classes[i].todo = 0;
                }
                    
                for (let i = 0; i < this.assignments; i++) {
                    minVal = Infinity;
                    min = 0;
                    for (let j = 0; j < this.classes.length; j++) {
                        const v = this.percentageAndTodo(this.classes[j]);
                        if (v < minVal) {
                            min = j;
                            minVal = v;
                        }
                    }

                    this.classes[min].todo++;
                }
            }
        }
    },
    updated: function () {
        localStorage.setItem("data", JSON.stringify({
            date: this.date,
            start: this.start,
            classes: this.classes,
        }));
    }
});

// https://stackoverflow.com/questions/37069186/calculate-working-days-between-two-dates-in-javascript-excepts-holidays
function days(startDate, endDate) {
    var count = 0;
    var curDate = startDate;
    while (curDate <= endDate) {
        var dayOfWeek = curDate.getDay();
        if (!((dayOfWeek == 6) || (dayOfWeek == 0)))
            count++;
        curDate.setDate(curDate.getDate() + 1);
    }
    return count;
}

setInterval(() => {
    vm.todo();
}, 1000);