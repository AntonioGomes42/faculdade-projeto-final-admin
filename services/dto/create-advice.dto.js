export default class Advice {
    constructor (day, time, description ) {
        this.day = day;
        this.time = time;
        this.description = description;
    }
    toString() {
        return this.day + ', ' + this.time + ', ' + this.description;
    }
}