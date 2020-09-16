new Vue({
    el: "#app",
    data: JSON.parse(localStorage.getItem("data")) || {
        date: Date.now(),
        start: Date.now(),
        classes: [{
            name: "Name",
            done: 0,
            total: 1
        }]
    },
    computed: {
        assignments: function () {
            let timeLeft = (new Date(this.date).getTime() - Date.now()) * 5 / 7;
            let todo = this.totalAssignments - this.totalDone;
            return Math.round(86400000 / (timeLeft / todo) * 100) / 100;
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
        addNew: function () {
            this.classes.push({
                name: "Name",
                done: 0,
                total: 1
            });
        },
        remove: function (i) {
            this.classes.splice(i, 1);
        }
    },
    updated: function () {
        localStorage.setItem("data", JSON.stringify({
            date: this.date,
            start: this.start,
            classes: this.classes
        }));
    }
});