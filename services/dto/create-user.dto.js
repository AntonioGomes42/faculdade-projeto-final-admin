export default class User {
    constructor (name, email, password ) {
        this.name = name;
        this.email = email;
        this.password = password;
    }
    toString() {
        return this.name + ', ' + this.email + ', ' + this.password;
    }
}