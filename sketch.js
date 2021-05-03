const toUpdate = JSON.parse(localStorage.getItem("data")) || {
    date: Date.now(),
    start: Date.now() + 1000 * 60 * 60 * 24,
    classes: [{
        name: "Name",
        done: 0,
        total: 1,
        todo: 0,
        endDate: new Date().toString()
    }],
    vacations: []
};

if (toUpdate.vacations == undefined) {
    toUpdate.vacations = [];
}

localStorage.setItem("data", JSON.stringify(toUpdate));

const vm = new Vue({
    el: "#app",
    data: JSON.parse(localStorage.getItem("data")),
    computed: {
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
        totalTodo: function () {
            return Math.round(100 * this.classes.reduce((acc, v) => {
                return acc + v.todo;
            }, 0)) / 100;
        }
    },
    methods: {
        percentage: function (Class) {
            return Math.round(Class.done / Class.total * 10000) / 100;
        },
        percentageAndTodo: function (Class) {
            return (Class.done + Class.todo) / Class.total;
        },
        addNew: function () {
            this.classes.push({
                name: "Name",
                done: 0,
                total: 1,
                todo: 0
            });
        },
        newVacation: function () {
            this.vacations.push(new Date().toString());
        },
        remove: function (i) {
            this.classes.splice(i, 1);
        },
        removeVacation: function (i) {
            this.vacations.splice(i, 1);
        },
        todo: function () {
            for (let i = 0; i < this.classes.length; i++) {
                this.classes[i].todo = Math.round(100 * (this.classes[i].total - this.classes[i].done) / days(new Date(), new Date(this.classes[i].endDate), this.vacations)) / 100;
            }
        }
    },
    updated: function () {
        localStorage.setItem("data", JSON.stringify({
            classes: this.classes,
            vacations: this.vacations
        }));
    }
});

// https://stackoverflow.com/questions/37069186/calculate-working-days-between-two-dates-in-javascript-excepts-holidays
function days(startDate, endDate, vacations) {
    var count = 0;
    var curDate = startDate;
    while (curDate <= endDate) {
        var dayOfWeek = curDate.getDay();
        if (!((dayOfWeek == 6) || (dayOfWeek == 0) || vacations.map(x => { let d = new Date(x); d.setDate(d.getDate() + 1); return d.toDateString(); }).includes(curDate.toDateString())))
            count++;
        curDate.setDate(curDate.getDate() + 1);
    }
    return count;
}

setInterval(() => {
    vm.todo();
}, 1000);